<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useEditorStore } from '../stores/editor';
import { HEIGHT, WIDTH } from '../model/scene';
import WidgetRenderer from './WidgetRenderer.vue';
import type { PipeObject, SceneObject } from '../types/scene';
const store = useEditorStore();
const stage = ref<HTMLElement | null>(null);
const viewport = ref<HTMLElement | null>(null);
const pathData = (o: PipeObject) => o.points.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' ');
const endpoints = (o: PipeObject) => o.points.filter((_,i) =>
  (i === 0 && ['start','both'].includes(o.marker)) || (i === o.points.length-1 && ['end','both'].includes(o.marker)));
const sceneStyle = (o: SceneObject) => o.type==='pipe'
  ? { zIndex: o.z }
  : { left: `${o.x}px`, top: `${o.y}px`, width: `${o.w}px`, height: `${o.h}px`, zIndex: o.z };
function down(event: PointerEvent, o: SceneObject, kind: 'move'|'resize'|'point' = 'move', pointId?: string) {
  if (store.mode === 'runtime') { if (kind === 'move') store.openDetails(o.id); return; }
  if (event.button !== 0) return;
  store.startDrag(o.id,kind,event.clientX,event.clientY,pointId);
  event.preventDefault();
}
function move(event: PointerEvent) {
  if (stage.value) {
    const box=stage.value.getBoundingClientRect();
    store.pointer={ x:Math.round((event.clientX-box.left)/store.zoom),y:Math.round((event.clientY-box.top)/store.zoom) };
  }
  store.moveDrag(event.clientX,event.clientY);
}
function finish() { store.endDrag(); }
function drop(event: DragEvent) {
  if (store.mode !== 'edit' || !stage.value) return;
  event.preventDefault();
  const type = event.dataTransfer?.getData('text/plain');
  if (!['text','label','device','meter','card','pipe'].includes(type || '')) return;
  const r=stage.value.getBoundingClientRect();
  store.add(type as SceneObject['type'],(event.clientX-r.left)/store.zoom,(event.clientY-r.top)/store.zoom);
}
function dragOver(event: DragEvent) { if (store.mode==='edit') event.preventDefault(); }
onMounted(()=>{window.addEventListener('pointermove',move);window.addEventListener('pointerup',finish);window.addEventListener('pointercancel',finish);
  if (viewport.value) store.fitZoom(viewport.value.clientWidth);
});
onBeforeUnmount(()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',finish);window.removeEventListener('pointercancel',finish);});
</script>
<template>
  <div ref="viewport" class="canvas-viewport" @dragover="dragOver" @drop="drop">
    <div id="canvas-size" :style="{ width:`${WIDTH*store.zoom}px`,height:`${HEIGHT*store.zoom}px` }">
      <div ref="stage" class="scene" :style="{transform:`scale(${store.zoom})`}" @pointerdown.self="store.select('')">
        <div class="scene-header"></div><div class="scene-footer">ENERGY SYSTEM · DEMONSTRATION DATA</div>
        <!-- Both edit and runtime use this same renderer; filtering never edits schema. -->
        <div v-for="o in store.objects" :key="o.id" class="scene-object"
             :class="[o.type==='pipe' ? `pipe ${o.energy}`:'',store.mode==='edit'&&o.id===store.selectedId?'selected':'']"
             :style="sceneStyle(o)" :title="o.name" :data-id="o.id" @pointerdown.stop="down($event,o)">
          <template v-if="o.type==='pipe'">
            <svg :viewBox="`0 0 ${WIDTH} ${HEIGHT}`" :width="WIDTH" :height="HEIGHT">
              <path :d="pathData(o)" />
              <circle v-for="p in endpoints(o)" :key="p.id" class="endpoint" :cx="p.x" :cy="p.y" r="6" />
              <circle v-for="p in (store.mode==='edit'&&o.id===store.selectedId ? o.points : [])"
                :key="p.id" class="point-grip" :cx="p.x" :cy="p.y" r="6"
                @pointerdown.stop="down($event,o,'point',p.id)" />
            </svg>
          </template>
          <WidgetRenderer v-else :object="o" :tick="store.mockTick" />
          <span v-if="store.mode==='edit' && o.id===store.selectedId&&o.type!=='pipe'" class="resize-grip"
            @pointerdown.stop="down($event,o,'resize')"></span>
        </div>
      </div>
    </div>
  </div>
</template>