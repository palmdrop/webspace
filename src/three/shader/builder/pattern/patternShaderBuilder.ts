import * as THREE from 'three';

import { simplex3dChunk } from "../../chunk/noise";
import { Attributes, GLSL, Shader, Uniforms, Functions, Function, Constants, ShaderChunk, AXES } from "../../core";
import { buildShader } from "../shaderBuilder";
import { binOpToGLSL, numToGLSL } from '../utils';
import { DomainWarp, NoiseSource, PatternShaderSettings, Source, TrigSource } from './types';

const mainSourceName = 'mainSource';

const getFunctionName = (() => {
  let counter = 0;
  return ( name : string ) => {
    const functionName = name + counter;
    counter++;
    return functionName;
  }
})();

const createNoise = ( noise : NoiseSource ) : Function => {
  const frequency = noise.frequency;
  const amplitude = noise.amplitude ?? 1.0;
  const pow = noise.pow ?? 1.0;
  const octaves = noise.octaves ?? 1.0;
  const persistance = noise.persistance ?? 0.49;
  const lacunarity = noise.lacunarity ?? 1.97;

  const ridge = noise.ridge ?? 1.0;

  return {
    parameters : [ [ 'vec3', 'point' ] ],
    returnType : 'float',
    body : `
      float n = 0.0;
      vec3 f = vec3( ${ frequency.x }, ${ frequency.y }, ${ frequency.z } );
      float a = ${ numToGLSL( amplitude ) };
      float divider = 0.0;
      for( int i = 0; i < ${ octaves }; i++ ) {
        vec3 p = point * f;
        float on = pow( simplex3d( p ), ${ numToGLSL( pow ) });

        ${ ridge < 1.0 ? `
          float rt = ${ numToGLSL( ridge ) };
          if( on > rt ) on = rt - ( on - rt );
          on /= rt;
        ` : '' }

        n += a * on;

        divider += a;

        a *= ${ numToGLSL( persistance ) };
        f *= ${ numToGLSL( lacunarity ) };
      }

      return ${ numToGLSL( amplitude ) } * n / divider;
    `
  };
}

const createTrig = ( trig : TrigSource ) : Function => {
  const types = trig.types;
  const frequency = trig.frequency ?? new THREE.Vector3( 0.0 );
  const amplitude = trig.amplitude ?? new THREE.Vector3( 1.0, 1.0, 1.0 );
  const combinationOperation = trig.combinationOperation ?? 'mult';
  const pow = trig.pow ?? 1.0;

  return {
    parameters : [ [ 'vec3', 'point' ] ],
    returnType : 'float',
    body : `
      float x = ${ numToGLSL( amplitude.x ) } * ${ types.x }( point.x * ${ numToGLSL( frequency.x ) } );
      float y = ${ numToGLSL( amplitude.y ) } * ${ types.y }( point.y * ${ numToGLSL( frequency.y ) } );
      float z = ${ numToGLSL( amplitude.z ) } * ${ types.z }( point.z * ${ numToGLSL( frequency.z ) } );
      return pow( ${ binOpToGLSL( combinationOperation, 'x', 'y', 'z' ) }, ${ numToGLSL( pow ) } );
    `
  }
}

// TODO add support for composite source! source made up of multiple sources, warped, combined, multed etc

