import * as THREE from 'three';

import { simplex3dChunk } from "../../chunk/noise";
import { Attributes, GLSL, Shader, Uniforms, Functions, Function, Constants, ShaderChunk, AXES } from "../../core";
import { buildShader } from "../shaderBuilder";
import { binOpToGLSL, numToGLSL } from '../utils';
import { CombinedSource, DomainWarp, FunctionWithName, Modification, NoiseSource, PatternShaderSettings, Source, TrigSource, WarpedSource } from './types';

const getFunctionName = (() => {
  let counter = 0;
  return ( name : string ) => {
    const functionName = name + counter;
    counter++;
    return functionName;
  }
})();

const buildModification = ( input : GLSL, modifications : Modification | Modification[] ) => {
  if( !Array.isArray( modifications ) ) {
    modifications = [ modifications ];
  }

  const applySingleModification = ( input : GLSL, kind : string, argument : number ) => {
    switch( kind ) {
      case 'add'  : return `${ numToGLSL( argument ) } + ${ input }`
      case 'mult' : return `${ numToGLSL( argument ) } * ${ input }`
      case 'pow'  : return `pow( ${ input }, ${ numToGLSL( argument ) } )`
      case 'mod'  : return `mod( ${ input }, ${ numToGLSL( argument ) } )`
    }
  }

  let result = '' + input;
  modifications.forEach( ( { kind, argument } ) => {
    result = `( ${ applySingleModification( result, kind, argument ) } )`
  });

  return result;
}

const buildNoiseSource = ( noise : NoiseSource ) : Function => {
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

const buildTrigSource = ( trig : TrigSource ) : Function => {
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

export const buildPatternShader = ( settings : PatternShaderSettings ) : Shader => {

  // Cache
  const cache = new Map<any, FunctionWithName>();

  // Helper functions
  const buildSource = ( source : Source ) : FunctionWithName => {
    if( cache.has( source ) ) return cache.get( source ) as FunctionWithName;

    const name = getFunctionName( 'source' );

    let func : Function;
    const kind = source.kind;
    switch( kind ) {
      case 'noise' : func = buildNoiseSource( source as NoiseSource ); break;
      case 'trig' : func = buildTrigSource( source as TrigSource ); break;
      case 'combined' : func = buildCombinedSource( source as CombinedSource ); break;
      case 'warped' : func = buildWarpedSource( source as WarpedSource ); break;
      default : throw new Error( `Source kind ${ kind } is not supported` );
    }

    const data = { name, func };
    cache.set( source, data );

    return data;
  }

  const buildCombinedSource = ( source : CombinedSource ) : Function => {
    const getPart = ( name : string, index : number ) => {
      let multiplier;
      if( source.multipliers && source.multipliers.length > index ) {
        multiplier = source.multipliers[ index ];
      } else {
        multiplier = 1.0;
      }

      return `${ numToGLSL( multiplier ) } * ${ name }( point )`;
    }

    const subSources : FunctionWithName[] = source.sources.map(subSource => buildSource( subSource ) );

    let combinedGLSL = binOpToGLSL( source.operation, ...subSources.map( ( { name }, index ) => getPart( name, index ) ) );
    if( source.postModifications ) {
      combinedGLSL = buildModification( `( ${ combinedGLSL } )`, source.postModifications );
    }

    return {
      parameters : [ [ 'vec3', 'point' ] ],
      returnType : 'float',
      body : `
        return ${ combinedGLSL };
      `
    }
  }

  const buildWarpedSource = ( source : WarpedSource ) : Function => {
    const { name : sourceFunctionName } = buildSource( source.source );
    const { name : warpFunctioName } = buildWarpFunction( source.warp );

    return {
      parameters : [ [ 'vec3', 'point' ] ],
      returnType : 'float',
      body : `
        return ${ sourceFunctionName }( ${ warpFunctioName }( point ) );
      `
    }
  }


  const buildWarpFunction = ( warp : DomainWarp ) : FunctionWithName => {
    if( cache.has( warp ) ) return cache.get( warp ) as FunctionWithName;

    const helperNames : string[] = [];

    const amount = warp.amount ?? new THREE.Vector3( 1.0, 1.0, 1.0 );
    const iterations = Math.floor( warp.iterations ?? 1 );

    AXES.forEach( axis => {
      const { name } = buildSource( warp.sources[ axis ] );
      helperNames.push( name );
    });

    const func : Function = {
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

    const name = getFunctionName( 'domainWarp' );
    const data = { name, func };
    cache.set( warp, data );

    return data;
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

  // Vertex shader
  const vertexShaderMain : GLSL = `
    vUv = uv;
    ${ settings.domain === 'vertex' ? `vVertexPosition = vec3( modelMatrix * vec4( position, 1.0 ) );` : '' }
    ${ settings.domain === 'view'   ? `vViewPosition = vec3( modelViewMatrix * vec4( position, 1.0 ) );` : '' }
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  `;

  // Fragment shader
  const { name : mainSourceName } = buildSource( settings.mainSource );

  let warpGLSL = '';
  if( settings.domainWarp ) {
    const { name } = buildWarpFunction( settings.domainWarp );
    warpGLSL = `samplePoint = ${ name }( ${ settings.domainWarp.inputVariable } );`;
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
    gl_FragColor = vec4( n, n, n, 1.0 );
  `;

  // Functions
  const fragmentShaderFunctions : Functions = {};
  cache.forEach( ( { name, func } ) => fragmentShaderFunctions[ name ] = func );

  // Build
  return buildShader(
    attributes,
    uniforms,
    {
      imports,
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