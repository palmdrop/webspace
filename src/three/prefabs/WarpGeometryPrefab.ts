import * as THREE from 'three';
import { geometryWarp, WarpEntry } from '../geometry/warp/warp';
import { GeometryPrefab } from './prefabs';

export const generateWarpGeometryPrefab = (
  geometryMaker : () => THREE.BufferGeometry,
  frequencyMaker : () => THREE.Vector3,
  warpAmountMaker : ( frequency : THREE.Vector3 ) => number | THREE.Vector3,
  octavesMaker : () => number,
  lacunarityMaker : () => number,
  persistanceMaker : () => number,
  
  warpEntries : WarpEntry[],

  outputBoundingBox ?: THREE.Box3
) : GeometryPrefab => () => {
  const geometry = geometryMaker();
  const frequency = frequencyMaker();
  const warpAmount = warpAmountMaker( frequency );
  const octaves = octavesMaker();
  const lacunarity = lacunarityMaker();
  const persistance = persistanceMaker();

  geometryWarp(
    geometry,
    frequency,
    warpAmount,
    octaves,
    lacunarity,
    persistance,
    warpEntries,
    true,
    outputBoundingBox
  );

  return geometry;
};
  