import * as THREE from 'three';
import { random } from '../../../utils/random';
import { ColorSettings, DomainWarp, PatternShaderSettings, Source } from '../../shader/builder/pattern/types';

export default () => {
  const textureSource = {
    kind: 'texture',
    name: 'tDiffuse',
    texture: null, 
    toFloat: {
      parameters: [ [ 'vec4', 'color' ] ],
      returnType: 'float',
      body: `
        float bri = ( color.r * 0.3 + color.g * 0.6 + color.b * 0.1 ) * color.a;
        float dampingThreshold = 0.5;
        float dampingAmount = 4.0;

        return 1.0 * bri;
        /*
        return (
          bri < dampingThreshold
          ? bri
          : dampingThreshold + pow( bri - dampingThreshold, 3.0 )
        );
        */
        // return 0.0;
      `
    }
  } as Source;

  const noiseSource1 : Source = {
    kind: 'noise',
    frequency: new THREE.Vector3( 1.0, 1.0, 1.0 )
      .multiplyScalar( random( 0.5, 2.0 ) ),
    amplitude: 1.0,
    pow: 4.5,
    octaves: 5.0,
    persistance: 0.5,
    lacunarity: 2.5,
    ridge: 0.3,
    // random( 0.3, 0.6 ),
    normalize: false,
  };

  const remappedNoise = {
    kind: 'combined',
    sources: [
      noiseSource1,
      {
        kind: 'constant',
        value: 1.0,
      }
    ],
    operation: 'add',
    multipliers: [
      1.0,
      -0.5
    ]
  };

  const warp = {
    kind: 'warp',
    sources: {
      x: remappedNoise,
      y: remappedNoise,
      z: textureSource,
    },
    amount: [
      random( -0.01, 0.01 ),
      random( -0.01, 0.01 ),
      1.9,
    ],
    iterations: 1
  } as DomainWarp;

  const colorSettings : ColorSettings = {
    mode: 'hsv',
    componentModifications: {
      x: [ 
        { kind: 'mult', argument: noiseSource1 },
        { kind: 'mult', argument: 0.3 },
        { kind: 'add', argument: random( -1.0, 1.0 ) }
      ],
      y: [ 
        { kind: 'mult', argument: 0.2 },
        { kind: 'add', argument: 0.1 },
        { kind: 'pow', argument: textureSource },
      ],
      z: [ 
        { kind: 'mult', argument: -1 },
        { kind: 'add', argument: 1 },
        { kind: 'mult', argument: 1.1 },
        { kind: 'pow', argument: 1.5 },
        { kind: 'pow', argument: {
          kind: 'combined',
          sources: [ textureSource, { kind: 'constant', value: 1.0 } ],
          operation: 'add',
          multipliers: [ -1.0, 1.2 ]
        } }
      ],
    }
  };

  return {
    domain: 'uv',
    scale: 1.0,
    mainSource: noiseSource1,
    domainWarp: warp,
    timeOffset: new THREE.Vector3( 0.0, -0.0, random( 0.7, 1.1 ) ),
    colorSettings
  } as PatternShaderSettings; 
};