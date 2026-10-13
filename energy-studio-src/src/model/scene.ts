import type { Binding, Energy, Filter, Layer, LayerFilter, MockDevice, ObjectType, PageSchema, PipeObject, SceneObject } from '../types/scene';

export const WIDTH = 1120;
export const HEIGHT = 660;
export const ENERGY: Record<Filter, string> = { all: '全部能源', electric: '电力', water: '水务', gas: '燃气' };
export const LAYERS: Record<Layer, string> = { overview: '总览', electric: '电力层', water: '水务层', gas: '燃气层' };
export const DEVICES: MockDevice[] = [
  { id: 'mock-ahu-01', name: '空调机组 A-01', energy: 'electric', points: [
    { id: 'power', name: '实时功率', unit: 'kW', kind: 'collected' }, { id: 'load', name: '负载率', unit: '%', kind: 'virtual' }, { id: 'state', name: '运行状态', unit: '', kind: 'collected' }] },
  { id: 'mock-pump-02', name: '循环水泵 P-02', energy: 'water', points: [
    { id: 'flow', name: '瞬时流量', unit: 'm³/h', kind: 'collected' }, { id: 'pressure', name: '出口压力', unit: 'MPa', kind: 'collected' }, { id: 'state', name: '运行状态', unit: '', kind: 'collected' }] },
  { id: 'mock-meter-03', name: '能源计量表 M-03', energy: 'electric', points: [
    { id: 'energy', name: '累计耗电', unit: 'kWh', kind: 'virtual' }, { id: 'voltage', name: '线电压', unit: 'V', kind: 'collected' }, { id: 'state', name: '运行状态', unit: '', kind: 'collected' }] },
  { id: 'mock-gas-04', name: '燃气阀组 G-04', energy: 'gas', points: [
    { id: 'flow', name: '燃气流量', unit: 'Nm³/h', kind: 'collected' }, { id: 'pressure', name: '管道压力', unit: 'kPa', kind: 'collected' }, { id: 'state', name: '运行状态', unit: '', kind: 'collected' }] }
];
let serial = 500;
export const makeId = (prefix = 'obj') => `${prefix}-${Date.now().toString(36)}-${++serial}`;
export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function createObject(type: ObjectType, x = 180, y = 160): SceneObject {
  const base = { id: makeId(), name: '', x, y, w: 190, h: 88, z: 30, layer: 'overview' as Layer,
    energy: 'electric' as Energy, binding: { deviceId: '', param: '' }, action: 'popup' as const };
  switch (type) {
    case 'device': return { ...base, type, name: '能源设备', w: 206, h: 90 };
    case 'meter': return { ...base, type, name: '智能仪表', w: 168, h: 116 };
    case 'card': return { ...base, type, name: '能耗指标', w: 206, h: 110 };
    case 'label': return { ...base, type, name: '区域标签', w: 166, h: 50, action: 'none' };
    case 'text': return { ...base, type, name: '生产能源总览', w: 260, h: 55, action: 'none' };
    case 'pipe': return { ...base, type, name: '输送管线', w: 0, h: 0, z: 15,
      points: [{ id: makeId('pt'), x, y }, { id: makeId('pt'), x: x + 150, y }, { id: makeId('pt'), x: x + 150, y: y + 75 }], marker: 'both' };
  }
}

export function demoScene(): PageSchema {
  const source: Array<{ type: Exclude<ObjectType, 'pipe'>; name: string; x: number; y: number; w: number; h: number; z: number; layer: Layer; energy: Energy; deviceId?: string; param?: string }> = [
    { type: 'text', name: '厂区能源监控总览', x: 53, y: 35, w: 435, h: 56, z: 20, layer: 'overview', energy: 'electric' },
    { type: 'label', name: '动力能源区 · A 区', x: 60, y: 123, w: 225, h: 46, z: 20, layer: 'overview', energy: 'electric' },
    { type: 'device', name: '空调机组 A-01', x: 76, y: 245, w: 206, h: 92, z: 35, layer: 'electric', energy: 'electric', deviceId: 'mock-ahu-01', param: 'power' },
    { type: 'device', name: '循环水泵 P-02', x: 440, y: 245, w: 206, h: 92, z: 35, layer: 'water', energy: 'water', deviceId: 'mock-pump-02', param: 'flow' },
    { type: 'device', name: '燃气阀组 G-04', x: 805, y: 245, w: 206, h: 92, z: 35, layer: 'gas', energy: 'gas', deviceId: 'mock-gas-04', param: 'flow' },
    { type: 'meter', name: '能源计量表 M-03', x: 76, y: 443, w: 168, h: 118, z: 35, layer: 'electric', energy: 'electric', deviceId: 'mock-meter-03', param: 'energy' },
    { type: 'card', name: '实时用电功率', x: 321, y: 443, w: 205, h: 114, z: 35, layer: 'electric', energy: 'electric', deviceId: 'mock-ahu-01', param: 'power' },
    { type: 'card', name: '水循环流量', x: 608, y: 443, w: 205, h: 114, z: 35, layer: 'water', energy: 'water', deviceId: 'mock-pump-02', param: 'flow' },
    { type: 'card', name: '燃气瞬时流量', x: 859, y: 443, w: 205, h: 114, z: 35, layer: 'gas', energy: 'gas', deviceId: 'mock-gas-04', param: 'flow' }
  ];
  const widgets = source.map(({ deviceId = '', param = '', ...item }) => ({ ...createObject(item.type, item.x, item.y), ...item, binding: { deviceId, param } } as SceneObject));
  const pipes = [
    { name: '电力主线', energy: 'electric' as Energy, layer: 'electric' as Layer, pts: [[282,290],[350,290],[350,407],[160,407],[160,443]] },
    { name: '循环水管线', energy: 'water' as Energy, layer: 'water' as Layer, pts: [[646,290],[699,290],[699,443]] },
    { name: '燃气管线', energy: 'gas' as Energy, layer: 'gas' as Layer, pts: [[904,337],[904,410],[961,410],[961,443]] }
  ].map(({ name, energy, layer, pts }) => ({ ...createObject('pipe'), name, energy, layer, points: pts.map(([x, y]) => ({ id: makeId('pt'), x, y })) } as PipeObject));
  return { schemaVersion: '1.0.0', pageName: '能源组态演示场景', width: WIDTH, height: HEIGHT, objects: [...pipes, ...widgets] };
}

