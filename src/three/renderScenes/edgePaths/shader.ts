import * as THREE from 'three';
import { random, randomElement } from '../../../utils/random';
import { ColorSettings, DomainWarp, Fog, PatternShaderSettings, Source, WarpedSource } from '../../shader/builder/pattern/types';

const textureSource : Source = {
  kind: 'texture',
  name: 'tDiffuse',
  texture: null, 
  toFloat: {
    parameters: [ [ 'vec4', 'color' ] ],
    returnType: 'float',
    body: `
      return 1.5 * ( ( color.r * 0.3 + color.g * 0.6 + color.b * 0.1 ) * color.a + 0.0);
    `
  }
};

export const noiseSource1 : Source = {
  kind: 'noise',
  frequency: new THREE.Vector3(
    random( 1.1, 2.0 ),
    random( 1.1, 2.0 ),
    random( 1.1, 2.0 ),
  ),
  // amplitude: getTextureSource( 'tDiffuse' ),
  amplitude: 1.0,
  pow: 2.0,
  // TODO note something is off with normalization...
  octaves: Math.floor( random( 3, 5 ) ),
  persistance: 0.3,
  lacunarity: 2.2,
  ridge: random( 0.5, 0.8 )
};

export const noiseSource2 : Source = {
  kind: 'noise',
  frequency: new THREE.Vector3(
    random( 1.1, 2.0 ),
    random( 1.1, 2.0 ),
    random( 1.1, 2.0 ),
  ),
  amplitude: 1.4,
  pow: 1.0,
  // TODO note something is off with normalization...
  octaves: Math.floor( random( 3, 5 ) ),
  persistance: 0.2,
  lacunarity: 4.2,
  ridge: random( 0.8, 0.8 )
};

const warp : DomainWarp = {
  sources: {
    x: noiseSource2,
    y: noiseSource2,
    z: noiseSource2,
  },
  /*
  amount: new THREE.Vector3( 
    random( -0.3, 0.3 ),
    random( -0.3, 0.3 ),
    random( -0.3, 0.3 ),
  ).multiplyScalar( 10.0 ),
  */
  amount: [
    textureSource,
    textureSource,
    textureSource,
    // 0.3,
    // 0.5,
  ],
  iterations: Math.floor( random( 2, 4 ) )
};

const warpedSource : WarpedSource = {
  kind: 'warped',
  source: noiseSource1,
  warp,
};

const colorSettings : ColorSettings = {
  mode: 'hsv',
  componentModifications: {
    x: [],
    y: [ 
      { kind: 'mult', argument: 0.5 },
      { kind: 'add', argument: 0.1 },
    ],
    z: [ 
      { kind: 'mult', argument: 1.0 },
      { kind: 'add', argument: 0.2 },
      { kind: 'pow', argument: 0.8 },
    ],
  }
};

const randomColor = ( brightness : number ) => {
  return new THREE.Color().setHSL( Math.random(), random( 0.1, 0.2 ), brightness );
};

const fog : Fog = {
  near: 400,
  far: 1500,
  nearColor: randomColor( random( 0.2, 0.8 ) ),
  farColor: randomColor( random( 0.1, 0.4 ) ),
  pow: 0.8,
  opacity: random( 0.4, 0.8 ),
};

export default ( mainTextureName : string ) => { 
  return {
    domain: 'uv',
    scale: 1.0,
    mainSource: warpedSource,
    // getTextureSource( mainTextureName ),
    // domainWarp: warp,
    mask: textureSource,
    // fog,
    timeOffset: new THREE.Vector3( 0.00, -0.00, 0.05, ),
    // colorSettings
  } as PatternShaderSettings; 
};