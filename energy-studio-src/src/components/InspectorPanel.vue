<script setup lang="ts">
import { computed } from 'vue';
import { ElButton, ElInput, ElInputNumber, ElOption, ElSelect, ElDivider, ElTag } from 'element-plus';
import { DEVICES, ENERGY, LAYERS } from '../model/scene';
import { useEditorStore } from '../stores/editor';
import type { Energy, Layer, MarkerType, ActionType } from '../types/scene';
const store = useEditorStore();
const device = computed(()=>DEVICES.find(d=>d.id===store.selected?.binding.deviceId));
const energyOptions = Object.entries(ENERGY).filter(([k])=>k!=='all') as [Energy,string][];
const layerOptions = Object.entries(LAYERS) as [Layer,string][];
const actions: [ActionType,string][] = [ ['popup','打开详情浮层'],['tooltip','显示提示'],['navigate','页面跳转（模拟）'],['none','无动作'] ];
const markers: [MarkerType,string][] = [ ['none','不显示'],['start','起点'],['end','终点'],['both','两端'] ];
const set = (field: Parameters<typeof store.patch>[0], value: string|number)=>store.patch(field,value);
</script>
<template>
  <div v-if="store.mode==='runtime'" class="empty-inspector">
    <div class="empty-icon">◈</div><strong>运行预览中</strong>
    <p>展示最近发布的页面，点击组件<br>查看模拟数据与交互。</p>
    <div class="hint-card"><strong>草稿与发布隔离</strong>编辑态的调整不会影响运行态，直到再次发布。</div>
  </div>
  <div v-else-if="!store.selected" class="empty-inspector">
    <div class="empty-icon">☷</div><strong>尚未选中任何元素</strong>
    <p>点击画布中的元素，或从左侧拖入组件。<br>支持位置、大小、管线节点编辑。</p>
    <div class="hint-card"><strong>操作提示</strong>⌘/Ctrl+Z 撤销，Delete 删除，<br>草稿自动保存在本地浏览器中。</div>
  </div>
  <div v-else :key="store.selected.id">
    <section class="inspector-block">
      <h3 class="inspector-heading">基本信息 · {{ store.selected.type.toUpperCase() }}</h3>
      <div class="form-field"><label>组件名称</label><ElInput :model-value="store.selected.name" @change="(v:string)=>set('name',v)" /></div>
      <div class="form-row">
        <div class="form-field"><label>X 坐标</label><ElInputNumber :model-value="store.selected.x" :controls="false" @change="(v:number|undefined)=>set('x',v??0)" /></div>
        <div class="form-field"><label>Y 坐标</label><ElInputNumber :model-value="store.selected.y" :controls="false" @change="(v:number|undefined)=>set('y',v??0)" /></div>
      </div>
      <div class="form-row" v-if="store.selected.type!=='pipe'">
        <div class="form-field"><label>宽度</label><ElInputNumber :model-value="store.selected.w" :min="30" :controls="false" @change="(v:number|undefined)=>set('w',v??30)" /></div>
        <div class="form-field"><label>高度</label><ElInputNumber :model-value="store.selected.h" :min="30" :controls="false" @change="(v:number|undefined)=>set('h',v??30)" /></div>
      </div>
      <p v-else class="field-note">管线使用 SVG 多节点折线，以点坐标确定几何结构。</p>
      <div class="form-field"><label>层级 zIndex</label><ElInputNumber :model-value="store.selected.z" :controls="false" @change="(v:number|undefined)=>set('z',v??0)" /></div>
      <div class="form-field"><label>逻辑图层</label><ElSelect :model-value="store.selected.layer" @change="(v:Layer)=>set('layer',v)"><ElOption v-for="[key,name] in layerOptions" :key="key" :label="name" :value="key" /></ElSelect></div>
      <div class="form-field"><label>能源类型</label><ElSelect :model-value="store.selected.energy" @change="(v:Energy)=>set('energy',v)"><ElOption v-for="[key,name] in energyOptions" :key="key" :label="name" :value="key" /></ElSelect></div>
    </section>
    <ElDivider />
    <section>
      <h3 class="inspector-heading">数据绑定 · MOCK</h3>
      <div class="form-field"><label>工艺设备（单选）</label>
        <ElSelect :model-value="store.selected.binding.deviceId" clearable placeholder="选择模拟设备" @change="(v:string)=>store.setDevice(v)">
          <ElOption v-for="d in DEVICES" :key="d.id" :value="d.id" :label="d.name" />
        </ElSelect>
      </div>
      <div class="form-field"><label>当前设备参数</label>
        <ElSelect :model-value="store.selected.binding.param" clearable placeholder="选择参数" :disabled="!device" @change="(v:string)=>store.setParameter(v)">
          <ElOption v-for="p in device?.points||[]" :key="p.id" :value="p.id" :label="`${p.name} · ${p.kind==='virtual'?'虚拟':'采集'} (${p.unit||'状态'})`" />
        </ElSelect>
      </div>
      <p class="field-note">切换设备会清除旧参数；此演示仅使用本地模拟数据，不接入企业接口。</p>
      <ElTag size="small" effect="plain">DataSource → Binding → Renderer</ElTag>
    </section>
    <ElDivider />
    <section>
      <h3 class="inspector-heading">行为与交互</h3>
      <div class="form-field"><label>点击事件</label><ElSelect :model-value="store.selected.action" @change="(v:ActionType)=>set('action',v)">
        <ElOption v-for="[key,name] in actions" :key="key" :value="key" :label="name" />
      </ElSelect></div>
      <template v-if="store.selected.type==='pipe'">
        <div class="form-field"><label>端点圆点</label><ElSelect :model-value="store.selected.marker" @change="(v:MarkerType)=>set('marker',v)">
          <ElOption v-for="[key,name] in markers" :key="key" :value="key" :label="name" />
        </ElSelect></div>
        <p class="field-note">共 {{ store.selected.points.length }} 个节点；可以直接拖动节点，至少保留 2 个。</p>
        <div class="inspector-actions"><ElButton size="small" @click="store.pipeAdd()">＋ 添加折点</ElButton><ElButton size="small" :disabled="store.selected.points.length<=2" @click="store.pipeRemove()">－ 删除折点</ElButton></div>
      </template>
    </section>
    <ElDivider />
    <div class="inspector-actions"><ElButton @click="store.duplicate()">复制组件</ElButton><ElButton type="danger" plain @click="store.remove()">删除组件</ElButton></div>
  </div>
</template>