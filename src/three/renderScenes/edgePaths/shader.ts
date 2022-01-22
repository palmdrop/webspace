import * as THREE from 'three';
import { random } from '../../../utils/random';
import { ColorSettings, DomainWarp, PatternShaderSettings, Source, WarpedSource } from '../../shader/builder/pattern/types';

export default () => {
  const createTextureSource = ( name : string, value : THREE.Texture | null = null ) : Source => { return {
    kind: 'texture',
    name: name,
    texture: value, 
    toFloat: {
      parameters: [ [ 'vec4', 'color' ] ],
      returnType: 'float',
      body: `
        return ( color.r * 0.3 + color.g * 0.6 + color.b * 0.1 ) * color.a;
      `
    }
  };};

  const textureSource = createTextureSource( 'tDiffuse' );

  const noiseModifierSource : Source = {
    kind: 'noise',
    frequency: new THREE.Vector3(
      random( 1.1, 2.0 ),
      random( 1.1, 2.0 ),
      random( 1.1, 2.0 ),
    ),
    amplitude: 1.0,
    pow: 1.0,
    octaves: Math.floor( random( 3, 5 ) ),
    persistance: 0.4,
    lacunarity: 2.2,
    ridge: random( 0.5, 1.0 )
  };


  const noiseSource1 : Source = {
    kind: 'noise',
    frequency: new THREE.Vector3( 1.0, 1.0, 1.0 ).multiplyScalar( random( 1.5, 4.0 ) ),
    amplitude: 1.0,
    pow: random( 2.0, 5.0 ),
    octaves: Math.floor( random( 4, 6 ) ),
    persistance: { 
      kind: 'combined',
      sources: [
        textureSource,
        {
          kind: 'constant',
          value: 1.0
        },
        noiseModifierSource,
      ],
      operation: 'add',
      multipliers: [
        0.4,
        0.17,
        0.23,
      ],
    },
    lacunarity: random( 1.5, 2.6 ),
    ridge: random( 0.3, 0.8 ),
    normalize: false,
  };

  const warp : DomainWarp = {
    sources: {
      x: noiseSource1,
      y: noiseSource1,
      z: noiseSource1,
    },
    amount: [
      // 0.001,
      // 0.001,
      random( 0.005, 0.0001 ),
      random( 0.005, 0.0001 ),
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
          // 0.71,
          random( 0.6, 0.8 ),
          // 0.08
          random( 0.05, 0.13 )
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
      0.6,
      // 0.01
      0.4,
    ],
  };

  const warpedSource : WarpedSource = {
    kind: 'warped',
    source: noiseSource1,
    warp,
  };

  const colorSettings : ColorSettings = {
    mode: 'hsv',
    componentModifications: {
      x: [ 
        { kind: 'mult', argument: 0.3 },
        { kind: 'add', argument: random( -1.0, 1.0 ) }
      ],
      y: [ 
        { kind: 'mult', argument: 0.5 },
        { kind: 'add', argument: 0.1 },
      ],
      z: [ 
        /*
        { kind: 'mult', argument: 1.5 },
        { kind: 'add', argument: 0.2 },
        { kind: 'pow', argument: 2.0 },
        */
        { kind: 'mult', argument: -1 },
        { kind: 'add', argument: 1 },
        { kind: 'mult', argument: 1.4 },
        { kind: 'pow', argument: 2 },
      ],
    }
  };

  return {
    domain: 'uv',
    scale: 1.0,
    mainSource: warpedSource,
    mask,
    timeOffset: new THREE.Vector3( 0.00, -0.00, 0.02, ),
    colorSettings
  } as PatternShaderSettings; 
};