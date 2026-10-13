import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { addPipePoint, canDisplay, clone, createObject, demoScene, DEVICES, HEIGHT, makeId, removePipePoint, validateScene, WIDTH } from '../model/scene';
import type { ActionType, Energy, Filter, Layer, LayerFilter, MarkerType, Mode, MoveKind, PageSchema, PipeObject, SceneObject } from '../types/scene';

export const STORAGE_KEY = 'energy-studio-demo-v2';
const LEGACY_KEY = 'energy-studio-demo-v1';
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
interface SavedState { draft: PageSchema; published: PageSchema; savedAt: string }
function readSaved(): SavedState {
  if (typeof localStorage !== 'undefined') {
    for (const key of [STORAGE_KEY, LEGACY_KEY]) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const saved: unknown = JSON.parse(raw);
        if (!saved || typeof saved !== 'object') continue;
        const state = saved as Partial<SavedState>;
        validateScene(state.draft);
        validateScene(state.published);
        return { draft: clone(state.draft), published: clone(state.published), savedAt: state.savedAt || '' };
      } catch { /* Ignore stale or invalid local drafts. */ }
    }
  }
  const scene = demoScene();
  return { draft: scene, published: clone(scene), savedAt: '' };
}
interface DragState { id: string; kind: MoveKind; pointId?: string; clientX: number; clientY: number; original: SceneObject; before: PageSchema; moved: boolean }
export const useEditorStore = defineStore('energy-editor', () => {
  const initial = readSaved();
  const mode = ref<Mode>('edit');
  const scene = ref<PageSchema>(initial.draft);
  const published = ref<PageSchema>(initial.published);
  const selectedId = ref('');
  const filterEnergy = ref<Filter>('all');
  const filterLayer = ref<LayerFilter>('all');
  const zoom = ref(.8);
  const dirty = ref(false);
  const savedAt = ref(initial.savedAt);
  const undoHistory = ref<PageSchema[]>([]);
  const redoHistory = ref<PageSchema[]>([]);
  const toast = ref('');
  const detailsId = ref('');
  const mockTick = ref(Date.now());
  const pointer = ref<{ x: number; y: number } | null>(null);
  let drag: DragState | null = null;
  const activeScene = computed(() => mode.value === 'runtime' ? published.value : scene.value);
  const objects = computed(() => [...activeScene.value.objects].filter(o => canDisplay(o, filterEnergy.value, filterLayer.value)).sort((a,b) => a.z - b.z));
  const selected = computed(() => scene.value.objects.find(o => o.id === selectedId.value));
  const details = computed(() => published.value.objects.find(o => o.id === detailsId.value));
  const canUndo = computed(() => undoHistory.value.length > 0);
  const canRedo = computed(() => redoHistory.value.length > 0);
  function notify(message: string) { toast.value = message; }
  function pushHistory(previous: PageSchema) { undoHistory.value.push(previous); if (undoHistory.value.length > 70) undoHistory.value.shift(); redoHistory.value = []; dirty.value = true; }
  function mutate(fn: () => void) {
    if (mode.value !== 'edit') return;
    const before = clone(scene.value);
    fn();
    if (JSON.stringify(before) !== JSON.stringify(scene.value)) pushHistory(before);
  }
  function select(id: string) { if (mode.value === 'edit') selectedId.value = id; }
  function setMode(value: Mode) { mode.value = value; selectedId.value = ''; detailsId.value = ''; }
  function setZoom(value: number) { zoom.value = clamp(Math.round(value * 100)/100, .45, 1.5); }
  function fitZoom(viewWidth: number) { setZoom(clamp((viewWidth - 62) / WIDTH, .5, .9)); }
  function add(type: SceneObject['type'], x: number, y: number) {
    mutate(() => { const object = createObject(type, Math.round(clamp(x, 0, WIDTH-50)), Math.round(clamp(y,0,HEIGHT-40))); scene.value.objects.push(object); selectedId.value = object.id; });
  }
  function duplicate() {
    mutate(() => { const current = selected.value; if (!current) return;
      const copy = clone(current); copy.id = makeId(); copy.x += 28; copy.y += 24;
      if (copy.type === 'pipe') copy.points = copy.points.map(p => ({ id: makeId('pt'), x: p.x+28, y: p.y+24 }));
      scene.value.objects.push(copy); selectedId.value = copy.id;
    });
  }
  function remove() { mutate(() => { scene.value.objects = scene.value.objects.filter(o => o.id !== selectedId.value); selectedId.value = ''; }); }
  function patch(field: 'name' | 'x' | 'y' | 'w' | 'h' | 'z' | 'layer' | 'energy' | 'action' | 'marker', value: string | number) {
    mutate(() => { const o = selected.value; if (!o) return;
      if (['x','y','w','h','z'].includes(field)) {
        const n = Number(value); if (!Number.isFinite(n)) return;
        if (field === 'x' || field === 'y' || field === 'w' || field === 'h' || field === 'z') o[field] = clamp(n, field === 'w'||field === 'h' ? 30 : -999, 9999);
      } else if (field === 'marker') { if (o.type === 'pipe') o.marker = value as MarkerType; }
      else if (field === 'name') o.name = String(value).slice(0, 300);
      else if (field === 'layer') o.layer = value as Layer;
      else if (field === 'energy') o.energy = value as Energy;
      else if (field === 'action') o.action = value as ActionType;
    });
  }
  function setDevice(deviceId: string) {
    mutate(() => { const o = selected.value; if (!o) return;
      const device = DEVICES.find(d=>d.id===deviceId);
      o.binding = { deviceId: device?.id || '', param: '' }; // Clear points when device changes.
      if (device) o.energy = device.energy;
    });
  }
  function setParameter(param: string) {
    mutate(() => { const o = selected.value; if (!o) return; const dev = DEVICES.find(d=>d.id===o.binding.deviceId);
      o.binding.param = dev?.points.some(p=>p.id===param) ? param : '';
    });
  }
  function pipeAdd() { mutate(() => { const o = selected.value; if (o?.type === 'pipe' && !addPipePoint(o, o.points.length-2)) notify('折点已达到上限'); }); }
  function pipeRemove() { mutate(() => { const o = selected.value; if (o?.type === 'pipe' && !removePipePoint(o,o.points.length-2)) notify('至少保留两个节点'); }); }
  function startDrag(id: string, kind: MoveKind, clientX: number, clientY: number, pointId?: string) {
    if (mode.value !== 'edit') return;
    const obj = scene.value.objects.find(x => x.id === id);
    if (!obj) return;
    selectedId.value = id;
    drag = { id, kind, pointId, clientX, clientY, original: clone(obj), before: clone(scene.value), moved: false };
  }
  function moveDrag(clientX: number, clientY: number) {
    if (!drag) return;
    const obj = scene.value.objects.find(x => x.id === drag!.id);
    if (!obj) return;
    const dx = Math.round((clientX-drag.clientX)/zoom.value), dy = Math.round((clientY-drag.clientY)/zoom.value);
    if (dx === 0 && dy === 0) return;
    drag.moved = true;
    if (drag.kind === 'point' && obj.type === 'pipe' && drag.original.type === 'pipe') {
      const point = obj.points.find(p=>p.id===drag?.pointId);
      const previous = drag.original.points.find(p=>p.id===drag?.pointId);
      if (point && previous) { point.x = clamp(previous.x+dx,0,WIDTH); point.y = clamp(previous.y+dy,0,HEIGHT); }
    } else if (drag.kind === 'resize' && obj.type !== 'pipe' && drag.original.type !== 'pipe') {
      obj.w = clamp(drag.original.w+dx, 30, WIDTH);
      obj.h = clamp(drag.original.h+dy, 30, HEIGHT);
    } else if (obj.type === 'pipe' && drag.original.type === 'pipe') {
      const original = drag.original;
      obj.points.forEach((p,i)=>{
        p.x=clamp(original.points[i]!.x+dx,0,WIDTH);
        p.y=clamp(original.points[i]!.y+dy,0,HEIGHT);
      });
      obj.x = original.x+dx; obj.y = original.y+dy;
    } else if (obj.type !== 'pipe') {
      obj.x = clamp(drag.original.x+dx,0,WIDTH-35);
      obj.y = clamp(drag.original.y+dy,0,HEIGHT-35);
    }
  }
  function endDrag() {
    if (!drag) return;
    if (drag.moved && JSON.stringify(drag.before)!==JSON.stringify(scene.value)) pushHistory(drag.before);
    drag=null;
  }
  function undo() { if (!undoHistory.value.length || mode.value!=='edit') return; redoHistory.value.push(clone(scene.value)); scene.value=undoHistory.value.pop()!; selectedId.value=''; dirty.value=true; }
  function redo() { if (!redoHistory.value.length || mode.value!=='edit') return; undoHistory.value.push(clone(scene.value)); scene.value=redoHistory.value.pop()!; selectedId.value=''; dirty.value=true; }
  function persist(draft: PageSchema) {
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify({ draft, published: published.value, savedAt: savedAt.value })); }
    catch { notify('本地存储不可用，请导出 Schema'); }
  }
  function save() { validateScene(scene.value); savedAt.value = new Date().toISOString(); persist(clone(scene.value)); dirty.value=false; notify('草稿保存到本地浏览器'); }
  function publish() { validateScene(scene.value); published.value=clone(scene.value); save(); notify('已发布：切换运行预览查看'); }
  function reset() { mutate(()=>{scene.value=demoScene(); selectedId.value=''; filterEnergy.value='all'; filterLayer.value='all';}); notify('示例草稿已重置，发布版本未变化'); }
  function importScene(input: unknown) { validateScene(input); if (mode.value!=='edit') setMode('edit'); mutate(()=>{scene.value=clone(input);selectedId.value='';filterEnergy.value='all';filterLayer.value='all';}); notify('Schema 导入成功，请保存草稿'); }
  function openDetails(id: string) {
    const obj = published.value.objects.find(x=>x.id===id);
    if (!obj || obj.action==='none') return;
    if (obj.action==='navigate') { notify('页面跳转为模拟行为，不会访问生产路由'); return; }
    if (obj.action==='tooltip') { notify(`${obj.name} · 正常运行（Mock）`); return; }
    detailsId.value=id;
  }
  function closeDetails() { detailsId.value=''; }
  return { mode, scene, published, selectedId, filterEnergy, filterLayer, zoom, dirty, savedAt,
    undoHistory, redoHistory, toast, detailsId, details, mockTick, pointer, activeScene, objects, selected,
    canUndo, canRedo, notify, select, setMode, setZoom, fitZoom, add, duplicate, remove, patch,
    setDevice, setParameter, pipeAdd, pipeRemove, startDrag, moveDrag, endDrag, undo, redo, save, publish,
    reset, importScene, openDetails, closeDetails };
});