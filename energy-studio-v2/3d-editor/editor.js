import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { createPipeEditor } from './pipes-v2.2.js';
import { createModelCatalog } from './models-v2.3.js';

const $ = id => document.getElementById(id);
const STORAGE = 'energy-studio-demo-v2';
const SCALE = 32 / 1120;
const clone = value => JSON.parse(JSON.stringify(value));
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const palette = {water:0x1eacdf,electric:0xf0bb45,gas:0xff8a58};
const ids = {water:'mock-pump-02',electric:'mock-ahu-01',gas:'mock-gas-04'};
let sequence=0;
const uid = () => 'obj-v21-' + Date.now().toString(36) + '-' + (++sequence);
const defaults = [
  ['循环水泵 P-02','water',440,245,206,92,'mock-pump-02','flow'],
  ['空调机组 A-01','electric',76,245,206,92,'mock-ahu-01','power'],
  ['燃气阀组 G-04','gas',805,245,206,92,'mock-gas-04','flow'],
  ['能源计量表 M-03','electric',76,443,168,118,'mock-meter-03','energy']
];
function initialScene() {
  const objects=defaults.map(([name,energy,x,y,w,h,deviceId,param],i)=>({
    id:uid(),type:i===3?'meter':'device',name,x,y,w,h,z:35,
    layer:energy,energy,binding:{deviceId,param},action:'popup'
  }));
  return {schemaVersion:'1.0.0',pageName:'能源组态演示场景',width:1120,height:660,objects};
}
function load() {
  try {
    const state=JSON.parse(localStorage.getItem(STORAGE)||'null');
    if(state?.draft?.schemaVersion==='1.0.0'&&Array.isArray(state.draft.objects)
       &&state.draft.width===1120&&state.draft.height===660) return state;
  } catch(error){console.warn('读取本地草稿失败',error)}
  const draft=initialScene();
  return {draft,published:clone(draft),savedAt:''};
}
let saved=load(),scene=clone(saved.draft),selectedId='',dirty=false,history=[],future=[];
const meshes=new Map();
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.25));
renderer.outputColorSpace=THREE.SRGBColorSpace;
const world=new THREE.Scene();
world.background=new THREE.Color(0x0b1d2d);
const camera=new THREE.PerspectiveCamera(43,1,.1,250);
camera.position.set(28,29,34);
const viewport=$('viewport');
viewport.appendChild(renderer.domElement);
const orbit=new OrbitControls(camera,renderer.domElement);
orbit.enableDamping=true;
orbit.dampingFactor=.12;
orbit.target.set(0,0,0);
orbit.maxPolarAngle=Math.PI/2.08;
orbit.minDistance=5;orbit.maxDistance=90;
world.add(new THREE.HemisphereLight(0xc7eaff,0x2c4055,2.4));
const light=new THREE.DirectionalLight(0xffffff,2.2);
light.position.set(15,28,12);world.add(light);
const grid=new THREE.GridHelper(50,50,0x2b7794,0x244056);
grid.position.y=-.04;world.add(grid);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(50,50),new THREE.MeshStandardMaterial({color:0x10263a,roughness:1}));
ground.rotation.x=-Math.PI/2;ground.position.y=-.06;world.add(ground);
const transform=new TransformControls(camera,renderer.domElement);
world.add(transform.getHelper());
transform.setSize(.75);
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
let raf=0,animateUntil=0,lastDraw=0,lastAnimation=0,mode='select',dragSnapshot=null,toastTimer=0,pipeEditor=null,modelCatalog=null;
let simulationRunning=true,simulationFps=15,orbitActive=false;
function invalidate(active=false){
  if(active)animateUntil=performance.now()+500;
  if(!raf)raf=requestAnimationFrame(frame);
}
function frame(time){
  raf=0;
  if(document.hidden)return;
  const minInterval=(transform.dragging||orbitActive)?32:1000/simulationFps;
  if(time-lastDraw<minInterval){raf=requestAnimationFrame(frame);return}
  const delta=Math.min(.08,Math.max(.001,lastAnimation?(time-lastAnimation)/1000:.033));
  lastDraw=time;lastAnimation=time;
  const moving=orbit.update();
  const modelChanged=simulationRunning&&!!modelCatalog?.update(time,delta);
  const pipeChanged=simulationRunning&&!!pipeEditor?.animateFlow(time,delta);
  renderer.render(world,camera);
  if(moving||transform.dragging||time<animateUntil||modelChanged||pipeChanged)invalidate();
}
document.addEventListener('visibilitychange',()=>{
  lastAnimation=0;
  if(!document.hidden)invalidate();
});
function resize(){
  const w=Math.max(1,viewport.clientWidth),h=Math.max(1,viewport.clientHeight);
  camera.aspect=w/h;camera.updateProjectionMatrix();
  renderer.setSize(w,h,false);invalidate();
}
new ResizeObserver(resize).observe(viewport);
orbit.addEventListener('change',()=>invalidate(true));
orbit.addEventListener('start',()=>{orbitActive=true;invalidate(true)});
orbit.addEventListener('end',()=>{orbitActive=false;invalidate(true)});
transform.addEventListener('dragging-changed',event=>{orbit.enabled=!event.value;invalidate(true)});
transform.addEventListener('mouseDown',()=>{dragSnapshot=clone(scene)});
transform.addEventListener('objectChange',()=>{
  if(pipeEditor?.onTransformChanged())return;
  const obj=selected(),group=meshes.get(selectedId);
  if(!obj||!group)return;
  group.position.y=clamp(group.position.y,0,15);
  group.scale.set(clamp(group.scale.x,.2,4),clamp(group.scale.y,.2,4),clamp(group.scale.z,.2,4));
  updateFromGroup(obj,group);pipeEditor?.onEquipmentChanged();dirty=true;updateStatus();updateInspector();invalidate(true);
});
transform.addEventListener('mouseUp',()=>{
  pipeEditor?.finalizeConnections();
  if(dragSnapshot&&JSON.stringify(dragSnapshot)!==JSON.stringify(scene)){
    history.push(dragSnapshot);if(history.length>60)history.shift();future=[];dirty=true;
  }
  dragSnapshot=null;updateStatus();updateList();invalidate();
});
function makeMaterial(color,metalness=.3){return new THREE.MeshStandardMaterial({color,metalness,roughness:.48})}
function box(parent,w,h,d,x,y,z,color){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),makeMaterial(color));
  mesh.position.set(x,y,z);parent.add(mesh);return mesh;
}
function cylinder(parent,r,h,x,y,z,color,rotate=false){
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,18),makeMaterial(color,.48));
  mesh.position.set(x,y,z);if(rotate)mesh.rotation.z=Math.PI/2;parent.add(mesh);return mesh;
}
function buildEquipment(obj){
  if(modelCatalog)return modelCatalog.build(obj);
  const group=new THREE.Group();
  group.userData.id=obj.id;
  const color=palette[obj.energy]||palette.electric;
  box(group,3.4,.25,2.8,0,.12,0,0x294358);
  box(group,3.15,.13,2.55,0,.31,0,0x426077);
  if(obj.type==='meter'){
    box(group,2,2,1.15,0,1.5,0,0x7d9cb2);
    box(group,1.5,.95,.08,0,1.8,.62,0x0c344f);
    box(group,1.1,.12,.09,0,2,.69,color);
    for(const x of[-.55,0,.55])box(group,.27,.17,.1,x,1.05,.65,0x346a8e);
  }else if(obj.energy==='water'){
    box(group,2.55,.35,1.7,0,.62,0,0x5b768b);
    cylinder(group,.72,1.5,0,1.35,0,0x376f96,true);
    cylinder(group,.38,.8,-.94,1.35,0,color,true);
    cylinder(group,.38,.8,.94,1.35,0,color,true);
    box(group,.6,.65,.65,0,1.75,0,0xa9bccb);
  }else if(obj.energy==='gas'){
    cylinder(group,.38,2.4,0,.85,0,0x9baeb9,true);
    cylinder(group,.62,.55,0,1.4,0,0x5e7b92);
    cylinder(group,.64,.16,0,2.3,0,color);
    box(group,.8,.18,.16,0,2.5,0,0xe7bd76);
  }else{
    box(group,2.85,1.7,1.9,0,1.25,0,0x7e9aaa);
    box(group,2.65,.13,1.7,0,2.17,0,0x3a586e);
    for(const x of[-.8,.8])cylinder(group,.46,.1,x,2.3,0,color);
    box(group,.5,.25,.12,1.0,1.5,1.0,0xe2b86c);
  }
  const marker=new THREE.Mesh(new THREE.TorusGeometry(.35,.055,7,26),new THREE.MeshBasicMaterial({color}));
  marker.rotation.x=Math.PI/2;marker.position.set(0,3.2,0);group.add(marker);
  group.traverse(child=>{if(child.isMesh)child.userData.deviceId=obj.id});
  return group;
}
function positionOf(obj){
  if(Array.isArray(obj.threeD?.position)&&obj.threeD.position.length===3)
    return obj.threeD.position.map(Number);
  return [(obj.x+obj.w/2-560)*SCALE,0,(obj.y+obj.h/2-330)*SCALE];
}
function updateGroup(group,obj){
  const p=positionOf(obj);
  group.position.set(p[0],p[1],p[2]);
  const r=obj.threeD?.rotation||[0,0,0],s=obj.threeD?.scale||[1,1,1];
  group.rotation.set(...r.map(v=>THREE.MathUtils.degToRad(v)));
  group.scale.set(...s);
}
function updateFromGroup(obj,group){
  const p=group.position,r=group.rotation,s=group.scale;
  obj.threeD={...obj.threeD,
    position:[p.x,p.y,p.z].map(v=>Number(v.toFixed(3))),
    rotation:[r.x,r.y,r.z].map(v=>Number(THREE.MathUtils.radToDeg(v).toFixed(2))),
    scale:[s.x,s.y,s.z].map(v=>Number(v.toFixed(3)))
  };
  obj.x=clamp(Math.round(p.x/SCALE+560-obj.w/2),0,1120-obj.w);
  obj.y=clamp(Math.round(p.z/SCALE+330-obj.h/2),0,660-obj.h);
}
function dispose(group){
  group.traverse(child=>{
    if(child.geometry)child.geometry.dispose();
    if(child.material){
      const mats=Array.isArray(child.material)?child.material:[child.material];
      for(const mat of mats)mat.dispose();
    }
  });
}
function rebuild(){
  transform.detach();
  modelCatalog?.clear();
  for(const group of meshes.values()){world.remove(group);dispose(group)}
  meshes.clear();
  for(const obj of scene.objects){
    if(obj.type!=='device'&&obj.type!=='meter')continue;
    const group=buildEquipment(obj);updateGroup(group,obj);
    world.add(group);meshes.set(obj.id,group);
  }
  pipeEditor?.rebuild();
  if(!meshes.has(selectedId)&&!pipeEditor?.has(selectedId))selectedId='';
  if(meshes.has(selectedId)&&mode!=='select')transform.attach(meshes.get(selectedId));
  pipeEditor?.onSelect();
  updateList();updateInspector();updateStatus();invalidate();
}
function selected(){return scene.objects.find(obj=>obj.id===selectedId)}
function select(id){
  selectedId=(meshes.has(id)||pipeEditor?.has(id))?id:'';
  transform.detach();
  if(meshes.has(selectedId)&&mode!=='select')transform.attach(meshes.get(selectedId));
  pipeEditor?.onSelect();
  updateList();updateInspector();invalidate();
}
function updateList(){
  $('count').textContent=String(meshes.size);
  $('objects').replaceChildren();
  for(const obj of scene.objects.filter(o=>meshes.has(o.id))){
    const button=document.createElement('button');
    button.className=obj.id===selectedId?'active':'';
    const name=document.createElement('span');name.textContent=obj.name;
    const tag=document.createElement('small');tag.textContent=obj.energy==='water'?'水务':obj.energy==='gas'?'燃气':'电力';
    button.append(name,tag);button.addEventListener('click',()=>select(obj.id));
    $('objects').append(button);
  }
  pipeEditor?.appendList($('objects'));
  pipeEditor?.updateList();
}
function updateInspector(){
  const obj=selected(),group=meshes.get(selectedId);
  if(obj?.type==='pipe'){pipeEditor?.showInspector(obj);return}
  $('pipe-inspector').hidden=true;
  $('empty').hidden=!!obj;$('inspector').hidden=!obj;
  $('selected-label').textContent=obj?'已选择：'+obj.name:'未选中设备';
  if(!obj||!group)return;
  $('name').value=obj.name;$('energy').value=obj.energy;
  const props=obj.threeD||{};
  $('model-select').value=props.modelId||'builtin:auto';
  $('device-run-state').value=props.runState||'running';
  $('device-speed').value=String(props.animationSpeed??1);
  $('device-speed-display').textContent=Number(props.animationSpeed??1).toFixed(2)+'×';
  $('tank-level').value=String(props.level??65);
  $('tank-level-display').textContent=String(props.level??65)+'%';
  $('tank-level-row').hidden=modelCatalog?.resolveId(obj)!=='builtin:tank';
  for(const [prefix,values] of [
    ['p',[group.position.x,group.position.y,group.position.z]],
    ['r',[group.rotation.x,group.rotation.y,group.rotation.z].map(THREE.MathUtils.radToDeg)],
    ['s',[group.scale.x,group.scale.y,group.scale.z]]
  ])['x','y','z'].forEach((axis,i)=>{$(prefix+axis).value=Number(values[i].toFixed(2))});
  $('position').textContent='X: '+group.position.x.toFixed(2)+'　Y: '+group.position.y.toFixed(2)+'　Z: '+group.position.z.toFixed(2);
}
function updateStatus(){
  $('state').textContent=dirty?'● 草稿有未保存更改':'✓ 草稿已保存';
  $('state').style.color=dirty?'#ffcb7b':'#6dddc3';
  $('undo').disabled=!history.length;$('redo').disabled=!future.length;
}
function mutate(fn,{rebuildScene=false}={}){
  const before=clone(scene);fn();
  if(JSON.stringify(before)===JSON.stringify(scene))return;
  history.push(before);if(history.length>60)history.shift();
  future=[];dirty=true;
  if(rebuildScene)rebuild();else {updateList();updateInspector();updateStatus();invalidate()}
}
function save(){
  try{
    const state={draft:scene,published:saved.published,savedAt:new Date().toISOString()};
    localStorage.setItem(STORAGE,JSON.stringify(state));saved=clone(state);dirty=false;updateStatus();
    toast('草稿已保存。返回 2D 可查看平面位置，发布版本未改变。');
  }catch(error){toast('保存失败：浏览器存储不可用')}
}
function toast(message){
  const el=$('toast');el.textContent=message;el.classList.add('visible');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3500);
}
function setMode(value){
  mode=value;
  for(const button of document.querySelectorAll('[data-mode]'))button.classList.toggle('active',button.dataset.mode===value);
  transform.detach();
  if(value!=='select'&&meshes.has(selectedId))transform.attach(meshes.get(selectedId));
  transform.setMode(value==='select'?'translate':value);
  pipeEditor?.onModeChange();
  invalidate();
}
const down={x:0,y:0};
renderer.domElement.addEventListener('pointerdown',event=>{down.x=event.clientX;down.y=event.clientY});
renderer.domElement.addEventListener('pointerup',event=>{
  if(transform.dragging||Math.hypot(event.clientX-down.x,event.clientY-down.y)>5)return;
  const rect=renderer.domElement.getBoundingClientRect();
  pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
  pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  if(pipeEditor?.handlePick(pipeEditor.pick(raycaster)))return;
  const hits=raycaster.intersectObjects([...meshes.values()],true);
  const hit=hits.find(item=>item.object.userData.deviceId);
  if(hit)select(hit.object.userData.deviceId);else if(mode==='select')select('');
});
function add(type,energy,modelId='builtin:auto'){
  if(scene.objects.length>=500){toast('场景对象已达到 500 个上限');return}
  const count=scene.objects.filter(o=>o.type===type).length+1;
  const name=modelId==='builtin:tank'?'储罐 T-'+count:type==='meter'?'智能仪表 M-'+count:energy==='water'?'循环水泵 P-'+count:energy==='gas'?'燃气阀门 G-'+count:'空调机组 A-'+count;
  const obj={id:uid(),type,name,x:450+count*12,y:280+count*9,w:type==='meter'?168:206,h:type==='meter'?116:90,z:35,layer:energy,energy,binding:{deviceId:'',param:''},action:'popup',
    threeD:{modelId,runState:'running',animationSpeed:1,level:65}};
  mutate(()=>scene.objects.push(obj),{rebuildScene:true});select(obj.id);setMode('translate');
}
function duplicate(){
  const obj=selected();if(!obj)return;
  const copy=clone(obj);copy.id=uid();copy.name+=' 副本';
  if(obj.type==='pipe'){
    if(copy.threeD){delete copy.threeD.from;delete copy.threeD.to;if(Array.isArray(copy.threeD.points))copy.threeD.points=copy.threeD.points.map(p=>({...p,id:uid(),x:p.x+1,z:p.z+1}));}
    copy.points=copy.points.map(p=>({...p,id:uid(),x:clamp(p.x+35,0,1120),y:clamp(p.y+35,0,660)}));
    mutate(()=>scene.objects.push(copy),{rebuildScene:true});select(copy.id);return;
  }
  copy.x=clamp(copy.x+24,0,1120-copy.w);copy.y=clamp(copy.y+24,0,660-copy.h);
  const p=positionOf(obj);copy.threeD={...copy.threeD,position:[p[0]+1,p[1],p[2]+1],rotation:obj.threeD?.rotation||[0,0,0],scale:obj.threeD?.scale||[1,1,1]};
  mutate(()=>scene.objects.push(copy),{rebuildScene:true});select(copy.id);
}
function remove(){
  if(!selectedId)return;const id=selectedId;
  mutate(()=>{scene.objects=scene.objects.filter(o=>o.id!==id);selectedId=''}, {rebuildScene:true});
}
function restore(which){
  const from=which==='undo'?history:future,to=which==='undo'?future:history;
  if(!from.length)return;
  to.push(clone(scene));scene=from.pop();dirty=true;rebuild();
}
function fit(top=false){
  orbit.target.set(0,0,0);
  camera.position.set(...(top?[0,48,.01]:[28,29,34]));
  orbit.update();invalidate(true);
}
for(const button of document.querySelectorAll('[data-add]'))button.addEventListener('click',()=>add(button.dataset.add,button.dataset.energy,button.dataset.model||'builtin:auto'));
for(const button of document.querySelectorAll('[data-mode]'))button.addEventListener('click',()=>setMode(button.dataset.mode));
$('save').addEventListener('click',save);
$('undo').addEventListener('click',()=>restore('undo'));
$('redo').addEventListener('click',()=>restore('redo'));
$('duplicate').addEventListener('click',duplicate);
$('delete').addEventListener('click',remove);
$('pipe-delete').addEventListener('click',remove);
$('view-reset').addEventListener('click',()=>fit(false));
$('view-top').addEventListener('click',()=>fit(true));
$('grid').addEventListener('click',event=>{
  grid.visible=!grid.visible;event.currentTarget.classList.toggle('active',grid.visible);invalidate();
});
$('export').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(scene,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='energy-studio-v2.3-scene.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('name').addEventListener('change',event=>{
  mutate(()=>{if(selected())selected().name=event.target.value.slice(0,80)});
});
$('energy').addEventListener('change',event=>{
  mutate(()=>{if(selected()){selected().energy=event.target.value;selected().layer=event.target.value}}, {rebuildScene:true});
});
function refreshModelOptions(){
  const control=$('model-select'),active=control.value;
  control.replaceChildren();
  for(const item of modelCatalog.options())control.add(new Option(item.label,item.id));
  const current=selected()?.threeD?.modelId||active||'builtin:auto';
  if(current&&!modelCatalog.options().some(x=>x.id===current))
    control.add(new Option('本机未找到模型（需重新导入）',current));
  control.value=current;
}
$('model-select').addEventListener('change',event=>{
  const modelId=event.target.value;
  mutate(()=>{if(selected())selected().threeD={...selected().threeD,modelId}}, {rebuildScene:true});
});
$('model-upload-trigger').addEventListener('click',()=>$('model-file').click());
$('model-file').addEventListener('change',async event=>{
  const file=event.target.files?.[0],objectId=selectedId;
  event.target.value='';
  if(!file||!meshes.has(objectId))return;
  $('model-upload-trigger').disabled=true;
  $('model-upload-trigger').textContent='正在校验 GLB...';
  try {
    const asset=await modelCatalog.importGLB(file);
    refreshModelOptions();
    if(scene.objects.some(o=>o.id===objectId)){
      mutate(()=>{const obj=scene.objects.find(o=>o.id===objectId);obj.threeD={...obj.threeD,modelId:asset.id}}, {rebuildScene:true});
      select(objectId);
    }
    toast('已导入本地 GLB：'+asset.label);
  }catch(error){toast('GLB 导入失败：'+error.message)}
  finally{$('model-upload-trigger').disabled=false;$('model-upload-trigger').textContent='＋ 导入本地 GLB 模型'}
});
$('device-run-state').addEventListener('change',event=>{
  mutate(()=>{if(selected())selected().threeD={...selected().threeD,runState:event.target.value}});
});
$('device-speed').addEventListener('input',event=>{
  $('device-speed-display').textContent=Number(event.target.value).toFixed(2)+'×';
});
$('device-speed').addEventListener('change',event=>{
  mutate(()=>{if(selected())selected().threeD={...selected().threeD,animationSpeed:Number(event.target.value)}});
});
$('tank-level').addEventListener('input',event=>{
  $('tank-level-display').textContent=event.target.value+'%';
});
$('tank-level').addEventListener('change',event=>{
  mutate(()=>{if(selected())selected().threeD={...selected().threeD,level:Number(event.target.value)}});
});
$('sim-toggle').addEventListener('click',event=>{
  simulationRunning=!simulationRunning;
  event.currentTarget.classList.toggle('active',simulationRunning);
  event.currentTarget.textContent=simulationRunning?'◉ 动画运行':'Ⅱ 动画暂停';
  lastAnimation=0;invalidate();
});
$('motion-fps').addEventListener('change',event=>{
  simulationFps=[15,24,30].includes(Number(event.target.value))?Number(event.target.value):15;
  $('fps').textContent='节能渲染 · 动画最高 '+simulationFps+' FPS · 静止按需刷新';
  invalidate();
});
for(const prefix of ['p','r','s']){
  for(const axis of ['x','y','z']){
    $(prefix+axis).addEventListener('change',()=>{
      const group=meshes.get(selectedId),obj=selected();if(!group||!obj)return;
      const value=Number($(prefix+axis).value);if(!Number.isFinite(value))return;
      mutate(()=>{
        const target=prefix==='p'?group.position:prefix==='r'?group.rotation:group.scale;
        target[axis]=prefix==='r'?THREE.MathUtils.degToRad(value):prefix==='s'?clamp(value,.2,4):axis==='y'?clamp(value,0,15):clamp(value,-40,40);
        updateFromGroup(obj,group);
      });
    });
  }
}
window.addEventListener('keydown',event=>{
  if(event.target instanceof HTMLElement&&event.target.closest('input,textarea,select,[contenteditable]'))return;
  const mod=event.ctrlKey||event.metaKey;
  if(mod&&event.key.toLowerCase()==='s'){event.preventDefault();save();return}
  if(mod&&event.key.toLowerCase()==='z'){event.preventDefault();restore(event.shiftKey?'redo':'undo');return}
  if(mod&&event.key.toLowerCase()==='y'){event.preventDefault();restore('redo');return}
  if(mod&&event.key.toLowerCase()==='d'){event.preventDefault();duplicate();return}
  if(['Delete','Backspace'].includes(event.key)){event.preventDefault();remove();return}
  const key=event.key.toLowerCase(),modeMap={q:'select',w:'translate',e:'rotate',r:'scale'};
  if(modeMap[key])setMode(modeMap[key]);
});
window.addEventListener('beforeunload',event=>{
  if(!dirty)return;
  event.preventDefault();event.returnValue='';
});
modelCatalog=createModelCatalog({
  world,getScene:()=>scene,invalidate,onError:message=>toast(message)
});
pipeEditor=createPipeEditor({
  THREE,world,camera,renderer,transform,meshes,raycaster,palette,
  getScene:()=>scene,getSelectedId:()=>selectedId,getMode:()=>mode,
  select,setMode,toast,invalidate,
  mutate:fn=>mutate(fn,{rebuildScene:true}),
  markDirty:()=>{dirty=true;updateStatus()},
  refreshUI:()=>{updateList();updateInspector();updateStatus();invalidate()}
});
refreshModelOptions();
modelCatalog.listCustom().then(()=>{refreshModelOptions();updateInspector()});
rebuild();resize();fit();
console.info('[Energy Studio] V2.3 animated model library and pipeline flow ready; published scene isolated');