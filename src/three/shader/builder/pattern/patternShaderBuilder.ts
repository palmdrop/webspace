import * as THREE from 'three';

import { random } from "../../../../utils/random";
import { simplex2dChunk, simplex3dChunk } from "../../chunk/noise";
import { Attributes, GLSL, Shader, Uniforms, Vec2, Vec3, Vec4, Float, Int, Functions, Constants } from "../../core";
import { defaultVertexMain } from "../../vertex/defaultVertexSource";
import { buildShader } from "../shaderBuilder";

export const patternShaderBuilder = ( 
  seed : number = random( 0, Number.MAX_SAFE_INTEGER ) / 2.0 
) : Shader => {

  const imports : ShaderChunk<any>[] = [
    simplex3dChunk
  ];

  const uniforms : Uniforms = {
		'opacity' : { 
      value : 0.3, 
      type : 'float' 
    },
    'viewport' : {
      value : new THREE.Vector2( 1, 1 ),
      type : 'vec2'
    },
    'time' : {
      value : 0.0,
      type : 'float'
    },
    'speed' : {
      value : 50.0,
      type : 'float'
    },
  }

  const attributes : Attributes = {
    'vUv' : {
      type : 'vec2'
    },
  }

  const fragmentShaderFunctions : Functions = {
    'domainWarp': {
      arguments : [ 
        [ 'vec2',  'point' ], 
        [ 'float', 'amount'], 
        [ 'float', 'frequency'], 
      ],
      returnValue : 'vec2',
      body: `
        float xOffset = simplex3d( vec3( point * frequency, 0.0 ) ) * amount;
        float yOffset = simplex3d( vec3( point * frequency, 18.4 ) ) * amount;
        return point + vec2( xOffset, yOffset );
      `
    }
  };

  const fragmentConstants : Constants = {
    'frequency' : {
      type : 'float',
      value : 0.01,
    }
  };

	const fragmentShaderMain : GLSL = `
    vec2 p = vUv * viewport;
    p = domainWarp( p, 100.0, frequency );
    vec3 samplePoint = vec3( p, speed * time );

    float n = simplex3d( samplePoint * frequency );
    gl_FragColor = vec4( n, opacity, 0.3, 1.0 );
  `;

  return buildShader(
    attributes,
    uniforms,
    {
      imports,
      constants : undefined,
      functions : undefined,
      main : defaultVertexMain,
    },
    {
      imports,
      constants : fragmentConstants,
      functions : fragmentShaderFunctions,
      main : fragmentShaderMain,
    }
  );
};