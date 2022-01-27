import * as THREE from 'three';
import { geometryWarp, WarpEntry } from '../geometry/warp/warp';
import { GeometryPrefab } from './prefabs';

export const generateWarpGeometryPrefab = <A>(
  geometryMaker : ( args : A ) => THREE.BufferGeometry,
  frequencyMaker : ( args : A ) => THREE.Vector3,
  warpAmountMaker : ( frequency : THREE.Vector3, args : A ) => number | THREE.Vector3,
  octavesMaker : ( args : A ) => number,
  lacunarityMaker : ( args : A ) => number,
  persistanceMaker : ( args : A ) => number,
  
  warpEntries : WarpEntry[],

  outputBoundingBox ?: THREE.Box3
) : GeometryPrefab<A> => ( args : A ) => {
  const geometry = geometryMaker( args );
  const frequency = frequencyMaker( args );
  const warpAmount = warpAmountMaker( frequency, args );
  const octaves = octavesMaker( args );
  const lacunarity = lacunarityMaker( args );
  const persistance = persistanceMaker( args );

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
  