const allowedTypes = new Set(['text', 'label', 'card', 'device', 'meter', 'pipe']);
const allowedActions = new Set(['popup', 'tooltip', 'navigate', 'none']);
const allowedMarkers = new Set(['none', 'start', 'end', 'both']);
export function validateScene(data: unknown): asserts data is PageSchema {
  if (!data || typeof data !== 'object') throw Error('Schema 必须为对象');
  const s = data as Partial<PageSchema>;
  if (s.schemaVersion !== '1.0.0' || typeof s.pageName !== 'string' || s.pageName.length > 200) throw Error('Schema 版本或页面名称无效');
  if (s.width !== WIDTH || s.height !== HEIGHT) throw Error(`画布尺寸必须为 ${WIDTH} × ${HEIGHT}`);
  if (!Array.isArray(s.objects) || s.objects.length > 500) throw Error('元素数组无效或超过 500 个');
  const ids = new Set<string>();
  for (const o of s.objects) {
    if (!o || !allowedTypes.has(o.type) || typeof o.id !== 'string' || o.id.length > 128 || ids.has(o.id)) throw Error('元素类型 / ID 无效或重复');
    ids.add(o.id);
    if (typeof o.name !== 'string' || o.name.length > 300 || !Number.isFinite(o.x) || !Number.isFinite(o.y) || !Number.isFinite(o.z) ||
        !['overview', 'electric', 'water', 'gas'].includes(o.layer) || !['electric', 'water', 'gas'].includes(o.energy) || !allowedActions.has(o.action)) throw Error(`元素 ${o.id} 属性无效`);
    if (!o.binding || typeof o.binding.deviceId !== 'string' || typeof o.binding.param !== 'string') throw Error('绑定字段无效');
    if (o.type === 'pipe') {
      if (!Array.isArray(o.points) || o.points.length < 2 || o.points.length > 200 || !allowedMarkers.has(o.marker) ||
        o.points.some(p => !p || typeof p.id !== 'string' || !Number.isFinite(p.x) || !Number.isFinite(p.y))) throw Error('管线必须有 2–200 个有效节点');
      if (new Set(o.points.map(p => p.id)).size !== o.points.length) throw Error('管线节点 ID 不能重复');
    } else if (!Number.isFinite(o.w) || !Number.isFinite(o.h) || o.w < 30 || o.h < 30) throw Error('组件宽高无效');
  }
}
export const canDisplay = (o: SceneObject, energy: Filter = 'all', layer: LayerFilter = 'all') =>
  (energy === 'all' || o.energy === energy || o.layer === 'overview') && (layer === 'all' || o.layer === layer);
export function addPipePoint(pipe: PipeObject, afterIndex: number): boolean {
  if (pipe.points.length >= 200) return false;
  const p = pipe.points[afterIndex], n = pipe.points[afterIndex + 1];
  if (!p || !n) return false;
  pipe.points.splice(afterIndex + 1, 0, { id: makeId('pt'), x: Math.round((p.x+n.x)/2), y: Math.round((p.y+n.y)/2) });
  return true;
}
export function removePipePoint(pipe: PipeObject, index: number): boolean {
  if (pipe.points.length <= 2 || index < 0 || index >= pipe.points.length) return false;
  pipe.points.splice(index, 1);
  return true;
}
export function sampleReading(binding: Binding, time = Date.now()): [string | number, string] {
  const readings: Record<string, [number, string]> = {
    'mock-ahu-01:power': [186.4,'kW'], 'mock-ahu-01:load': [73.2,'%'],
    'mock-pump-02:flow': [128.6,'m³/h'], 'mock-pump-02:pressure': [0.43,'MPa'],
    'mock-meter-03:energy': [37821,'kWh'], 'mock-meter-03:voltage': [381.8,'V'],
    'mock-gas-04:flow': [46.2,'Nm³/h'], 'mock-gas-04:pressure': [37.5,'kPa']
  };
  if (binding.param === 'state' && binding.deviceId) return ['正常',''];
  const reading = readings[`${binding.deviceId}:${binding.param}`];
  if (!reading) return ['--', ''];
  return [Number((reading[0] * (1 + Math.sin(time/11000 + reading[0]) * .008)).toFixed(1)), reading[1]];
}