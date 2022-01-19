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
      return 2.5 * ( ( color.r * 0.3 + color.g * 0.6 + color.b * 0.1 ) * color.a + 0.0);
      // return 1.0;
    `
  }
};

export const noiseSource1 : Source = {
  kind: 'noise',
  frequency: new THREE.Vector3( 1.0, 1.0, 1.0 ).multiplyScalar( random( 1.5, 4.0 ) ),
  amplitude: 1.0,
  pow: random( 3.0, 10.0 ),
  octaves: Math.floor( random( 5, 7 ) ),
  persistance: 0.5,
  lacunarity: 2.1,
  ridge: random( 0.3, 0.5 ),
  normalize: false,
};

export const noiseSource2 : Source = {
  kind: 'noise',
  frequency: new THREE.Vector3(
    random( 1.1, 2.0 ),
    random( 1.1, 2.0 ),
    random( 1.1, 2.0 ),
  ),
  amplitude: 1.0,
  pow: 1.0,
  octaves: Math.floor( random( 3, 5 ) ),
  persistance: 0.2,
  lacunarity: 4.2,
  ridge: random( 0.8, 0.8 )
};

const warp : DomainWarp = {
  sources: {
    x: noiseSource2,
    y: noiseSource2,
    z: noiseSource1,
  },
  amount: [
    0.001,
    0.001,
    {
      kind: 'combined',
      sources: [
        textureSource,
        {
          kind: 'constant',
          value: 1.0
        }
      ],
      operation: 'add',
      multipliers: [
        0.11,
        0.02
      ],
    }
  ],
  iterations: Math.floor( random( 2, 4 ) )
};

const mask = {
  kind: 'combined',
  sources: [
    textureSource,
    {
      kind: 'constant',
      value: 1.0
    }
  ],
  operation: 'add',
  multipliers: [
    1.4,
    0.0
  ],
};

const warpedSource : WarpedSource = {
  kind: 'warped',
  source: noiseSource1,
  warp,
};

const colorSettings = () : ColorSettings => { return {
  mode: 'hsv',
  componentModifications: {
    x: [ 
      { kind: 'mult', argument: random( 0.3, 0.7 ) },
      { kind: 'add', argument: random( 0.0, 1.0 ) },
      // { kind: 'add', argument: random( 0.0, 1.0 ) }
    ],
    y: [ 
      { kind: 'add', argument: 0.5 },
      { kind: 'mult', argument: -0.5 },
      // { kind: 'add', argument: 0.1 },
      { kind: 'pow', argument: 1.0 },
    ],
    z: [ 
      // { kind: 'mult', argument: 1.5 },
      // { kind: 'add', argument: 0.0 },
      { kind: 'pow', argument: 0.5 },
    ],
  }
}; };

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
    mask: mask,
    // fog,
    timeOffset: new THREE.Vector3( 0.00, -0.00, 0.02, ),
    colorSettings: colorSettings()
  } as PatternShaderSettings; 
};