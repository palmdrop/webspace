import * as THREE from 'three';
import { Function, GLSL, GlslType, Uniforms } from "../../core";
import { AXES, opToGLSL, numToGLSL } from "../utils";
import { CombinedSource, Domain, DomainWarp, FunctionCache, FunctionWithName, Modification, NoiseSource, Source, TextureSource, TrigSource, WarpedSource } from "./types";

export const getFunctionName = ( () => {
  let counter = 0;
  return ( name : string ) => {
    const functionName = name + counter;
    counter++;
    return functionName;
  }
} )();

export const nameFunction = ( func : Function, functionCache : Map<any, FunctionWithName> ) : FunctionWithName => {
  if ( functionCache.has( func ) ) return functionCache.get( func ) as FunctionWithName;

  const name = getFunctionName( 'function' );

  const data = { name, func };
  functionCache.set( func, data );

  return data;
}

export const buildModification = ( input : GLSL, modifications : Modification | Modification[] ) => {
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

export const buildSource = ( 
  source : Source, 
  uniforms : Uniforms, 
  textureNames : Set<string>, 
  functionCache : FunctionCache, 
  isMain = false 
) : FunctionWithName => {
  if( !uniforms ) throw new Error( 'Uniforms cannot be null' );
  if( functionCache.has( source ) ) return functionCache.get( source ) as FunctionWithName;

  const name = getFunctionName( 'source' );

  let func : Function;
  const kind = source.kind;
  switch( kind ) {
    case 'noise' : func = buildNoiseSource( source as NoiseSource ); break;
    case 'trig' : func = buildTrigSource( source as TrigSource ); break;
    case 'combined' : func = buildCombinedSource( source as CombinedSource, uniforms, textureNames, functionCache, isMain ); break;
    case 'warped' : func = buildWarpedSource( source as WarpedSource, uniforms, textureNames, functionCache, isMain ); break;
    case 'texture' : func = buildTextureSource( source as TextureSource, !isMain, uniforms, textureNames, functionCache ); break;
    default : throw new Error( `Source kind ${ kind } is not supported` );
  }

  const data = { name, func };
  functionCache.set( source, data );

  return data;
}

export const buildNoiseSource = ( noise : NoiseSource ) : Function => {
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

export const buildTrigSource = ( trig : TrigSource ) : Function => {
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
      return pow( ${ opToGLSL( combinationOperation, 'x', 'y', 'z' ) }, ${ numToGLSL( pow ) } );
    `
  }
}

export const buildCombinedSource = (
  source : CombinedSource, 
  uniforms : Uniforms, 
  textureNames : Set<string>, 
  functionCache : FunctionCache, 
  isMain = false 
) : Function => {
  const getPart = ( name : string, index : number ) => {
    let multiplier;
    if( source.multipliers && source.multipliers.length > index ) {
      multiplier = source.multipliers[ index ];
    } else {
      multiplier = 1.0;
    }

    return `${ numToGLSL( multiplier ) } * ${ name }( point )`;
  }

  const subSources : FunctionWithName[] = source.sources.map(subSource => buildSource( subSource, uniforms, textureNames, functionCache, isMain ) );

  let combinedGLSL = opToGLSL( source.operation, ...subSources.map( ( { name }, index ) => getPart( name, index ) ) );
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

export const buildWarpedSource = ( 
  source : WarpedSource, 
  uniforms : Uniforms, 
  textureNames : Set<string>, 
  functionCache : FunctionCache, 
  isMain = false 
) : Function => {
  const { name : sourceFunctionName } = buildSource( source.source, uniforms, textureNames, functionCache, isMain );
  const { name : warpFunctioName } = buildWarpFunction( source.warp, uniforms, textureNames, functionCache );

  return {
    parameters : [ [ 'vec3', 'point' ] ],
    returnType : 'float',
    body : `
      return ${ sourceFunctionName }( ${ warpFunctioName }( point ) );
    `
  }
}

export const buildWarpFunction = ( 
  warp : DomainWarp, 
  uniforms : Uniforms, 
  textureNames : Set<string>,
  functionCache : FunctionCache 
) : FunctionWithName => {
  if( functionCache.has( warp ) ) return functionCache.get( warp ) as FunctionWithName;

  const helperNames : string[] = [];

  const amount = warp.amount ?? new THREE.Vector3( 1.0, 1.0, 1.0 );
  const iterations = Math.floor( warp.iterations ?? 1 );

  AXES.forEach( axis => {
    const { name } = buildSource( warp.sources[ axis ], uniforms, textureNames, functionCache );
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
  functionCache.set( warp, data );

  return data;
}

const buildTextureSource = ( 
  source : TextureSource, 
  convertToFloat : boolean, 
  uniforms : Uniforms,
  textureNames : Set<string>, 
  functionCache : FunctionCache,
) : Function & { isTexture : boolean } => {
  if( !uniforms ) throw new Error( 'Uniforms object cannot be undefined' );
  if( textureNames.has( source.name ) ) throw new Error( `A texture with the name "${ source.name }" already exists. }` );

  let sampleGLSL;
  if( convertToFloat ) {
    const { name : converterFuncName } = nameFunction( source.toFloat ?? defaultTextureToFloatFunction, functionCache );
    sampleGLSL = `
      vec4 textureSample = texture2D( ${ source.name }, point.xy );
      float result = ${ converterFuncName }( textureSample );
    `;
  } else {
    sampleGLSL = `vec4 result = texture2D( ${ source.name }, point.xy );`;
  }

  textureNames.add( source.name );
  uniforms[ source.name ] = {
    type : 'sampler2D',
    value : source.texture
  };

  return {
    isTexture : true,
    parameters : [ [ 'vec3', 'point' ] ],
    returnType : convertToFloat ? 'float' : 'vec4',
    body : `
      ${ sampleGLSL }
      return result;
    `
  }
}

export const defaultTextureToFloatFunction : Function = {
  parameters : [ [ 'vec4', 'color' ] ],
  returnType : 'float',
  body : `
    return ( color.r * 0.3 + color.g * 0.6 + color.b * 0.1 ) * color.a;
  `
};

// Adapted from https://gist.github.com/983/e170a24ae8eba2cd174f
export const rgbToHsvFunction : Function = {
  parameters : [ [ 'vec3', 'c' ] ],
  returnType : 'vec3',
  body : `
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  `
}

// Adapted from https://gist.github.com/983/e170a24ae8eba2cd174f
export const hsvToRgbFunction : Function = {
  parameters : [ [ 'vec3', 'c' ] ],
  returnType : 'vec3',
  body : `
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  `
}

//
const domainToAttributeConverter : { [ domain in Domain ] : { name : string, type : GlslType } } = {
  'uv' : { name : 'vUv', type : 'vec2' },
  'view' : { name : 'vViewPosition', type : 'vec3' },
  'vertex' : { name : 'vVertexPosition', type : 'vec3' },
}

export const domainToAttribute = ( domain : Domain ) => {
  return domainToAttributeConverter[ domain ];
}