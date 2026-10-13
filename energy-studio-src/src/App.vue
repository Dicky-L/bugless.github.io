<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ElButton, ElDialog, ElMessage, ElTag } from 'element-plus';
import { DEVICES, ENERGY, HEIGHT, LAYERS, sampleReading, WIDTH } from './model/scene';
import { useEditorStore } from './stores/editor';
import type { Filter, LayerFilter, ObjectType } from './types/scene';
import SceneCanvas from './components/SceneCanvas.vue';
import InspectorPanel from './components/InspectorPanel.vue';
const store=useEditorStore();
const fileInput = ref<HTMLInputElement | null>(null);
const palette: Array<{ type:ObjectType;title:string;icon:string }> = [
  { type:'text',title:'文本',icon:'T' },{ type:'label',title:'标签',icon:'▣' },
  { type:'card',title:'数据卡',icon:'▥' },{ type:'meter',title:'仪表',icon:'◉' },
  { type:'device',title:'设备',icon:'⬡' },{ type:'pipe',title:'能源管线',icon:'⌁' }
];
const detailDevice=computed(()=>DEVICES.find(d=>d.id===store.details?.binding.deviceId));
const detailParam=computed(()=>detailDevice.value?.points.find(p=>p.id===store.details?.binding.param));
const detailReading=computed(()=>sampleReading(store.details?.binding||{deviceId:'',param:''},store.mockTick));
const energyFilters=Object.entries(ENERGY) as [Filter,string][];
const layerFilters: [LayerFilter,string][] = [['all','全部图层'],...Object.entries(LAYERS) as [LayerFilter,string][]];
let clock: number|undefined;
function dragPalette(e:DragEvent,type:ObjectType){if(store.mode==='runtime'){e.preventDefault();return;}e.dataTransfer?.setData('text/plain',type);if(e.dataTransfer)e.dataTransfer.effectAllowed='copy';}
function exportSchema(){const data=store.mode==='runtime'?store.published:store.scene;
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='energy-studio-schema.json';link.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function importSchema(event:Event){const input=event.target as HTMLInputElement;const file=input.files?.[0];if(!file)return;
  try {if(file.size>500_000)throw Error('文件不得超过 500 KB');store.importScene(JSON.parse(await file.text()));}
  catch(e){ElMessage.error(e instanceof Error?e.message:'JSON 导入失败');}
  finally{input.value='';}
}
function onKeyDown(e:KeyboardEvent){if(e.target instanceof HTMLElement && e.target.closest('input,select,textarea,[contenteditable="true"]'))return;
  if(e.target instanceof HTMLElement && e.target.closest('.el-dialog'))return;
  const mod=e.ctrlKey||e.metaKey;
  if(mod&&e.key.toLowerCase()==='z'){e.preventDefault();if(e.shiftKey)store.redo();else store.undo();}
  else if(mod&&e.key.toLowerCase()==='y'){e.preventDefault();store.redo();}
  else if(['Delete','Backspace'].includes(e.key)&&store.mode==='edit'&&store.selectedId){e.preventDefault();store.remove();}
  else if(e.key==='Escape')store.closeDetails();
}
watch(()=>store.toast,(message)=>{if(message){ElMessage({message,type:'success',duration:2300});store.toast='';}});
onMounted(()=>{window.addEventListener('keydown',onKeyDown);clock=window.setInterval(()=>{store.mockTick=Date.now();},4000);});
onBeforeUnmount(()=>{window.removeEventListener('keydown',onKeyDown);if(clock)clearInterval(clock);});
</script>
<template>
  <div :class="store.mode==='runtime'?'mode-runtime':''">
    <header class="topbar">
      <div class="brand"><div class="brand-icon">E<span>↗</span></div><div><strong>Energy Studio</strong><small>能源组态 · Vue 3 / TypeScript</small></div></div>
      <div class="top-divider"></div><div class="breadcrumbs">工作台 <span>/</span> 工业能源拓扑 <span>/</span> <strong>可视化编辑器</strong></div>
      <div class="top-actions"><span class="demo-badge">SANITIZED DEMO</span><button class="btn subtle" @click="store.reset()">重置示例</button>
        <button class="btn subtle" @click="exportSchema">导出 JSON</button><button class="btn subtle" @click="fileInput?.click()">导入 JSON</button>
        <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="importSchema" />
        <a class="home-link" href="../">案例首页 ↗</a></div>
    </header>
    <main class="workspace">
      <aside class="sidebar left-sidebar">
        <div class="side-title"><span>组件资源库</span><span class="side-meta">PALETTE</span></div>
        <div class="intro">点击添加，或拖拽至中央画布</div>
        <h3>基本组件 <span>04</span></h3>
        <div class="palette-grid">
          <button v-for="p in palette.slice(0,4)" :key="p.type" class="palette-item" :disabled="store.mode==='runtime'" draggable="true" @click="store.add(p.type,440,180)" @dragstart="dragPalette($event,p.type)"><span class="palette-icon">{{p.icon}}</span><span>{{p.title}}</span></button>
        </div>
        <h3>工业能源 <span>02</span></h3>
        <div class="palette-grid"><button v-for="p in palette.slice(4)" :key="p.type" class="palette-item" :disabled="store.mode==='runtime'" draggable="true" @click="store.add(p.type,440,180)" @dragstart="dragPalette($event,p.type)"><span class="palette-icon">{{p.icon}}</span><span>{{p.title}}</span></button></div>
        <div class="side-rule"></div><div class="side-title small">能源分类 <span class="side-meta">FILTER</span></div>
        <div class="filter-stack"><button v-for="[key,name] in energyFilters" :key="key" class="filter-option" :class="{active:store.filterEnergy===key}" @click="store.filterEnergy=key"><span class="color-dot" :class="key"></span>{{name}}<em>{{key==='all'?store.activeScene.objects.length:store.activeScene.objects.filter(o=>o.energy===key).length}}</em></button></div>
        <div class="side-rule"></div><div class="side-title small">逻辑图层 <span class="side-meta">LAYER</span></div>
        <div class="filter-stack"><button v-for="[key,name] in layerFilters" :key="key" class="filter-option" :class="{active:store.filterLayer===key}" @click="store.filterLayer=key">▤ &nbsp;{{name}}</button></div>
        <div class="sidebar-bottom"><span class="status-dot"></span><div>本地沙盒模式<strong>不连接任何生产服务</strong></div></div>
      </aside>
      <section class="editor-area">
        <div class="editor-toolbar"><div class="editor-heading"><span class="heading-icon">▦</span><div><strong>{{store.activeScene.pageName}}</strong><small>{{store.mode==='edit'?(store.dirty?'草稿有未保存的修改':'已保存 · 本地模拟数据'):'已发布版本 · 运行态只读'}}</small></div></div>
          <div class="toolbar-controls"><div class="segmented"><button :class="{active:store.mode==='edit'}" @click="store.setMode('edit')">编辑态</button><button :class="{active:store.mode==='runtime'}" @click="store.setMode('runtime')">运行预览</button></div>
          <div class="mini-divider"></div><button class="icon-btn" :disabled="!store.canUndo||store.mode!=='edit'" title="撤销" @click="store.undo()">↶</button><button class="icon-btn" :disabled="!store.canRedo||store.mode!=='edit'" title="重做" @click="store.redo()">↷</button><span class="mini-divider"></span>
          <button class="btn primary" :disabled="store.mode!=='edit'" @click="store.save()">保存草稿</button><button class="btn dark" :disabled="store.mode!=='edit'" @click="store.publish()">发布页面 ↗</button></div></div>
        <div class="canvas-subbar"><div><span class="cyan-dot"></span><strong>工艺能源拓扑</strong><span class="sub-muted">逻辑坐标 · 自由画布 · 支持元素重叠</span></div>
        <div class="view-tools"><span>{{store.activeScene.objects.length}} 个元素</span><span class="mini-divider"></span><button class="icon-btn" @click="store.setZoom(store.zoom-.1)">−</button><span id="zoom-text">{{Math.round(store.zoom*100)}}%</span><button class="icon-btn" @click="store.setZoom(store.zoom+.1)">＋</button><button class="icon-btn fit" @click="store.setZoom(.8)">适配</button></div></div>
        <SceneCanvas />
        <div class="canvas-footer"><span>画布 <strong>{{WIDTH}} × {{HEIGHT}}</strong> px</span><span>X: {{store.pointer?.x??'—'}} / Y: {{store.pointer?.y??'—'}}</span><span>{{store.mode==='edit'?'EDITOR · 自由定位':'RUNTIME · 交互预览'}}</span></div>
      </section>
      <aside class="sidebar right-sidebar"><div class="side-title"><span>属性配置</span><span class="side-meta">INSPECTOR</span></div><InspectorPanel /></aside>
    </main>
    <ElDialog :model-value="!!store.details" width="440px" title="设备运行详情 · MOCK" :close-on-click-modal="true" @close="store.closeDetails()">
      <template v-if="store.details">
        <div class="detail-row"><span>组件类型</span><strong>{{store.details.type}}</strong></div>
        <div class="detail-row"><span>能源类别</span><strong>{{ENERGY[store.details.energy]}}</strong></div>
        <div class="detail-row"><span>关联设备</span><strong>{{detailDevice?.name||'未绑定'}}</strong></div>
        <div class="detail-row"><span>参数</span><strong>{{detailParam?.name||'暂无'}}</strong></div>
        <div class="detail-row"><span>模拟读数</span><strong>{{detailReading[0]}} {{detailReading[1]}}</strong></div>
        <ElTag effect="plain" type="info" size="small" style="margin-top:16px">非真实生产数据 · 无服务端调用</ElTag>
      </template>
      <template #footer><ElButton type="primary" @click="store.closeDetails()">关闭</ElButton></template>
    </ElDialog>
  </div>
</template>