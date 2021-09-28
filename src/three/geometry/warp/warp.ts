import * as THREE from 'three';
import { random } from '../../../utils/Random';

import { getNoise3D, Vector3 } from "../../utils/noise"

const xOffset = new THREE.Vector3( 100.0, 31.0, 51.0 );
const yOffset = new THREE.Vector3( -31.0, 0.0, 3.0 );
const zOffset = new THREE.Vector3( 38.0, -25.0, 10.0 );

const tempVector1 = new THREE.Vector3();
const tempVector2 = new THREE.Vector3();
const tempEuler = new THREE.Euler();

export type TransformFunctionArgs = { [key: string]: number | THREE.Vector3 };

export type TransformFunction = ( 
  point : Vector3,
  offset : Vector3 | undefined | null,
  frequency : number | Vector3,
  amount : number,
  args? : TransformFunctionArgs
) => Vector3;


export const domainWarp : TransformFunction = ( point, offset, frequency, amount, args = {
  warpFrequency : new THREE.Vector3( 0.3 ),
  warpAmount : 0.2, 
} ) => {
  const warpedPoint = noiseWarp( point, null, args.warpFrequency, args.warpAmount as number );

  const o = {
    x : warpedPoint.x - point.x,
    y : warpedPoint.y - point.y,
    z : warpedPoint.z - point.z,
  }

  if( offset ) {
    o.x += offset.x;
    o.y += offset.y;
    o.z += offset.z;
  }

  return noiseWarp( point, o, frequency, amount );
}

export const noiseWarp : TransformFunction = ( point, offset, frequency, amount, args = {} ) => {
  const { x, y, z } = point;

  const sample = { x, y, z };
  if( offset ) {
    sample.x += offset.x;
    sample.y += offset.y;
    sample.z += offset.z;
  }

  return {
    x : x + getNoise3D( sample, xOffset, frequency, -amount, amount ),
    y : y + getNoise3D( sample, yOffset, frequency, -amount, amount ),
    z : z + getNoise3D( sample, zOffset, frequency, -amount, amount )
  }
}

export const twistWarp : TransformFunction = ( point, offset, frequency, amount, args = {
  twistAmount : new THREE.Vector3( 0.0, 0.5, 0.0 ),
  falloff : 0.9,
} ) => {
  const vector = tempVector1.set( point.x, point.y, point.z );
  tempVector2.copy( tempVector1 );

  const { x, y, z } = vector;

  vector.x *= Math.pow( args.falloff as number, Math.sqrt( y * y + z * z ) );
  vector.y *= Math.pow( args.falloff as number, Math.sqrt( x * x + z * z ) );
  vector.z *= Math.pow( args.falloff as number, Math.sqrt( x * x + y * y ) );

  vector.multiply( args.twistAmount as THREE.Vector3 );
  const euler = tempEuler.setFromVector3( vector );

  tempVector2.applyEuler( euler );

  return {
    x: tempVector2.x,
    y: tempVector2.y,
    z: tempVector2.z,
  };
}

export type WarpEntry = {
  warpFunction : TransformFunction,
  args? : TransformFunctionArgs
}

export const geometryWarp = ( 
  geometry : THREE.BufferGeometry,

  frequency : number | Vector3,
  amount : number,
  octaves : number,
  lacunarity : number,
  persistance : number,

  warpEntries : WarpEntry[],

  correctOffset : boolean = true
) => {

  const noiseOffset = new THREE.Vector3(
    random( -100, 100 ),
    random( -100, 100 ),
    random( -100, 100 )
  );

  const averageOffset = new THREE.Vector3();

  const positionAttribute = geometry.attributes.position;
  for(let k = 0; k < octaves; k++) {
    for(let i = 0; i < positionAttribute.count; i++ ) {
      let x = positionAttribute.getX( i );
      let y = positionAttribute.getY( i );
      let z = positionAttribute.getZ( i );

      let warp = { x, y, z };
      for( let w = 0; w < warpEntries.length; w++ ) {
        const { 
          warpFunction, 
          args
        } = warpEntries[ w ];

        warp = warpFunction( warp, noiseOffset, frequency, amount, args );
      }

      positionAttribute.setXYZ( i, warp.x, warp.y, warp.z );

      if(k === octaves - 1 ) {
        averageOffset.x += warp.x;
        averageOffset.y += warp.y;
        averageOffset.z += warp.z;
      }
    }

    if( typeof frequency === 'number' ) {
      frequency *= lacunarity;
    } else {
      frequency.x *= lacunarity;
      frequency.y *= lacunarity;
      frequency.z *= lacunarity;
    }

    amount *= persistance;
  }

  geometry.computeVertexNormals();
  if( correctOffset ) {
    averageOffset.divideScalar( positionAttribute.count );
    geometry.translate( -averageOffset.x, -averageOffset.y, -averageOffset.z );
  }

  return geometry;
}