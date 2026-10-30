import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const DB_NAME='energy-studio-model-assets';
const STORE_NAME='models';
const LIMIT_BYTES=8*1024*1024;
const builtin=[
  {id:'builtin:auto',label:'自动识别设备类型'},
  {id:'builtin:pump',label:'循环水泵 · 动态叶轮'},
  {id:'builtin:ahu',label:'空调机组 · 双风机'},
  {id:'builtin:valve',label:'工业阀门 · 开闭'},
  {id:'builtin:tank',label:'储罐 · 液位变化'},
  {id:'builtin:meter',label:'智能仪表 · 状态屏'}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const safeNumber=(v,def=1)=>Number.isFinite(Number(v))?Number(v):def;

function openDB(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){reject(new Error('浏览器不支持 IndexedDB'));return}
    const request=indexedDB.open(DB_NAME,1);
    request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE_NAME))db.createObjectStore(STORE_NAME,{keyPath:'id'})};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('模型数据库无法打开'));
  });
}
async function dbOp(mode,callback){
  const db=await openDB();
  try{
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE_NAME,mode),request=callback(tx.objectStore(STORE_NAME));
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
      tx.onerror=()=>reject(tx.error);
    });
  }finally{db.close()}
}
function mesh(parent,geometry,material,x=0,y=0,z=0){
  const o=new THREE.Mesh(geometry,material);o.position.set(x,y,z);parent.add(o);return o
}
function metal(color=0x688698,metalness=.58){
  return new THREE.MeshStandardMaterial({color,metalness,roughness:.36})
}
function cube(parent,x,y,z,w,h,d,color){
  return mesh(parent,new THREE.BoxGeometry(w,h,d),metal(color),x,y,z)
}
function cyl(parent,x,y,z,r,height,color,axis='y',r2=r){
  const node=mesh(parent,new THREE.CylinderGeometry(r,r2,height,16),metal(color),x,y,z);
  if(axis==='x')node.rotation.z=Math.PI/2;
  if(axis==='z')node.rotation.x=Math.PI/2;
  return node
}
function rotor(parent,x,y,z,color,axis='x'){
  const group=new THREE.Group();group.position.set(x,y,z);parent.add(group);
  const hub=cyl(group,0,0,0,.22,.26,color,axis);
  for(let i=0;i<4;i++){
    const angle=i*Math.PI/2;
    const blade=cube(group,0,Math.sin(angle)*.42,Math.cos(angle)*.42,.10,.22,.53,0x9ac8d9);
    blade.rotation.x=angle;
  }
  return {group,axis,hub};
}
function createNative(parent,type,color){
  const animated={rotors:[],valve:null,liquid:null,animations:[]};
  cube(parent,0,.12,0,3.3,.24,2.65,0x2b4358);
  cube(parent,0,.30,0,3.12,.14,2.45,0x426177);
  if(type==='pump'){
    cube(parent,0,.62,0,2.75,.42,1.68,0x527188);
    cyl(parent,0,1.35,0,.74,1.5,0x39749c,'x');
    cyl(parent,-1.0,1.35,0,.46,.42,color,'x');
    cyl(parent,1.0,1.35,0,.46,.42,color,'x');
    animated.rotors.push(rotor(parent,.75,1.35,0,color,'x'));
    cube(parent,0,2.07,0,.62,.34,.65,0x99b6c8);
  }else if(type==='ahu'){
    cube(parent,0,1.24,0,2.92,1.74,1.9,0x829cab);
    cube(parent,0,2.17,0,2.8,.14,1.75,0x3f586b);
    for(const x of[-.86,.86]){
      const fan=cyl(parent,x,2.31,0,.58,.16,0x243d55);
      animated.rotors.push(rotor(parent,x,2.39,0,color,'y'));
    }
    cube(parent,1.12,1.48,1,.48,.29,.14,0xe6b968);
  }else if(type==='valve'){
    cyl(parent,0,1.06,0,.42,2.6,0x9aafbc,'x');
    cyl(parent,-1.28,1.06,0,.67,.2,color,'x');
    cyl(parent,1.28,1.06,0,.67,.2,color,'x');
    cyl(parent,0,1.38,0,.65,.72,0x597d95);
    cyl(parent,0,2.05,0,.14,.76,0xd7e5ea);
    const handle=new THREE.Group();handle.position.set(0,2.4,0);parent.add(handle);
    cyl(handle,0,0,0,.59,.10,color);
    cube(handle,0,.07,0,1.4,.12,.11,0xcddce6);
    animated.valve=handle;
  }else if(type==='tank'){
    cyl(parent,0,1.55,0,1.05,2.65,0x567d96);
    cyl(parent,0,2.92,0,1.1,.14,0xb1c9d5);
    const liquid=cyl(parent,0,.9,0,.89,1,0x16c7e9);
    liquid.material.transparent=true;liquid.material.opacity=.65;
    liquid.material.depthWrite=false;
    animated.liquid=liquid;
    cyl(parent,0,3.12,0,.35,.25,0x8eabbc);
    cube(parent,1.07,1.55,0,.12,2.1,.22,0xdce9ec);
  }else{
    cube(parent,0,1.48,0,2,2,1.14,0x9aaeba);
    cube(parent,0,1.78,.60,1.55,1.02,.12,0x0c354f);
    cube(parent,0,2.02,.68,1.18,.14,.08,color);
    for(const x of[-.55,0,.55])cube(parent,x,1.1,.65,.28,.17,.1,0x346a8e);
  }
  const beacon=mesh(parent,new THREE.TorusGeometry(.35,.05,7,28),
    new THREE.MeshBasicMaterial({color}),0,3.35,0);
  beacon.rotation.x=Math.PI/2;
  animated.beacon=beacon;
  return animated;
}
function dispose(object){
  object.traverse(node=>{
    node.geometry?.dispose();
    if(node.material)for(const mat of Array.isArray(node.material)?node.material:[node.material])mat.dispose();
  });
}
export function createModelCatalog({world,getScene,invalidate,onError=()=>{}}){
  const loader=new GLTFLoader();
  const nodes=new Map();
  const cache=new Map();
  let customList=[];
  const infer=obj=>obj.type==='meter'?'meter':obj.energy==='water'?'pump':obj.energy==='gas'?'valve':'ahu';
  const resolveId=obj=>{
    const id=obj.threeD?.modelId||'builtin:auto';
    return id==='builtin:auto'?'builtin:'+infer(obj):id;
  };
  function build(obj){
    const outer=new THREE.Group(),inner=new THREE.Group();
    outer.add(inner);outer.userData.id=obj.id;
    const id=resolveId(obj);
    const fallbackType=infer(obj),modelType=id.startsWith('builtin:')?id.slice(8):fallbackType;
    const rig=createNative(inner,builtin.some(b=>b.id===id)?modelType:fallbackType,
      ({water:0x1eacdf,electric:0xe4b747,gas:0xff8a58})[obj.energy]||0x1eacdf);
    const state={outer,inner,rig,modelId:id,mixer:null,pending:false,active:true};
    nodes.set(obj.id,state);
    if(id.startsWith('custom:'))loadIntoState(obj.id,id,state);
    outer.traverse(child=>{if(child.isMesh)child.userData.deviceId=obj.id});
    return outer;
  }
  async function getBuffer(id){
    if(cache.has(id))return cache.get(id);
    const record=await dbOp('readonly',store=>store.get(id));
    if(!record)throw new Error('模型文件不存在，请重新导入 GLB');
    cache.set(id,record.buffer);
    return record.buffer;
  }
  async function loadIntoState(objId,id,state){
    state.pending=true;
    try{
      const buffer=await getBuffer(id);
      const gltf=await new Promise((resolve,reject)=>loader.parse(buffer.slice(0),'',resolve,reject));
      if(!state.active||nodes.get(objId)!==state||state.modelId!==id)return;
      const model=gltf.scene;
      model.traverse(child=>{
        if(child.isMesh){child.userData.deviceId=objId;child.castShadow=false;child.receiveShadow=false}
      });
      const bounds=new THREE.Box3().setFromObject(model);
      if(bounds.isEmpty())throw new Error('GLB 没有可显示的几何模型');
      const size=bounds.getSize(new THREE.Vector3());
      const longest=Math.max(size.x,size.y,size.z,.001);
      model.scale.setScalar(clamp(3.2/longest,.02,30));
      model.updateMatrixWorld(true);
      const scaledBounds=new THREE.Box3().setFromObject(model);
      const center=scaledBounds.getCenter(new THREE.Vector3());
      model.position.sub(new THREE.Vector3(center.x,scaledBounds.min.y,center.z));
      for(const child of [...state.inner.children]){
        state.inner.remove(child);dispose(child);
      }
      state.inner.add(model);
      state.rig={rotors:[],valve:null,liquid:null,animations:[]};
      if(gltf.animations?.length){
        state.mixer=new THREE.AnimationMixer(model);
        for(const clip of gltf.animations)state.mixer.clipAction(clip).play();
      }
      invalidate();
    }catch(error){console.warn('[Energy Studio] GLB load failed',error);onError(error.message||'模型加载失败，已使用内置模型')}
    finally{state.pending=false}
  }
  function unmount(id){
    const state=nodes.get(id);if(!state)return;
    state.active=false;
    state.mixer?.stopAllAction();
    nodes.delete(id);
  }
  function clear(){for(const id of nodes.keys())unmount(id)}
  function update(time,delta){
    let changed=false;
    const scene=getScene();
    for(const [id,state] of nodes){
      if(!state.active||state.pending)continue;
      const object=scene.objects.find(obj=>obj.id===id);
      if(!object)continue;
      const settings=object.threeD||{},status=settings.runState||'running';
      const speed=clamp(safeNumber(settings.animationSpeed,1),0,3);
      const running=status==='running'&&speed>0;
      const rig=state.rig;
      if(state.mixer){state.mixer.timeScale=running?speed:0;if(running){state.mixer.update(delta);changed=true}}
      for(const rotor of rig.rotors){
        if(!running)continue;
        rotor.group.rotation[rotor.axis]+=delta*speed*3.5;
        changed=true;
      }
      if(rig.valve){
        const target=status==='stopped'?Math.PI/2:0;
        const current=rig.valve.rotation.y;
        const next=THREE.MathUtils.damp(current,target,5,delta);
        if(Math.abs(next-current)>.0001){rig.valve.rotation.y=next;changed=true}
      }
      if(rig.liquid){
        const fraction=clamp(safeNumber(settings.level,65),0,100)/100;
        const targetScale=Math.max(.02,fraction*2.45);
        const current=rig.liquid.scale.y;
        const next=THREE.MathUtils.damp(current,targetScale,5,delta);
        if(Math.abs(next-current)>.0001){
          rig.liquid.scale.y=next;
          rig.liquid.position.y=.32+next/2;
          changed=true
        }
      }
      if(rig.beacon){
        const on=status==='alarm';
        const material=rig.beacon.material;
        const color=on?0xff4863:({water:0x1eacdf,electric:0xe4b747,gas:0xff8a58}[object.energy]||0x1eacdf);
        if(material.color.getHex()!==color){material.color.setHex(color);changed=true}
      }
    }
    return changed;
  }
  async function importGLB(file){
    if(!file||!file.name?.toLowerCase().endsWith('.glb'))throw new Error('仅支持包含内嵌资源的 .glb 文件');
    if(file.size<20||file.size>LIMIT_BYTES)throw new Error('GLB 模型大小需要介于 20 B 与 8 MB 之间');
    const buffer=await file.arrayBuffer(),view=new DataView(buffer);
    if(view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2||view.getUint32(8,true)!==buffer.byteLength)
      throw new Error('无效或不支持的 glTF 2.0 GLB 文件');
    // Validate geometry before storing to avoid persisting broken assets.
    await new Promise((resolve,reject)=>loader.parse(buffer.slice(0),'',resolve,reject));
    const id='custom:'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
    const name=file.name.slice(0,70);
    await dbOp('readwrite',store=>store.put({id,name,buffer,createdAt:Date.now()}));
    cache.set(id,buffer);customList.push({id,label:name});
    return {id,label:name};
  }
  async function listCustom(){
    try{
      const entries=await dbOp('readonly',store=>store.getAll());
      customList=entries.map(e=>({id:e.id,label:e.name})).sort((a,b)=>a.label.localeCompare(b.label));
      return customList;
    }catch(error){onError('本地模型资源库不可用：'+error.message);return []}
  }
  function options(){return [...builtin,...customList]}
  return {build,unmount,clear,update,importGLB,listCustom,options,resolveId};
}
