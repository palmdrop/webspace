import * as THREE from 'three';

export type Prefab<T, A> = ( args : A ) => T;
export type MaterialPrefab = Prefab<THREE.Material, {}>;
export type GeometryPrefab = Prefab<THREE.BufferGeometry, {}>;