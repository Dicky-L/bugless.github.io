/* Energy Studio V2.0 — isolated interaction enhancements for sanitized demo */
(() => {
  'use strict';
  const STORAGE = 'energy-studio-demo-v2';
  const ACTIONS = new Set(['add','duplicate','remove','patch','setDevice','setParameter','pipeAdd','pipeRemove','endDrag','undo','redo','reset','importScene']);
  function getStore() {
    const app = document.querySelector('#app')?.__vue_app__;
    const provides = app?._context?.provides;
    if (!provides) return null;
    for (const key of Reflect.ownKeys(provides)) {
      const value = provides[key];
      if (value?._s instanceof Map && value._s.has('energy-editor')) return value._s.get('energy-editor');
    }
    return null;
  }
  function install(store) {
    let clipboard = null, pasteCount = 0, backupTimer = 0;
    const copy = v => JSON.parse(JSON.stringify(v));
    const editing = () => store.mode === 'edit' && !!document.querySelector('.canvas-viewport');
    const flush = () => {
      clearTimeout(backupTimer);
      if (!store.dirty) return;
      try {
        localStorage.setItem(STORAGE, JSON.stringify({
          draft: store.scene, published: store.published, savedAt: store.savedAt
        }));
      } catch (error) { console.warn('[Energy Studio] Draft backup unavailable', error); }
    };
    const schedule = () => {
      clearTimeout(backupTimer);
      backupTimer = window.setTimeout(flush, 900);
    };
    store.$onAction(({ name, after }) => {
      if (ACTIONS.has(name)) after(schedule);
    });
    window.addEventListener('beforeunload', flush);
    document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });

    function paste() {
      if (!clipboard) return;
      pasteCount += 1;
      const source = copy(clipboard), offset = pasteCount * 24;
      const x = Math.max(0, Math.min(1070, source.x + offset));
      const y = Math.max(0, Math.min(620, source.y + offset));
      store.add(source.type, x, y);
      const target = store.selected;
      if (!target) return;
      const id = target.id;
      Object.assign(target, source, { id, x, y });
      if (source.type === 'pipe') {
        target.points = source.points.map(p => ({
          id: 'pt-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10),
          x: p.x + offset, y: p.y + offset
        }));
      }
      schedule();
    }
    function isTextInput(target) {
      return target instanceof Element && !!target.closest('input,textarea,select,[contenteditable="true"],.el-dialog');
    }
    document.addEventListener('keydown', event => {
      if (!editing() || isTextInput(event.target)) return;
      const mod = event.ctrlKey || event.metaKey, key = event.key.toLowerCase();
      if (mod && !event.shiftKey && key === 'c' && store.selected) {
        clipboard = copy(store.selected); pasteCount = 0;
      } else if (mod && !event.shiftKey && key === 'v' && clipboard) {
        paste();
      } else if (mod && !event.shiftKey && key === 'd' && store.selected) {
        store.duplicate();
      } else if (!mod && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key) && store.selectedId) {
        const step = event.shiftKey ? 10 : 1;
        const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
        const dy = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
        store.startDrag(store.selectedId, 'move', 0, 0);
        store.moveDrag(dx * store.zoom, dy * store.zoom);
        store.endDrag();
      } else if (mod && key === '0') {
        const viewport = document.querySelector('.canvas-viewport');
        if (viewport) store.fitZoom(viewport.clientWidth);
      } else if (event.key === '?') {
        showHelp();
      } else if (event.key === 'Escape') {
        store.select('');
        return;
      } else return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
    document.addEventListener('wheel', event => {
      if (!editing() || !(event.ctrlKey || event.metaKey) || !(event.target instanceof Element) || !event.target.closest('.canvas-viewport')) return;
      event.preventDefault();
      store.setZoom(store.zoom + (event.deltaY < 0 ? 0.05 : -0.05));
    }, { capture: true, passive: false });

    function getPipe(target) {
      if (!(target instanceof Element)) return null;
      const element = target.closest('.scene-object.pipe');
      if (!element) return null;
      const pipe = store.scene.objects.find(o => o.id === element.dataset.id);
      return pipe?.type === 'pipe' ? pipe : null;
    }
    document.addEventListener('pointerdown', event => {
      if (!editing() || event.button !== 0 || !event.altKey || !(event.target instanceof Element) || !event.target.matches('.point-grip')) return;
      const pipe = getPipe(event.target);
      if (!pipe || pipe.points.length <= 2) return;
      const cx = Number(event.target.getAttribute('cx')), cy = Number(event.target.getAttribute('cy'));
      const point = pipe.points.find(p => p.x === cx && p.y === cy);
      if (!point) return;
      store.select(pipe.id);
      const before = pipe.points.map(p => ({ ...p }));
      store.pipeRemove();
      pipe.points.splice(0, pipe.points.length, ...before.filter(p => p.id !== point.id));
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
    document.addEventListener('dblclick', event => {
      if (!editing() || !(event.target instanceof SVGPathElement)) return;
      const pipe = getPipe(event.target), stage = document.querySelector('.scene');
      if (!pipe || !stage || pipe.points.length >= 200) return;
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / store.zoom;
      const y = (event.clientY - bounds.top) / store.zoom;
      let best = -1, distance = Infinity, point = null;
      for (let i = 0; i < pipe.points.length - 1; i++) {
        const a = pipe.points[i], b = pipe.points[i + 1];
        const dx = b.x - a.x, dy = b.y - a.y, len = dx * dx + dy * dy;
        const q = len ? Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / len)) : 0;
        const px = a.x + q * dx, py = a.y + q * dy;
        const d = (x - px) ** 2 + (y - py) ** 2;
        if (d < distance) { best = i; distance = d; point = { x: Math.round(px), y: Math.round(py) }; }
      }
      if (best < 0 || distance > (18 / store.zoom) ** 2 || !point) return;
      store.select(pipe.id);
      const before = pipe.points.map(p => ({ ...p }));
      const ids = new Set(before.map(p => p.id));
      store.pipeAdd();
      const inserted = pipe.points.find(p => !ids.has(p.id));
      if (!inserted) return;
      pipe.points.splice(0, pipe.points.length,
        ...before.slice(0, best + 1), { id: inserted.id, ...point }, ...before.slice(best + 1));
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);

    const style = document.createElement('style');
    style.textContent = '#energy-v2-help{display:none;position:fixed;right:20px;bottom:20px;z-index:1800;border:1px solid #0f7187;background:#103c4d;color:#fff;padding:10px 16px;border-radius:12px;box-shadow:0 8px 24px #0003;cursor:pointer;font-size:13px}body:has(.canvas-viewport) #energy-v2-help{display:block}#energy-v2-help-dialog{max-width:min(540px,92vw);border:1px solid #bed1d8;border-radius:16px;padding:26px;color:#203844;box-shadow:0 20px 70px #0005}#energy-v2-help-dialog::backdrop{background:#0d273c88}#energy-v2-help-dialog h3{margin:0 0 14px;font-size:20px}#energy-v2-help-dialog p{margin:9px 0;line-height:1.6}#energy-v2-help-dialog button{margin-top:12px;border:0;background:#0d708a;color:white;padding:8px 22px;border-radius:8px;cursor:pointer}';
    document.head.appendChild(style);
    const button = document.createElement('button');
    button.id = 'energy-v2-help';
    button.type = 'button';
    button.textContent = '? 交互指南';
    document.body.appendChild(button);
    const dialog = document.createElement('dialog');
    dialog.id = 'energy-v2-help-dialog';
    dialog.innerHTML = '<h3>Energy Studio V2.0 · 交互指南</h3>' +
      '<p>⌘/Ctrl+C / V：复制、粘贴选中的组件；⌘/Ctrl+D：快速复制。</p>' +
      '<p>方向键：移动 1px；Shift + 方向键：移动 10px。</p>' +
      '<p>⌘/Ctrl + 鼠标滚轮：缩放画布；⌘/Ctrl+0：适配宽度。</p>' +
      '<p>双击管线路径：在对应线段插入折点；Alt + 点击折点：删除该节点（至少保留 2 个）。</p>' +
      '<p>草稿修改后会自动备份到当前浏览器；发布版本仍需点击「发布页面」。</p>' +
      '<p>以上操作仅适用于编辑态，运行预览保持只读。</p>' +
      '<button type="button" data-close>知道了</button>';
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    document.body.appendChild(dialog);
    function showHelp() { if (!dialog.open) dialog.showModal(); }
    button.addEventListener('click', showHelp);
    console.info('[Energy Studio] V2.0 interaction enhancements ready');
  }
  let tries = 0;
  function boot() {
    const store = getStore();
    if (store) return install(store);
    if (++tries < 100) window.setTimeout(boot, 100);
    else console.warn('[Energy Studio] Interaction adapter could not find the editor store');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();