export const buildPatternShader = ( 
  settings : PatternShaderSettings,
) : Shader => {
  // Cache
  const cache = new Map<Source, Function>();

  // Helper functions
  const createSource = ( source : Source ) : Function => {
    switch( source.kind ) {
      case 'noise' : return createNoise( source as NoiseSource );
      default : return createTrig( source as TrigSource );
    }
  }

  const createWarp = ( warp : DomainWarp ) => {
    const functions : Functions = {};
    const helperNames : string[] = [];

    const amount = warp.amount ?? new THREE.Vector3( 1.0, 1.0, 1.0 );
    const iterations = Math.floor( warp.iterations ?? 1 );

    AXES.forEach( axis => {
      const name = getFunctionName( `${ axis }Offset` );
      helperNames.push( name );
      if( !cache.has( warp.sources[ axis ] ) ) {
        functions[ name ] = createSource( warp.sources[ axis ] );
      }
    });

    const warpFunction : Function = {
      parameters : [ [ 'vec3', 'point' ] ],
      returnType : 'vec3',
      body : `
        vec3 previous = vec3( point );
        for( int i = 0; i < ${ iterations }; i++ ) {
          point.x = point.x + ${ helperNames[ 0 ] }( previous ) * ${ numToGLSL( amount.x ) };
          point.y = point.y + ${ helperNames[ 1 ] }( previous ) * ${ numToGLSL( amount.y ) };
          point.z = point.z + ${ helperNames[ 2 ] }( previous ) * ${ numToGLSL( amount.z ) };
          previous = vec3( point );
        }
        return point;
      `
    };

    const warpName = getFunctionName( 'domainWarp' );
    functions[ warpName ] = warpFunction;

    return {
      warpName,
      functions,
      inputVariable : warp.inputVariable
    }
  }

  // Settings
  const timeOffset = settings.timeOffset ?? new THREE.Vector3( 0.0 );

  /* GLSL Construction */

  // Imports
  const imports : ShaderChunk[] = [
    simplex3dChunk
  ];

  // Uniforms
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
  }

  // Attributes
  const attributes : Attributes = {
    'vUv' : {
      type : 'vec2'
    }
  }

  if( settings.domain === 'vertex' ) attributes[ 'vVertexPosition' ] = { type : 'vec3' };
  else if( settings.domain === 'view' ) attributes[ 'vViewPosition' ] = { type : 'vec3' };

  // Constants
  const fragmentConstants : Constants = {
    'frequency' : {
      type : 'float',
      value : 0.01,
    },
    'timeOffset' : {
      type : 'vec3',
      value : timeOffset
    }
  };

  // Functions
  const fragmentShaderFunctions : Functions = {
  };

  fragmentShaderFunctions[ mainSourceName ] = createSource( settings.mainSource );

  // Vertex shader
  const vertexShaderMain : GLSL = `
    vUv = uv;
    ${ settings.domain === 'vertex' ? `vVertexPosition = vec3( modelMatrix * vec4( position, 1.0 ) );` : '' }
    ${ settings.domain === 'view'   ? `vViewPosition = vec3( modelViewMatrix * vec4( position, 1.0 ) );` : '' }
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  `;

  // Fragment shader
  let warpGLSL = '';
  if( settings.domainWarp ) {
    const warpData = createWarp( settings.domainWarp );
    Object.assign( fragmentShaderFunctions, warpData.functions );

    warpGLSL = `
      samplePoint = ${ warpData.warpName }( ${ warpData.inputVariable } );
    `;
  }

	const fragmentShaderMain : GLSL = `
    ${ settings.domain === 'uv' ? 
      `vec3 origin = vec3( vUv * viewport, 0.0 );` : 
       settings.domain === 'view' ?
      `vec3 origin = vec3( vViewPosition );` :
      `vec3 origin = vec3( vVertexPosition );`
    }

    origin *= ${ numToGLSL( settings.scale ?? 1.0 ) };

    origin += timeOffset * time;

    vec3 samplePoint = origin;

    ${ warpGLSL }

    float n = ${ mainSourceName }( samplePoint * frequency );
    // gl_FragColor = vec4( n, opacity, 0.3, 1.0 );
    gl_FragColor = vec4( n, n, n, 1.0 );
  `;

  // Build
  return buildShader(
    attributes,
    uniforms,
    {
      imports,
      constants : undefined,
      functions : undefined,
      main : vertexShaderMain,
    },
    {
      imports,
      constants : fragmentConstants,
      functions : fragmentShaderFunctions,
      main : fragmentShaderMain,
    }
  );
};