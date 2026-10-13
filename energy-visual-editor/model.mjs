/** Independent, sanitized energy-topology configuration model. No production endpoints. */
export const WIDTH = 1120;
export const HEIGHT = 660;
export const ENERGY = { all: '全部能源', electric: '电力', water: '水务', gas: '燃气' };
export const LAYERS = { overview: '总览', electric: '电力层', water: '水务层', gas: '燃气层' };
export const DEVICES = [
  { id: 'mock-ahu-01', name: '空调机组 A-01', energy: 'electric', points: [['power', '实时功率', 'kW'], ['load', '负载率', '%'], ['state', '运行状态', '']] },
  { id: 'mock-pump-02', name: '循环水泵 P-02', energy: 'water', points: [['flow', '瞬时流量', 'm³/h'], ['pressure', '出口压力', 'MPa'], ['state', '运行状态', '']] },
  { id: 'mock-meter-03', name: '能源计量表 M-03', energy: 'electric', points: [['energy', '累计耗电', 'kWh'], ['voltage', '线电压', 'V'], ['state', '运行状态', '']] },
  { id: 'mock-gas-04', name: '燃气阀组 G-04', energy: 'gas', points: [['flow', '燃气流量', 'Nm³/h'], ['pressure', '管道压力', 'kPa'], ['state', '运行状态', '']] },
];
let seq = 500;
export const newId = () => `obj-${Date.now().toString(36)}-${++seq}`;
export function createObject(type, x = 180, y = 160) {
  const common = { id: newId(), type, name: '', x, y, w: 190, h: 88, z: 30, layer: 'overview', energy: 'electric', binding: { deviceId: '', param: '' }, action: 'popup' };
  if (type === 'device') return { ...common, name: '能源设备', w: 206, h: 90 };
  if (type === 'meter') return { ...common, name: '智能仪表', w: 168, h: 116 };
  if (type === 'card') return { ...common, name: '能耗指标', w: 206, h: 110 };
  if (type === 'label') return { ...common, name: '区域标签', w: 166, h: 50, action: 'none' };
  if (type === 'text') return { ...common, name: '生产能源总览', w: 260, h: 55, action: 'none' };
  if (type === 'pipe') return { ...common, name: '输送管线', w: 0, h: 0, z: 15, points: [{ id: newId(), x, y }, { id: newId(), x: x + 150, y }, { id: newId(), x: x + 150, y: y + 75 }], marker: 'both' };
  throw Error('Unsupported object type');
}
export function clone(data) { return JSON.parse(JSON.stringify(data)); }
export function demoScene() {
  const items = [
    { type: 'text', name: '厂区能源监控总览', x: 53, y: 35, w: 435, h: 56, z: 20, layer: 'overview', energy: 'electric' },
    { type: 'label', name: '动力能源区 · A 区', x: 60, y: 123, w: 225, h: 46, z: 20, layer: 'overview', energy: 'electric' },
    { type: 'device', name: '空调机组 A-01', x: 76, y: 245, w: 206, h: 92, z: 35, layer: 'electric', energy: 'electric', deviceId: 'mock-ahu-01', param: 'power' },
    { type: 'device', name: '循环水泵 P-02', x: 440, y: 245, w: 206, h: 92, z: 35, layer: 'water', energy: 'water', deviceId: 'mock-pump-02', param: 'flow' },
    { type: 'device', name: '燃气阀组 G-04', x: 805, y: 245, w: 206, h: 92, z: 35, layer: 'gas', energy: 'gas', deviceId: 'mock-gas-04', param: 'flow' },
    { type: 'meter', name: '能源计量表 M-03', x: 76, y: 443, w: 168, h: 118, z: 35, layer: 'electric', energy: 'electric', deviceId: 'mock-meter-03', param: 'energy' },
    { type: 'card', name: '实时用电功率', x: 321, y: 443, w: 205, h: 114, z: 35, layer: 'electric', energy: 'electric', deviceId: 'mock-ahu-01', param: 'power' },
    { type: 'card', name: '水循环流量', x: 608, y: 443, w: 205, h: 114, z: 35, layer: 'water', energy: 'water', deviceId: 'mock-pump-02', param: 'flow' },
    { type: 'card', name: '燃气瞬时流量', x: 859, y: 443, w: 205, h: 114, z: 35, layer: 'gas', energy: 'gas', deviceId: 'mock-gas-04', param: 'flow' },
  ].map((o) => ({ ...createObject(o.type, o.x, o.y), ...o, binding: { deviceId: o.deviceId || '', param: o.param || '' } }));
  const pipes = [
    { name: '电力主线', energy: 'electric', layer: 'electric', pts: [[282, 290], [350, 290], [350, 407], [160, 407], [160, 443]] },
    { name: '循环水管线', energy: 'water', layer: 'water', pts: [[646, 290], [699, 290], [699, 443]] },
    { name: '燃气管线', energy: 'gas', layer: 'gas', pts: [[904, 337], [904, 410], [961, 410], [961, 443]] },
  ].map(p => ({ ...createObject('pipe'), name: p.name, energy: p.energy, layer: p.layer, points: p.pts.map(([x,y]) => ({ id: newId(), x, y })) }));
  return { schemaVersion: '1.0.0', pageName: '能源组态演示场景', width: WIDTH, height: HEIGHT, objects: [...pipes, ...items] };
}
export function validateScene(scene) {
  if (!scene || typeof scene !== 'object' || !Array.isArray(scene.objects) || scene.objects.length > 500) throw Error('Schema 缺少 objects 或元素数量超限（500）');
  if (scene.width !== WIDTH || scene.height !== HEIGHT) throw Error(`画布尺寸必须为 ${WIDTH} × ${HEIGHT}`);
  const ids = new Set();
  for (const o of scene.objects) {
    if (!o || !['text','label','card','device','meter','pipe'].includes(o.type) || typeof o.id !== 'string' || ids.has(o.id)) throw Error('元素类型 / ID 无效或重复');
    ids.add(o.id);
    if (!Number.isFinite(o.x) || !Number.isFinite(o.y) || !Number.isFinite(o.z) || !ENERGY[o.energy] || !LAYERS[o.layer]) throw Error(`元素 ${o.id} 的位置或属性无效`);
    if (o.type === 'pipe' && (!Array.isArray(o.points) || o.points.length < 2 || o.points.length > 200 || o.points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y)))) throw Error('管线必须具有 2–200 个有效节点');
    if (o.type !== 'pipe' && (!Number.isFinite(o.w) || !Number.isFinite(o.h) || o.w < 30 || o.h < 30)) throw Error('元素宽高无效');
  }
  return true;
}
export function canDisplay(o, filter = 'all', layer = 'all') { return (filter === 'all' || o.energy === filter || o.layer === 'overview') && (layer === 'all' || o.layer === layer); }
export function addPipePoint(pipe, index) { if (pipe.type !== 'pipe' || pipe.points.length >= 200) return false; const p = pipe.points[index], n = pipe.points[index+1]; if (!n) return false; pipe.points.splice(index + 1, 0, { id: newId(), x: Math.round((p.x + n.x)/2), y: Math.round((p.y + n.y)/2) }); return true; }
export function removePipePoint(pipe, index) { if (pipe.type !== 'pipe' || pipe.points.length <= 2) return false; pipe.points.splice(index, 1); return true; }
export function sampleReading(binding, time = Date.now()) {
  const key = `${binding?.deviceId || ''}:${binding?.param || ''}`;
  const list = { 'mock-ahu-01:power': [186.4,'kW'], 'mock-ahu-01:load': [73.2,'%'], 'mock-pump-02:flow': [128.6,'m³/h'], 'mock-pump-02:pressure': [0.43,'MPa'], 'mock-meter-03:energy': [37821,'kWh'], 'mock-meter-03:voltage': [381.8,'V'], 'mock-gas-04:flow': [46.2,'Nm³/h'], 'mock-gas-04:pressure': [37.5,'kPa'] };
  if (binding?.param === 'state') return ['正常',''];
  const reading = list[key]; if (!reading) return ['--',''];
  return [Number((reading[0] * (1 + Math.sin(time/11000 + reading[0]) * .008)).toFixed(1)), reading[1]];
}