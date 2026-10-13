export type Energy = 'electric' | 'water' | 'gas';
export type Layer = 'overview' | 'electric' | 'water' | 'gas';
export type ObjectType = 'text' | 'label' | 'card' | 'device' | 'meter' | 'pipe';
export type ActionType = 'popup' | 'tooltip' | 'navigate' | 'none';
export type MarkerType = 'none' | 'start' | 'end' | 'both';
export type Mode = 'edit' | 'runtime';
export type Filter = 'all' | Energy;
export type LayerFilter = 'all' | Layer;

export interface Point { id: string; x: number; y: number }
export interface Binding { deviceId: string; param: string }
export interface SceneObjectBase {
  id: string; type: ObjectType; name: string;
  x: number; y: number; w: number; h: number; z: number;
  layer: Layer; energy: Energy; binding: Binding; action: ActionType;
}
export interface WidgetObject extends SceneObjectBase {
  type: Exclude<ObjectType, 'pipe'>;
  points?: never;
  marker?: never;
}
export interface PipeObject extends SceneObjectBase {
  type: 'pipe'; points: Point[]; marker: MarkerType;
}
export type SceneObject = WidgetObject | PipeObject;
export interface PageSchema {
  schemaVersion: '1.0.0'; pageName: string;
  width: number; height: number; objects: SceneObject[];
}
export interface PointMeta { id: string; name: string; unit: string; kind: 'collected' | 'virtual' }
export interface MockDevice { id: string; name: string; energy: Energy; points: PointMeta[] }
export type MoveKind = 'move' | 'resize' | 'point';