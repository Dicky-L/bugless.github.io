<script setup lang="ts">
import { computed } from 'vue';
import { ENERGY, sampleReading } from '../model/scene';
import type { WidgetObject } from '../types/scene';
const props = defineProps<{ object: WidgetObject; tick: number }>();
const reading = computed(() => sampleReading(props.object.binding, props.tick));
</script>
<template>
  <div v-if="object.type==='text'" class="widget text">{{ object.name }}</div>
  <div v-else-if="object.type==='label'" class="widget label">{{ object.name }}</div>
  <div v-else-if="object.type==='device'" class="widget device" :class="object.energy">
    <div class="device-icon">{{ object.energy==='water' ? '◈' : object.energy==='gas' ? '♨' : '⌁' }}</div>
    <div class="device-details"><strong>{{ object.name }}</strong><small><span class="device-dot"></span>在线运行 · {{ ENERGY[object.energy] }}</small></div>
  </div>
  <div v-else-if="object.type==='card'" class="widget card">
    <div class="card-top"><span>{{ object.name }}</span><span class="card-spark">⌁</span></div>
    <div class="card-reading">{{ reading[0] }}<small>{{ reading[1] }}</small></div>
  </div>
  <div v-else-if="object.type==='meter'" class="widget meter">
    <div class="meter-circle"><span>{{ reading[0] }}</span></div><div class="meter-name">{{ object.name }}</div>
  </div>
</template>