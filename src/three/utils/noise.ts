import { makeNoise3D } from 'fast-simplex-noise';
import { clamp } from 'three/src/math/MathUtils';

export type Vector3 = { x : number, y : number, z : number };

export const noise3D = makeNoise3D();

export const getNoise3D = ( 
  position : Vector3, 
  offset : Vector3 | null | undefined, 
  frequency : number | Vector3,
  min : number = -1.0, 
  max : number = 1.0 
) => {
  let x = position.x;
  let y = position.y;
  let z = position.z;

  if( typeof frequency === 'number' ) {
    x *= frequency;
    y *= frequency;
    z *= frequency;
  } else {
    x *= frequency.x;
    y *= frequency.y;
    z *= frequency.z;
  }

  if( offset ) {
    x += offset.x;
    y += offset.y;
    z += offset.z;
  }
  const n = ( noise3D( x, y, z ) + 1.0 ) / 2.0;
  return clamp( min + ( max - min ) * n, min, max );
}