import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { addPipePoint, clone, createObject, demoScene, removePipePoint, validateScene } from '../src/model/scene';
import { useEditorStore } from '../src/stores/editor';
import type { PipeObject } from '../src/types/scene';
describe('Energy Studio schema and interactions',()=>{
  beforeEach(()=>setActivePinia(createPinia()));
  it('validates the sanitized factory scene',()=>expect(validateScene(demoScene())).toBeUndefined());
  it('keeps stable pipe IDs while adding/removing points',()=>{
    const pipe=createObject('pipe') as PipeObject;
    const ids=pipe.points.map(p=>p.id);
    expect(addPipePoint(pipe,0)).toBe(true);
    expect(pipe.points).toHaveLength(4);
    expect(pipe.points[0].id).toBe(ids[0]);
    expect(pipe.points[2].id).toBe(ids[1]);
    expect(removePipePoint(pipe,1)).toBe(true);
    expect(removePipePoint(pipe,1)).toBe(true);
    expect(removePipePoint(pipe,1)).toBe(false);
  });
  it('rejects duplicate IDs and malformed nodes',()=>{
    const s=demoScene(); s.objects.push(clone(s.objects[0])); expect(()=>validateScene(s)).toThrow('ID');
    const p=demoScene(); const pipe=p.objects.find(o=>o.type==='pipe') as PipeObject;
    pipe.points=[];expect(()=>validateScene(p)).toThrow('管线');
  });
  it('supports undo/redo with immutable published scenes',()=>{
    const store=useEditorStore();const baseline=store.published.objects.length;
    store.add('card',100,110);expect(store.scene.objects.length).toBe(baseline+1);
    expect(store.published.objects.length).toBe(baseline);
    store.undo();expect(store.scene.objects.length).toBe(baseline);
    store.redo();expect(store.scene.objects.length).toBe(baseline+1);
    store.publish();expect(store.published.objects.length).toBe(baseline+1);
  });
  it('resets the selected parameter when the device changes',()=>{
    const store=useEditorStore();
    const selected=store.scene.objects.find(o=>o.binding.param);
    expect(selected).toBeDefined();
    store.select(selected!.id);
    store.setDevice('mock-pump-02');
    expect(store.selected?.binding).toEqual({deviceId:'mock-pump-02',param:''});
  });
  it('isolates imported draft from published',()=>{
    const store=useEditorStore();const incoming=demoScene();incoming.pageName='Imported';
    store.importScene(incoming);expect(store.scene.pageName).toBe('Imported');
    expect(store.published.pageName).not.toBe('Imported');
  });
});