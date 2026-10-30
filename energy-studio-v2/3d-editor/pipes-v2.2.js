/* Energy Studio V2.2 — 3D piping extension.
 * Keeps PageSchema v1.0.0 compatible: pipe.points is the 2D projection;
 * pipe.threeD stores world coordinates, DN and port attachments.
 */
export function createPipeEditor(ctx) {
  const { THREE, world, transform, meshes, raycaster, palette } = ctx;
  const $ = id => document.getElementById(id);
  const copy = obj => JSON.parse(JSON.stringify(obj));
  const scale = 32 / 1120;
  const dn = { DN50:.105, DN80:.145, DN100:.19, DN125:.225, DN150:.265, DN200:.34 };
  const groups = new Map();
  const geometrySignatures = new Map();
  const handles = [];
  const ports = [];
  let activeIndex = -1, linking = false, linkingStep = 0, lastId = '', pending = 0;
  let serial = 0;
  const uid = prefix => prefix + '-' + Date.now().toString(36) + '-' + (++serial);
  const V = (x,y,z) => new THREE.Vector3(x,y,z);
  const vec = p => V(p.x,p.y,p.z);
  const limit = (v,a,b) => Math.max(a,Math.min(b,v));
  const selectedPipe = () => {
    const selected = ctx.getScene().objects.find(o => o.id === ctx.getSelectedId());
    return selected?.type === 'pipe' ? selected : null;
  };
  function getDevice(id) {
    return ctx.getScene().objects.find(o => o.id === id && (o.type === 'device' || o.type === 'meter')) || null;
  }
  function availableDevices(){ return ctx.getScene().objects.filter(o => meshes.has(o.id)); }
  function portPosition(deviceId,port) {
    const group=meshes.get(deviceId);
    if(!group)return null;
    group.updateWorldMatrix(true,false);
    return group.localToWorld(V(port==='in'?-1.8:1.8,1.3,0));
  }
  function pointOfVec(v,id=uid('pt')){return {id,x:+v.x.toFixed(3),y:+v.y.toFixed(3),z:+v.z.toFixed(3)}}
  function getPath(pipe) {
    const p=pipe.threeD;
    let points=Array.isArray(p?.points)&&p.points.length>=2
      ? p.points.map(v=>({id:v.id||uid('pt'),x:Number(v.x),y:Number(v.y),z:Number(v.z)}))
      : (pipe.points||[]).map(v=>({id:v.id,x:(v.x-560)*scale,y:1.25,z:(v.y-330)*scale}));
    points=points.filter(v=>Number.isFinite(v.x)&&Number.isFinite(v.y)&&Number.isFinite(v.z));
    if(points.length<2)return [];
    const from=p?.from?.deviceId?portPosition(p.from.deviceId,p.from.port||'out'):null;
    const to=p?.to?.deviceId?portPosition(p.to.deviceId,p.to.port||'in'):null;
    if(from)points[0]=pointOfVec(from,points[0].id);
    if(to)points[points.length-1]=pointOfVec(to,points[points.length-1].id);
    return points;
  }
  function writePath(pipe,points) {
    pipe.threeD={...pipe.threeD,diameter:pipe.threeD?.diameter||'DN100',points:points.map(p=>({
      id:p.id,x:+Number(p.x).toFixed(3),y:+Number(p.y).toFixed(3),z:+Number(p.z).toFixed(3)
    }))};
    pipe.points=points.map(p=>({
      id:p.id,
      x:Math.round(limit(p.x/scale+560,0,1120)),
      y:Math.round(limit(p.z/scale+330,0,660))
    }));
    if(points.length) {
      pipe.x=pipe.points[0].x;
      pipe.y=pipe.points[0].y;
    }
  }
  function generatedRoute(from,to) {
    const y=Math.max(1.45,from.y,to.y)+.5;
    const coords=[
      from,
      V(from.x,y,from.z),
      V(to.x,y,from.z),
      V(to.x,y,to.z),
      to
    ];
    const result=[];
    coords.forEach((v,i)=>{
      if(i===0||i===coords.length-1||v.distanceTo(coords[i-1])>.15)
        result.push(pointOfVec(v));
    });
    if(result.length<2)result.push(pointOfVec(to));
    return result;
  }
  function route(pipe) {
    const p=pipe.threeD||{},from=portPosition(p.from?.deviceId,p.from?.port||'out');
    const to=portPosition(p.to?.deviceId,p.to?.port||'in');
    if(!from||!to)return false;
    writePath(pipe,generatedRoute(from,to));
    return true;
  }
  function smoothCorners(path, radius=.5) {
    if(path.length<3)return path.map(vec);
    const pts=[vec(path[0])];
    for(let i=1;i<path.length-1;i++){
      const prev=vec(path[i-1]),cur=vec(path[i]),next=vec(path[i+1]);
      const a=prev.clone().sub(cur),b=next.clone().sub(cur);
      const al=a.length(),bl=b.length();
      if(al<.05||bl<.05||Math.abs(a.clone().normalize().dot(b.clone().normalize()))>.995){
        pts.push(cur);continue;
      }
      const trim=Math.min(radius,al*.32,bl*.32);
      const entry=cur.clone().addScaledVector(a.normalize(),trim);
      const exit=cur.clone().addScaledVector(b.normalize(),trim);
      pts.push(entry);
      for(let j=1;j<=5;j++){
        const t=j/6,omt=1-t;
        pts.push(entry.clone().multiplyScalar(omt*omt)
          .addScaledVector(cur,2*omt*t).addScaledVector(exit,t*t));
      }
      pts.push(exit);
    }
    pts.push(vec(path[path.length-1]));
    return pts;
  }
  function destroyObject(object){
    const disposed=new Set();
    object.traverse(child=>{
      const geometry=child.geometry;
      if(geometry&&!disposed.has(geometry)){geometry.dispose();disposed.add(geometry)}
      if(child.material){
        for(const mat of Array.isArray(child.material)?child.material:[child.material]){
          if(!disposed.has(mat)){mat.dispose();disposed.add(mat)}
        }
      }
    });
  }
  function clearRender(){
    for(const group of groups.values()){world.remove(group);destroyObject(group)}
    groups.clear();geometrySignatures.clear();
    for(const handle of handles){world.remove(handle);destroyObject(handle)}
    handles.length=0;
    for(const port of ports){world.remove(port);destroyObject(port)}
    ports.length=0;
  }
  function makePipe(pipe) {
    const path=getPath(pipe);
    if(path.length<2)return null;
    const group=new THREE.Group();
    group.userData.pipeId=pipe.id;
    const radius=dn[pipe.threeD?.diameter]||dn.DN100;
    const points=smoothCorners(path,Math.max(.25,radius*2));
    const filtered=[points[0]];
    for(let i=1;i<points.length;i++)if(points[i].distanceTo(filtered[filtered.length-1])>.0001)filtered.push(points[i]);
    if(filtered.length<2)return null;
    const curve=new THREE.CatmullRomCurve3(filtered,false,'centripetal',.3);
    const total=filtered.reduce((n,p,i)=>i?n+p.distanceTo(filtered[i-1]):0,0);
    const material=new THREE.MeshStandardMaterial({
      color:palette[pipe.energy]||palette.water,
      metalness:.45,roughness:.34,
      emissive:ctx.getSelectedId()===pipe.id?0x124557:0x000000,
      emissiveIntensity:ctx.getSelectedId()===pipe.id ? .3 : 0
    });
    const tube=new THREE.Mesh(
      new THREE.TubeGeometry(curve,Math.round(limit(total*4,20,128)),radius,10,false),
      material);
    tube.userData.pipeId=pipe.id;
    group.add(tube);
    const ringMaterial=new THREE.MeshStandardMaterial({color:0xa9bfcf,metalness:.65,roughness:.28});
    for(const index of [0,path.length-1]){
      const point=vec(path[index]);
      const neighbour=vec(path[index===0?1:index-1]);
      const direction=point.clone().sub(neighbour).normalize();
      if(direction.lengthSq()<.001)continue;
      const ring=new THREE.Mesh(new THREE.CylinderGeometry(radius*1.34,radius*1.34,.16,14),ringMaterial);
      ring.position.copy(point);
      ring.quaternion.setFromUnitVectors(V(0,1,0),direction);
      ring.userData.pipeId=pipe.id;
      group.add(ring);
    }
    const markerCount=4;
    const markerGeometry=new THREE.SphereGeometry(radius*.72,8,6);
    const markerMaterial=new THREE.MeshBasicMaterial({color:0xe5fcff,transparent:true,opacity:.96,depthWrite:false});
    const markers=[];
    for(let i=0;i<markerCount;i++){
      const marker=new THREE.Mesh(markerGeometry,markerMaterial);
      marker.userData.pipeId=pipe.id;
      marker.visible=false;marker.position.copy(curve.getPoint(i/markerCount));
      group.add(marker);markers.push(marker);
    }
    group.userData.flow={curve,markers};
    return group;
  }
  function animateFlow(time,delta){
    let changed=false;
    for(const [id,group] of groups){
      const pipe=ctx.getScene().objects.find(o=>o.id===id);
      if(!pipe)continue;
      const flow=group.userData.flow;
      if(!flow)continue;
      const enabled=pipe.threeD?.flowState!=='off'&&pipe.threeD?.flowState!=='stopped';
      const speed=Math.max(0,Math.min(3,Number(pipe.threeD?.flowSpeed??1)||0));
      const animate=enabled&&speed>0;
      for(let i=0;i<flow.markers.length;i++){
        const marker=flow.markers[i];
        if(marker.visible!==animate){marker.visible=animate;changed=true}
        if(!animate)continue;
        const progress=((time*.00018*speed+i/flow.markers.length)%1+1)%1;
        marker.position.copy(flow.curve.getPoint(progress));
        changed=true;
      }
    }
    return changed;
  }
  function renderPipes() {
    const pipes=ctx.getScene().objects.filter(o=>o.type==='pipe');
    const valid=new Set(pipes.map(p=>p.id));
    for(const [id,group] of groups){
      if(valid.has(id))continue;
      world.remove(group);destroyObject(group);
      groups.delete(id);geometrySignatures.delete(id);
    }
    for(const pipe of pipes){
      const path=getPath(pipe);
      const signature=JSON.stringify([
        pipe.energy,pipe.threeD?.diameter||'DN100',
        ctx.getSelectedId()===pipe.id,path
      ]);
      if(groups.has(pipe.id)&&geometrySignatures.get(pipe.id)===signature)continue;
      const prior=groups.get(pipe.id);
      if(prior){world.remove(prior);destroyObject(prior);groups.delete(pipe.id)}
      const group=makePipe(pipe);
      if(group){world.add(group);groups.set(pipe.id,group);geometrySignatures.set(pipe.id,signature)}
    }
    ctx.invalidate();
  }
  function drawHandles(){
    for(const handle of handles){world.remove(handle);destroyObject(handle)}
    handles.length=0;
    const pipe=selectedPipe();
    if(!pipe)return;
    const path=getPath(pipe);
    for(let i=0;i<path.length;i++){
      const anchored=(i===0&&pipe.threeD?.from?.deviceId)||
        (i===path.length-1&&pipe.threeD?.to?.deviceId);
      if(anchored)continue;
      const h=new THREE.Mesh(
        new THREE.SphereGeometry(i===activeIndex?.29:.20,10,8),
        new THREE.MeshBasicMaterial({color:i===activeIndex?0xffd56e:0xe5ffff,depthTest:false}));
      h.position.copy(vec(path[i]));
      h.userData={pipeId:pipe.id,pointIndex:i};
      h.renderOrder=20;world.add(h);handles.push(h);
    }
    ctx.invalidate();
  }
  function attachHandle(){
    const pipe=selectedPipe();
    if(!pipe)return; // Preserve the equipment transform gizmo when no pipe is selected.
    transform.detach();
    if(ctx.getMode()==='select')return;
    const handle=handles.find(h=>h.userData.pipeId===pipe.id&&h.userData.pointIndex===activeIndex);
    if(!handle)return;
    transform.setMode('translate');
    transform.attach(handle);
    ctx.invalidate();
  }
  function onSelect() {
    renderPipes(); // Refresh selection highlight without rebuilding unchanged pipe geometry.
    const pipe=selectedPipe();
    if(!pipe){activeIndex=-1;drawHandles();showPorts();return}
    const path=getPath(pipe);
    if(lastId!==pipe.id || activeIndex<0||activeIndex>=path.length){
      activeIndex=path.length>2?1:0;
    }
    lastId=pipe.id;
    drawHandles();attachHandle();showPorts();
  }
  function pick(raycaster) {
    if(linking){
      const hits=raycaster.intersectObjects(ports,false);
      if(hits.length)return {kind:'port',...hits[0].object.userData};
    }
    const hitHandles=raycaster.intersectObjects(handles,false);
    if(hitHandles.length)return {kind:'handle',...hitHandles[0].object.userData};
    const hitTubes=raycaster.intersectObjects([...groups.values()],true);
    if(hitTubes.length){
      const object=hitTubes.find(hit=>hit.object.userData.pipeId);
      if(object)return {kind:'pipe',pipeId:object.object.userData.pipeId};
    }
    return null;
  }
  function handlePick(hit) {
    if(!hit)return false;
    if(hit.kind==='port' && linking) {
      const pipe=selectedPipe();
      if(!pipe)return false;
      const step=linkingStep++;
      ctx.mutate(()=>{
        pipe.threeD={...pipe.threeD};
        pipe.threeD[step%2===0?'from':'to']={deviceId:hit.deviceId,port:hit.port};
        if(pipe.threeD.from?.deviceId&&pipe.threeD.to?.deviceId)route(pipe);
      });
      if(linkingStep>=2){linking=false;linkingStep=0}
      $('pipe-pick-port').textContent=linking?'结束点选端口':'在场景中点选两个端口';
      onSelect();showInspector(selectedPipe());
      return true;
    }
    if(hit.kind==='handle'){
      if(ctx.getSelectedId()!==hit.pipeId)ctx.select(hit.pipeId);
      activeIndex=hit.pointIndex;onSelect();showInspector(selectedPipe());return true;
    }
    if(hit.kind==='pipe'){ctx.select(hit.pipeId);return true}
    return false;
  }
  function updateNodeFromGizmo(){
    const obj=transform.object;
    if(!obj?.userData?.pipeId)return false;
    const pipe=selectedPipe();
    if(!pipe||pipe.id!==obj.userData.pipeId)return false;
    const path=getPath(pipe),index=obj.userData.pointIndex;
    if(!path[index])return false;
    obj.position.y=limit(obj.position.y,.15,16);
    path[index]=pointOfVec(obj.position,path[index].id);
    writePath(pipe,path);
    renderPipes();
    ctx.markDirty();
    $('position').textContent='管线控制点 '+(index+1)+'　X: '+obj.position.x.toFixed(2)+'　Y: '+obj.position.y.toFixed(2)+'　Z: '+obj.position.z.toFixed(2);
    return true;
  }
  function refreshConnections(){
    if(pending)return;
    pending=requestAnimationFrame(()=>{
      pending=0;
      renderPipes();movePorts();
      const pipe=selectedPipe();
      if(pipe&&handles.length){
        const path=getPath(pipe);
        for(const h of handles){
          if(h===transform.object&&transform.dragging)continue;
          const p=path[h.userData.pointIndex];if(p)h.position.copy(vec(p));
        }
      }
    });
  }
  function finalizeConnections(){
    for(const pipe of ctx.getScene().objects.filter(o=>o.type==='pipe')){
      if(pipe.threeD?.from?.deviceId||pipe.threeD?.to?.deviceId)writePath(pipe,getPath(pipe));
    }
    refreshConnections();
  }
  function showPorts(){
    const visible=linking||!!selectedPipe();
    for(const p of ports)p.visible=visible;
    movePorts();
  }
  function movePorts(){
    for(const port of ports){
      const p=portPosition(port.userData.deviceId,port.userData.port);
      if(p)port.position.copy(p);
      port.visible=(linking||!!selectedPipe())&&!!p;
    }
    ctx.invalidate();
  }
  function drawPorts(){
    for(const port of ports){world.remove(port);destroyObject(port)}
    ports.length=0;
    for(const device of availableDevices()){
      for(const [portName,color] of [['in',0x8de6ff],['out',0xffc86b]]){
        const mesh=new THREE.Mesh(
          new THREE.SphereGeometry(.21,12,8),
          new THREE.MeshBasicMaterial({color,depthTest:false}));
        mesh.userData={deviceId:device.id,port:portName};
        mesh.renderOrder=24;world.add(mesh);ports.push(mesh);
      }
    }
    showPorts();
  }
  function rebuild(){
    if(pending){cancelAnimationFrame(pending);pending=0}
    if(transform.object?.userData?.pipeId)transform.detach();
    clearRender();renderPipes();drawPorts();
    if(selectedPipe())onSelect();
    updateList();
  }
  function appendList(container){
    for(const pipe of ctx.getScene().objects.filter(o=>o.type==='pipe')){
      const button=document.createElement('button');
      button.className=pipe.id===ctx.getSelectedId()?'active':'';
      const name=document.createElement('span');name.textContent='⌁ '+pipe.name;
      const label=document.createElement('small');label.textContent=pipe.threeD?.diameter||'DN100';
      button.append(name,label);
      button.addEventListener('click',()=>ctx.select(pipe.id));
      container.append(button);
    }
  }
  function updateList(){
    const pipes=ctx.getScene().objects.filter(o=>o.type==='pipe');
    $('pipes-count').textContent=String(pipes.length);
    $('count').textContent=String(meshes.size+pipes.length);
  }
  function showInspector(pipe){
    if(!pipe){$('pipe-inspector').hidden=true;return}
    $('empty').hidden=true;$('inspector').hidden=true;
    $('pipe-inspector').hidden=false;
    $('selected-label').textContent='已选择三维管线：'+pipe.name;
    $('position').textContent='管线 · '+getPath(pipe).length+' 个控制点';
    $('pipe-name').value=pipe.name;
    $('pipe-energy').value=pipe.energy;
    $('pipe-dn').value=pipe.threeD?.diameter||'DN100';
    $('pipe-flow-state').value=pipe.threeD?.flowState||'running';
    $('pipe-flow-speed').value=String(pipe.threeD?.flowSpeed??1);
    const devices=availableDevices();
    for(const side of ['from','to']){
      const select=$('pipe-'+side+'-device'),current=pipe.threeD?.[side]?.deviceId||'';
      select.replaceChildren(new Option('未连接设备',''));
      for(const dev of devices)select.add(new Option(dev.name,dev.id));
      select.value=current;
      $('pipe-'+side+'-port').value=pipe.threeD?.[side]?.port||(side==='from'?'out':'in');
    }
    const path=getPath(pipe);
    $('pipe-nodes').textContent=String(path.length);
    const options=$('pipe-point');
    options.replaceChildren();
    path.forEach((p,i)=>options.add(new Option((i+1)+' · X '+p.x.toFixed(1)+' / Y '+p.y.toFixed(1)+' / Z '+p.z.toFixed(1),String(i))));
    options.value=String(activeIndex>=0?activeIndex:0);
    const anchored=(activeIndex===0&&pipe.threeD?.from?.deviceId)||
      (activeIndex===path.length-1&&pipe.threeD?.to?.deviceId);
    $('pipe-delete-point').disabled=path.length<=2||!!anchored;
    $('pipe-pick-port').textContent=linking?'结束点选端口':'在场景中点选两个端口';
  }
  function makeNew(){
    if(ctx.getScene().objects.length>=500){ctx.toast('最多支持 500 个对象');return}
    const devices=availableDevices();
    const from=devices.find(d=>d.id===ctx.getSelectedId())||devices[0];
    const to=devices.find(d=>d.id!==from?.id&&d.energy===from?.energy)||
      devices.find(d=>d.id!==from?.id);
    if(!from||!to){ctx.toast('至少需要两个设备才能创建连接管线');return}
    const number=ctx.getScene().objects.filter(o=>o.type==='pipe').length+1;
    const pipe={
      id:uid('pipe'),type:'pipe',name:'三维管线 '+number,
      x:0,y:0,w:0,h:0,z:15,energy:from.energy,layer:from.energy,
      action:'popup',marker:'both',binding:{deviceId:'',param:''},
      points:[{id:uid('pt'),x:0,y:0},{id:uid('pt'),x:20,y:20}],
      threeD:{diameter:'DN100',from:{deviceId:from.id,port:'out'},
        to:{deviceId:to.id,port:'in'},points:[]}
    };
    if(!route(pipe)){ctx.toast('无法定位设备连接端口');return}
    ctx.mutate(()=>ctx.getScene().objects.push(pipe));
    ctx.select(pipe.id);
    ctx.setMode('translate');
    ctx.toast('三维管线已创建。可拖动控制点调整路径。');
  }
  function updateField(field,value){
    const pipe=selectedPipe();if(!pipe)return;
    ctx.mutate(()=>{
      if(field==='name')pipe.name=String(value).slice(0,80);
      else if(field==='energy'){pipe.energy=value;pipe.layer=value}
      else if(field==='diameter')pipe.threeD={...pipe.threeD,diameter:value};
      else if(field==='flowState')pipe.threeD={...pipe.threeD,flowState:value};
      else if(field==='flowSpeed')pipe.threeD={...pipe.threeD,flowSpeed:limit(Number(value)||0,0,3)};
      else {
        const [side,part]=field.split(':');
        pipe.threeD={...pipe.threeD,[side]:{...pipe.threeD?.[side],[part]:value}};
        if(part==='deviceId'&&!value)delete pipe.threeD[side];
        if(part==='deviceId'&&value)pipe.threeD[side].port=side==='from'?'out':'in';
        if(pipe.threeD.from?.deviceId&&pipe.threeD.to?.deviceId)route(pipe);
      }
    });
    showInspector(selectedPipe());
  }
  function addPoint(){
    const pipe=selectedPipe();if(!pipe)return;
    const path=getPath(pipe);if(path.length>=200){ctx.toast('最多 200 个节点');return}
    let longest=-1,index=-1;
    for(let i=0;i<path.length-1;i++){
      const len=vec(path[i]).distanceTo(vec(path[i+1]));
      if(len>longest){longest=len;index=i}
    }
    if(index<0)return;
    const midpoint=vec(path[index]).add(vec(path[index+1])).multiplyScalar(.5);
    const p=pointOfVec(midpoint);
    path.splice(index+1,0,p);
    ctx.mutate(()=>writePath(pipe,path));
    activeIndex=index+1;onSelect();showInspector(pipe);
  }
  function deletePoint(){
    const pipe=selectedPipe();if(!pipe)return;
    const path=getPath(pipe),i=activeIndex;
    if(path.length<=2||i<0)return;
    if((i===0&&pipe.threeD?.from?.deviceId)||
       (i===path.length-1&&pipe.threeD?.to?.deviceId)){
      ctx.toast('已绑定设备的端口节点不能删除');return
    }
    path.splice(i,1);
    ctx.mutate(()=>writePath(pipe,path));
    activeIndex=Math.min(i,path.length-1);onSelect();showInspector(pipe);
  }
  function selectPoint(index){
    activeIndex=index;onSelect();showInspector(selectedPipe());
  }
  function bindUI(){
    $('pipe-create').addEventListener('click',makeNew);
    $('pipe-name').addEventListener('change',e=>updateField('name',e.target.value));
    $('pipe-energy').addEventListener('change',e=>updateField('energy',e.target.value));
    $('pipe-dn').addEventListener('change',e=>updateField('diameter',e.target.value));
    $('pipe-flow-state').addEventListener('change',e=>updateField('flowState',e.target.value));
    $('pipe-flow-speed').addEventListener('change',e=>updateField('flowSpeed',e.target.value));
    for(const side of ['from','to']){
      $('pipe-'+side+'-device').addEventListener('change',e=>updateField(side+':deviceId',e.target.value));
      $('pipe-'+side+'-port').addEventListener('change',e=>updateField(side+':port',e.target.value));
    }
    $('pipe-point').addEventListener('change',e=>selectPoint(Number(e.target.value)));
    $('pipe-add-point').addEventListener('click',addPoint);
    $('pipe-delete-point').addEventListener('click',deletePoint);
    $('pipe-auto-route').addEventListener('click',()=>{
      const pipe=selectedPipe();if(!pipe)return;
      if(!pipe.threeD?.from?.deviceId||!pipe.threeD?.to?.deviceId){
        ctx.toast('请先选择起点和终点设备');return
      }
      ctx.mutate(()=>route(pipe));onSelect();showInspector(pipe);
    });
    $('pipe-pick-port').addEventListener('click',()=>{
      if(!selectedPipe()){ctx.toast('请先选中一条管线');return}
      linking=!linking;linkingStep=0;
      showPorts();showInspector(selectedPipe());
      if(linking)ctx.toast('请依次点击起点设备出口和终点设备入口');
    });
  }
  bindUI();
  return {
    has:id=>groups.has(id),
    rebuild,appendList,showInspector,onSelect,pick,handlePick,
    onEquipmentChanged:refreshConnections,
    finalizeConnections,onTransformChanged:updateNodeFromGizmo,
    onModeChange:attachHandle,updateList,animateFlow
  };
}
