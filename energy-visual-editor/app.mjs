import { WIDTH, HEIGHT, ENERGY, LAYERS, DEVICES, createObject, demoScene, clone, validateScene, canDisplay, addPipePoint, removePipePoint, sampleReading } from './model.mjs';

const $ = (s) => document.querySelector(s);
const stage = $('#scene');
const inspector = $('#inspector');
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const option = (value, text, current) => `<option value="${esc(value)}" ${value === current ? 'selected' : ''}>${esc(text)}</option>`;
const storageKey = 'energy-studio-demo-v1';
function restored() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey));
    if (parsed?.draft && parsed?.published) { validateScene(parsed.draft); validateScene(parsed.published); return parsed; }
  } catch (e) { console.info('No compatible local draft found:', e.message); }
  const initial = demoScene(); return { draft: initial, published: clone(initial), savedAt: '' };
}
let persisted = restored();
const state = { mode: 'edit', scene: clone(persisted.draft), published: clone(persisted.published), selected: '', energy: 'all', layer: 'all', zoom: .8, undo: [], redo: [], savedAt: persisted.savedAt || '', dirty: false };
let drag = null, toastTimer = null;
const getObj = (id) => state.scene.objects.find(o => o.id === id);
const active = () => getObj(state.selected);
function persist() { try { localStorage.setItem(storageKey, JSON.stringify({ draft: persisted.draft, published: state.published, savedAt: state.savedAt })); } catch { notice('浏览器存储不可用，请导出 JSON 留存。'); } }
function notice(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600); }
function snapshot(before) { state.undo.push(clone(before)); if (state.undo.length > 70) state.undo.shift(); state.redo = []; state.dirty = true; }
function mutate(fn) { if (state.mode !== 'edit') return; const before = clone(state.scene); fn(); if (JSON.stringify(before) !== JSON.stringify(state.scene)) snapshot(before); render(); }
function selection(id) { state.selected = id; renderScene(); renderInspector(); }
function applyScene(next) { validateScene(next); state.scene = clone(next); state.selected = ''; state.energy = 'all'; state.layer = 'all'; render(); }
function deviceFor(o) { return DEVICES.find(d => d.id === o.binding?.deviceId); }
function pointInfo(o) { const d = deviceFor(o); return d?.points.find(p => p[0] === o.binding?.param); }
function displayValue(o) { const [value, unit] = sampleReading(o.binding); return `<span>${esc(value)}</span><small>${esc(unit)}</small>`; }
function renderFilters() {
  $('#energy-filters').innerHTML = [['all', '全部能源'], ...Object.entries(ENERGY).filter(([k]) => k !== 'all')].map(([key, name]) => `<button class="filter-option ${state.energy === key ? 'active' : ''}" data-energy-filter="${key}"><span class="color-dot ${key}"></span>${name}<em>${key === 'all' ? state.scene.objects.length : state.scene.objects.filter(o => o.energy === key).length}</em></button>`).join('');
  $('#layer-filters').innerHTML = [['all', '全部图层'], ...Object.entries(LAYERS)].map(([key, name]) => `<button class="filter-option ${state.layer === key ? 'active' : ''}" data-layer-filter="${key}">▤ &nbsp;${name}</button>`).join('');
}
function widgetHTML(o) {
  if (o.type === 'text') return `<div class="widget text">${esc(o.name)}</div>`;
  if (o.type === 'label') return `<div class="widget label">${esc(o.name)}</div>`;
  if (o.type === 'device') return `<div class="widget device ${o.energy}"><div class="device-icon">${o.energy === 'water' ? '◈' : o.energy === 'gas' ? '♨' : '⌁'}</div><div class="device-details"><strong>${esc(o.name)}</strong><small><span class="device-dot"></span>在线运行 · ${esc(ENERGY[o.energy])}</small></div></div>`;
  if (o.type === 'card') return `<div class="widget card"><div class="card-top"><span>${esc(o.name)}</span><span class="card-spark">⌁</span></div><div class="card-reading">${displayValue(o)}</div></div>`;
  if (o.type === 'meter') return `<div class="widget meter"><div class="meter-circle"><span>${esc(sampleReading(o.binding)[0])}</span></div><div class="meter-name">${esc(o.name)}</div></div>`;
  return '';
}
function pathData(points) { return points.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' '); }
function renderPipe(o) {
  const d = pathData(o.points);
  const endpoints = ['both','start'].includes(o.marker) ? [o.points[0]] : [];
  if (['both','end'].includes(o.marker)) endpoints.push(o.points.at(-1));
  const grips = (state.mode === 'edit' && state.selected === o.id) ? o.points.map((p,i) => `<circle class="point-grip" cx="${p.x}" cy="${p.y}" r="6" data-point-index="${i}"><title>拖动折点 ${i+1}</title></circle>`).join('') : '';
  return `<svg viewBox="0 0 ${WIDTH} ${HEIGHT}"><path d="${d}"/><title>${esc(o.name)}</title>${endpoints.map(p=>`<circle class="endpoint" cx="${p.x}" cy="${p.y}" r="6"/>`).join('')}${grips}</svg>`;
}
function renderScene() {
  $('#canvas-size').style.width = `${WIDTH * state.zoom}px`;
  $('#canvas-size').style.height = `${HEIGHT * state.zoom}px`;
  stage.style.transform = `scale(${state.zoom})`;
  const list = (state.mode === 'runtime' ? state.published : state.scene).objects;
  stage.innerHTML = `<div class="scene-header"></div><div class="scene-footer">ENERGY SYSTEM · DEMONSTRATION DATA</div>` + list.map(o => {
    if (!canDisplay(o, state.energy, state.layer)) return '';
    const selected = state.mode === 'edit' && o.id === state.selected;
    const style = o.type === 'pipe' ? `z-index:${o.z}` : `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;z-index:${o.z}`;
    return `<div class="scene-object ${o.type === 'pipe' ? 'pipe ' + o.energy : ''} ${selected ? 'selected' : ''}" data-id="${esc(o.id)}" style="${style}" title="${esc(o.name)}">${o.type === 'pipe' ? renderPipe(o) : widgetHTML(o)}${selected && o.type !== 'pipe' ? '<span class="resize-grip" data-resize="1"></span>' : ''}</div>`;
  }).join('');
  $('#count-label').textContent = `${list.length} 个元素`;
}
function renderInspector() {
  if (state.mode === 'runtime') { inspector.innerHTML = `<div class="empty-inspector"><div class="empty-icon">◈</div><strong>运行预览中</strong><p>展示的是最近一次发布的版本。<br>点击画布中的设备或卡片<br>查看模拟实时参数与交互。</p></div><div class="hint-card"><strong>Draft / Published 隔离</strong>草稿的修改不会影响已发布场景，直到点击「发布页面」。</div>`; return; }
  const o = active();
  if (!o) { inspector.innerHTML = `<div class="empty-inspector"><div class="empty-icon">☷</div><strong>尚未选中任何元素</strong><p>点击画布中的元素进行配置，<br>或从左侧添加新组件。<br>支持拖动、缩放与管线折点。</p></div><div class="hint-card"><strong>操作提示</strong>⌘/Ctrl + Z 撤销，Delete 删除；<br>可拖拽左侧组件进入画布，<br>也可使用 JSON 导出与恢复。</div>`; return; }
  const binding = o.binding || { deviceId:'', param:'' };
  const dev = deviceFor(o);
  const fields = dev?.points || [];
  const form = (label, field, value, type='text') => `<div class="form-field"><label>${label}</label><input data-field="${field}" type="${type}" value="${esc(value)}"></div>`;
  const select = (label, field, entries, value) => `<div class="form-field"><label>${label}</label><select data-field="${field}">${entries.map(([k,v])=>option(k,v,value)).join('')}</select></div>`;
  inspector.innerHTML = `<section class="inspector-block"><h3 class="inspector-heading">基本信息 · ${esc(o.type.toUpperCase())}</h3>${form('组件名称','name',o.name)}<div class="form-row">${form('X 坐标','x',Math.round(o.x),'number')}${form('Y 坐标','y',Math.round(o.y),'number')}</div>${o.type !== 'pipe' ? `<div class="form-row">${form('宽度','w',o.w,'number')}${form('高度','h',o.h,'number')}</div>` : `<div class="field-note">管线通过节点坐标确定几何形状。</div>`}${form('图层顺序 zIndex','z',o.z,'number')}${select('逻辑图层','layer',Object.entries(LAYERS),o.layer)}${select('能源类型','energy',Object.entries(ENERGY).filter(([k])=>k!=='all'),o.energy)}</section><div class="inspector-separator"></div><section><h3 class="inspector-heading">数据绑定 · MOCK</h3>${select('工艺设备','deviceId',[['','暂未绑定'],...DEVICES.map(d=>[d.id,d.name])],binding.deviceId)}${select('参数点位','param',[['','未选择'],...fields.map(p=>[p[0],`${p[1]} ${p[2]}`])],binding.param)}<p class="field-note">采集/虚拟参数在真实系统中由数据适配层提供。此演示仅使用本地固定样例。</p></section><div class="inspector-separator"></div><section><h3 class="inspector-heading">行为与交互</h3>${select('点击事件','action',[['popup','打开详情浮层'],['tooltip','显示提示'],['navigate','页面跳转（模拟）'],['none','无动作']],o.action)}${o.type === 'pipe' ? `${select('端点圆点','marker',[['none','不显示'],['start','起点'],['end','终点'],['both','两端']],o.marker || 'both')}<div class="field-note">${o.points.length} 个节点；支持拖动端点和折点，节点不少于 2 个。</div><div class="inspector-actions"><button class="btn" data-action="pipe-add">＋ 加折点</button><button class="btn" data-action="pipe-remove" ${o.points.length<=2?'disabled':''}>− 删折点</button></div>` : ''}</section><div class="inspector-separator"></div><div class="inspector-actions"><button class="btn" data-action="duplicate">复制组件</button><button class="btn" data-action="delete">删除组件</button></div>`;
}
function renderToolbar() {
  document.body.classList.toggle('mode-runtime', state.mode === 'runtime');
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
  document.querySelectorAll('[data-action="undo"], [data-action="redo"], [data-action="save"], [data-action="publish"]').forEach(b => {
    b.disabled = state.mode === 'runtime' || (b.dataset.action === 'undo' && !state.undo.length) || (b.dataset.action === 'redo' && !state.redo.length);
  });
  $('#zoom-text').textContent = `${Math.round(state.zoom * 100)}%`;
  $('#save-status').textContent = state.mode === 'runtime' ? '已发布版本 · 可交互预览' : state.dirty ? '● 草稿有未保存改动' : state.savedAt ? `草稿已保存 · ${new Date(state.savedAt).toLocaleTimeString('zh-CN')}` : '当前为编辑态 · 本地模拟数据';
  $('#mode-label').textContent = state.mode === 'runtime' ? 'RUNTIME · 交互预览' : 'EDITOR · 自由定位';
}
function render() { renderFilters(); renderToolbar(); renderScene(); renderInspector(); }
function setMode(mode) { if (mode === state.mode) return; state.mode = mode; state.selected = ''; render(); notice(mode === 'runtime' ? '正在展示最近发布的场景（非当前草稿）' : '已返回编辑态'); }
function add(type,x,y) { mutate(() => { const obj = createObject(type, Math.round(x), Math.round(y)); state.scene.objects.push(obj); state.selected = obj.id; }); }
function undo() { if (!state.undo.length) return; state.redo.push(clone(state.scene)); state.scene = state.undo.pop(); state.selected = ''; state.dirty = true; render(); }
function redo() { if (!state.redo.length) return; state.undo.push(clone(state.scene)); state.scene = state.redo.pop(); state.selected = ''; state.dirty = true; render(); }
function save() { validateScene(state.scene); persisted.draft = clone(state.scene); state.savedAt = new Date().toISOString(); persisted.savedAt = state.savedAt; state.dirty = false; persist(); renderToolbar(); notice('草稿已保存至当前浏览器'); }
function publish() { save(); state.published = clone(state.scene); persist(); notice('页面已发布：切换「运行预览」查看'); }
function exportJSON() { const json = JSON.stringify(state.mode === 'runtime' ? state.published : state.scene, null, 2); const a = document.createElement('a'); const url = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.href = url; a.download = 'energy-scene-sanitized.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 3000); notice('JSON Schema 已导出'); }
function openDetails(o) { if (o.action === 'none') return; if (o.action === 'navigate') { notice('模拟页面跳转：真实路由不在公开演示中执行'); return; } if (o.action === 'tooltip') { notice(`${o.name} · 运行状态正常`); return; }
  const d = deviceFor(o); const p = pointInfo(o); const [value, unit] = sampleReading(o.binding);
  $('#modal-title').textContent = o.name;
  $('#modal-body').innerHTML = `<div class="detail-row"><span>组件类型</span><strong>${esc(o.type)}</strong></div><div class="detail-row"><span>能源分类</span><strong>${esc(ENERGY[o.energy])}</strong></div><div class="detail-row"><span>关联设备</span><strong>${esc(d?.name || '未绑定')}</strong></div><div class="detail-row"><span>模拟参数</span><strong>${esc(p?.[1] || '暂无')}</strong></div><div class="detail-row"><span>模拟读数</span><strong>${esc(value)} ${esc(unit)}</strong></div><div class="detail-row"><span>数据来源</span><strong>本地样例 · 非生产数据</strong></div>`;
  $('#modal').hidden = false;
}
function closeModal() { $('#modal').hidden = true; }
function clamp(v,min,max) {return Math.min(max,Math.max(min,v));}
function scenePos(e) { const r=stage.getBoundingClientRect(); return { x:Math.round((e.clientX-r.left)/state.zoom), y:Math.round((e.clientY-r.top)/state.zoom) }; }

// Pointer tracking stays on window; rerendering the scene will not interrupt a drag.
stage.addEventListener('pointerdown', e => {
  const node = e.target.closest('.scene-object');
  if (state.mode === 'runtime') { if (node) { const o = state.published.objects.find(x=>x.id===node.dataset.id); if (o) openDetails(o); } return; }
  if (!node) { selection(''); return; }
  const o = getObj(node.dataset.id); if (!o) return;
  const pointIndex = e.target.closest('[data-point-index]')?.dataset.pointIndex;
  const mode = pointIndex !== undefined ? 'point' : e.target.closest('[data-resize]') ? 'resize' : 'move';
  state.selected = o.id;
  drag = { id:o.id, mode, index:Number(pointIndex), x:e.clientX, y:e.clientY, original:clone(o), before:clone(state.scene), moved:false };
  renderScene(); renderInspector();
  e.preventDefault();
});
window.addEventListener('pointermove', e => {
  const pos = scenePos(e); $('#cursor-coords').textContent = `X: ${pos.x} / Y: ${pos.y}`;
  if (!drag) return;
  const o = getObj(drag.id); if (!o) return;
  const dx = Math.round((e.clientX-drag.x)/state.zoom), dy = Math.round((e.clientY-drag.y)/state.zoom);
  if (!dx && !dy && !drag.moved) return;
  drag.moved = true;
  if (drag.mode === 'point') { const p=o.points[drag.index]; if (!p) return; p.x=clamp(drag.original.points[drag.index].x+dx,0,WIDTH); p.y=clamp(drag.original.points[drag.index].y+dy,0,HEIGHT); }
  else if (drag.mode === 'resize') { o.w=clamp(drag.original.w+dx,40,WIDTH); o.h=clamp(drag.original.h+dy,35,HEIGHT); }
  else if (o.type === 'pipe') { o.points.forEach((p,i) => {p.x=clamp(drag.original.points[i].x+dx,0,WIDTH);p.y=clamp(drag.original.points[i].y+dy,0,HEIGHT);}); o.x=drag.original.x+dx; o.y=drag.original.y+dy; }
  else { o.x=clamp(drag.original.x+dx,0,WIDTH-35);o.y=clamp(drag.original.y+dy,0,HEIGHT-35); }
  renderScene();
});
window.addEventListener('pointerup', () => { if (!drag) return; if (drag.moved && JSON.stringify(drag.before) !== JSON.stringify(state.scene)) { snapshot(drag.before); render(); } drag=null; });
window.addEventListener('pointercancel', () => { drag=null; render(); });

$('#inspector').addEventListener('change',e=>{
  const field=e.target.dataset.field; if (!field) return;
  const val=e.target.value;
  mutate(()=>{const o=active(); if (!o) return;
    if (field === 'deviceId') {o.binding={deviceId:val,param:''}; return;}
    if (field === 'param') {o.binding.param=val; return;}
    if (['x','y','w','h','z'].includes(field)) {const n=Number(val);if (!Number.isFinite(n)) return; o[field]=clamp(n,field==='w'||field==='h'?35:-999,field==='z'?9999:9999);return;}
    o[field]=val;
  });
});
$('#energy-filters').addEventListener('click',e=>{const b=e.target.closest('[data-energy-filter]');if(b){state.energy=b.dataset.energyFilter;render();}});
$('#layer-filters').addEventListener('click',e=>{const b=e.target.closest('[data-layer-filter]');if(b){state.layer=b.dataset.layerFilter;render();}});
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
document.querySelectorAll('.palette-item').forEach(b=>{
  b.addEventListener('click',()=>{if(state.mode==='edit')add(b.dataset.type,Math.round(440+Math.random()*40),Math.round(180+Math.random()*40));});
  b.addEventListener('dragstart',e=>{if(state.mode!=='edit'){e.preventDefault();return;}e.dataTransfer.setData('text/plain',b.dataset.type);e.dataTransfer.effectAllowed='copy';});
});
$('#viewport').addEventListener('dragover',e=>{if(state.mode==='edit')e.preventDefault();});
$('#viewport').addEventListener('drop',e=>{if(state.mode!=='edit')return;e.preventDefault();const type=e.dataTransfer.getData('text/plain');if(!['text','label','device','meter','card','pipe'].includes(type))return;const p=scenePos(e);add(type,clamp(p.x,0,WIDTH-190),clamp(p.y,0,HEIGHT-120));});
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const action=b.dataset.action;
  if(action==='undo')undo();else if(action==='redo')redo();else if(action==='save')save();else if(action==='publish')publish();else if(action==='export')exportJSON();
  else if(action==='zoom-in'){state.zoom=clamp(Number((state.zoom+.1).toFixed(2)),.45,1.5);renderToolbar();renderScene();}
  else if(action==='zoom-out'){state.zoom=clamp(Number((state.zoom-.1).toFixed(2)),.45,1.5);renderToolbar();renderScene();}
  else if(action==='zoom-reset'){state.zoom=Math.min(.9,Math.max(.45,($('#viewport').clientWidth-56)/WIDTH));renderToolbar();renderScene();}
  else if(action==='reset'){mutate(()=>{state.scene=demoScene();state.selected='';state.energy='all';state.layer='all';});notice('已恢复示例草稿，发布版本保持不变');}
  else if(action==='delete'){mutate(()=>{state.scene.objects=state.scene.objects.filter(o=>o.id!==state.selected);state.selected='';});}
  else if(action==='duplicate'){mutate(()=>{const o=active();if(!o)return;const c=clone(o);c.id=`obj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;c.x+=28;c.y+=24;if(c.type==='pipe')c.points=c.points.map(p=>({...p,id:`pt-${Math.random().toString(36).slice(2,9)}`,x:p.x+28,y:p.y+24}));state.scene.objects.push(c);state.selected=c.id;});}
  else if(action==='pipe-add'){const o=active();if(o?.type==='pipe')mutate(()=>{if(!addPipePoint(o,o.points.length-2))notice('无法继续增加折点');});}
  else if(action==='pipe-remove'){const o=active();if(o?.type==='pipe')mutate(()=>{if(!removePipePoint(o,o.points.length-2))notice('管线至少需要两个节点');});}
});
$('#import-file').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>500_000)throw Error('文件超过 500 KB');const next=JSON.parse(await file.text());const before=clone(state.scene);validateScene(next);if(state.mode!=='edit')setMode('edit');applyScene(next);snapshot(before);render();notice('Schema 导入成功，点击保存草稿以留存');}catch(err){notice(`导入失败：${err.message}`);}finally{e.target.value='';}});
window.addEventListener('keydown',e=>{const t=e.target.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(t))return;const mod=e.metaKey||e.ctrlKey;if(mod&&e.key.toLowerCase()==='z'){e.preventDefault();if(e.shiftKey)redo();else undo();}else if(mod&&e.key.toLowerCase()==='y'){e.preventDefault();redo();}else if((e.key==='Delete'||e.key==='Backspace')&&state.mode==='edit'&&state.selected){e.preventDefault();mutate(()=>{state.scene.objects=state.scene.objects.filter(o=>o.id!==state.selected);state.selected='';});}else if(e.key==='Escape')closeModal();});
$('#close-modal').addEventListener('click',closeModal);$('#modal-ok').addEventListener('click',closeModal);$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
// Readings update locally; published Scene and Schema remain unchanged.
setInterval(()=>{if(state.mode!=='runtime')return;document.querySelectorAll('.scene-object').forEach(node=>{const o=state.published.objects.find(x=>x.id===node.dataset.id);if(!o)return;if(o.type==='card'){const v=node.querySelector('.card-reading');if(v)v.innerHTML=displayValue(o);}if(o.type==='meter'){const v=node.querySelector('.meter-circle span');if(v)v.textContent=String(sampleReading(o.binding)[0]);}});},4000);
state.zoom=Math.min(.9,Math.max(.5,($('#viewport').clientWidth-62)/WIDTH));
render();