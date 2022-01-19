import * as THREE from 'three';
import { GlslFunction, GLSL, GlslType, Uniforms } from '../../core';
import { AXES, opToGLSL, numToGLSL, variableValueToGLSL } from '../utils';
import { CombinedSource, Domain, DomainWarp, FunctionCache, FunctionWithName, Modification, NoiseSource, Source, TextureSource, TrigSource, WarpedSource, CustomSource, Fog, SoftParticleSettings, Amount, TexelToFloatFunction, ConstantSource } from './types';

export const getFunctionName = ( () => {
  let counter = 0;
  return ( name : string ) => {
    const functionName = name + counter;
    counter++;
    return functionName;
  };
} )();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nameFunction = ( func : GlslFunction, functionCache : Map<any, FunctionWithName> ) : FunctionWithName => {
  if ( functionCache.has( func ) ) return functionCache.get( func ) as FunctionWithName;

  const name = getFunctionName( 'function' );

  const data = { name, func };
  functionCache.set( func, data );

  return data;
};

export const buildModification = ( input : GLSL, modifications : Modification | Modification[] ) => {
  if( !Array.isArray( modifications ) ) {
    modifications = [ modifications ];
  }

  const applySingleModification = ( input : GLSL, kind : string, argument : number ) => {
    switch( kind ) {
    case 'add' : return `${ numToGLSL( argument ) } + ${ input }`;
    case 'mult' : return `${ numToGLSL( argument ) } * ${ input }`;
    case 'pow' : return `pow( ${ input }, ${ numToGLSL( argument ) } )`;
    case 'mod' : return `mod( ${ input }, ${ numToGLSL( argument ) } )`;
    }
  };

  let result = '' + input;
  modifications.forEach( ( { kind, argument } ) => {
    result = `( ${ applySingleModification( result, kind, argument ) } )`;
  } );

  return result;
};

// amount
export const buildAmount = (
  amount : Amount,
  uniforms : Uniforms,
  textureNames : Set<string>,
  functionCache : FunctionCache
) => {
  if( typeof amount === 'number' ) {
    return numToGLSL( amount );
  } 

  const functionWithName = buildSource( 
    amount,
    uniforms,
    textureNames,
    functionCache
  );

  return functionWithName.name + '( point )'; 
};

export const buildSource = ( 
  source : Source, 
  uniforms : Uniforms, 
  textureNames : Set<string>, 
  functionCache : FunctionCache, 
  isMain = false,
) : FunctionWithName => {
  if( !uniforms ) throw new Error( 'Uniforms cannot be null' );
  if( functionCache.has( source ) ) return functionCache.get( source ) as FunctionWithName;

  const name = getFunctionName( 'source' );

  let func : GlslFunction;
  const kind = source.kind;
  switch( kind ) {
  case 'constant' : func = buildConstantSource( source as ConstantSource ); break;
  case 'noise' : func = buildNoiseSource( source as NoiseSource, uniforms, textureNames, functionCache ); break;
  case 'trig' : func = buildTrigSource( source as TrigSource ); break;
  case 'combined' : func = buildCombinedSource( source as CombinedSource, uniforms, textureNames, functionCache, isMain ); break;
  case 'warped' : func = buildWarpedSource( source as WarpedSource, uniforms, textureNames, functionCache, isMain ); break;
  case 'texture' : func = buildTextureSource( source as TextureSource, !isMain, uniforms, textureNames, functionCache ); break;
  case 'custom' : func = buildCustomSource( source as CustomSource ); break;
  default : throw new Error( `Source kind ${ kind } is not supported` );
  }

  if( source.uvOverride ) {
    func.body = `
      point = vec3( vUv, 0 );
      ${ func.body }
    `;
  }

  const data = { name, func };
  functionCache.set( source, data );

  return data;
};

export const buildConstantSource = (
  source : ConstantSource,
) : GlslFunction => {
  return {
    parameters: [ [ 'vec3', 'point' ] ],
    returnType: 'float',
    body: `
      return ${ numToGLSL( source.value ) };
    `
  };
};

export const buildNoiseSource = ( 
  noise : NoiseSource,
  uniforms : Uniforms, 
  textureNames : Set<string>, 
  functionCache : FunctionCache, 
) : GlslFunction => {
  const frequency = noise.frequency;
  const amplitude = noise.amplitude ?? 1.0;
  const pow = noise.pow ?? 1.0;
  const octaves = noise.octaves ?? 1.0;
  const persistance = noise.persistance ?? 0.49;
  const lacunarity = noise.lacunarity ?? 1.97;
  const ridge = noise.ridge ?? 1.0;

  const normalize = noise.normalize ?? true;

  // TODO figure out way to only evaluate amount ONCE per call instead of each iteration, could be expensive :(

  return {
    parameters: [ [ 'vec3', 'point' ] ],
    returnType: 'float',
    body: `
      float n = 0.0;
      vec3 f = vec3( ${ frequency.x }, ${ frequency.y }, ${ frequency.z } );
      float a = ${ buildAmount( amplitude, uniforms, textureNames, functionCache ) };

      float divider = 0.0;
      float power = ${ buildAmount( pow, uniforms, textureNames, functionCache ) };
      float ridge = ${ buildAmount( ridge, uniforms, textureNames, functionCache ) };
      float persistance = ${ buildAmount( persistance, uniforms, textureNames, functionCache ) };
      float lacunarity = ${ buildAmount( lacunarity, uniforms, textureNames, functionCache ) };
      float amplitude = a;

      for( int i = 0; i < ${ Math.floor( octaves ) }; i++ ) {
        vec3 p = point * f;
        float on = pow( simplex3d( p ), power );

        ${ ridge < 1.0 ? `
          if( on > ridge ) on = ridge - ( on - ridge );
          on /= ridge;
        ` : '' }

        n += a * on;

        divider += a;

        a *= persistance;
        f *= lacunarity;
      }

      n = sanitize( n );
      ${ normalize ? 'n /= divider;' : '' }

      return amplitude * n;
    `
  };
};

export const buildTrigSource = ( trig : TrigSource ) : GlslFunction => {
  const types = trig.types;
  const frequency = trig.frequency ?? new THREE.Vector3( 0.0 );
  const amplitude = trig.amplitude ?? new THREE.Vector3( 1.0, 1.0, 1.0 );
  const combinationOperation = trig.combinationOperation ?? 'mult';
  const pow = trig.pow ?? 1.0;

  const normalize = trig.normalize ?? false;

  const normalizeValue = ( variable : string ) => {
    return `${ variable } = (${ variable } + 1.0 ) / 2.0;`;
  };

  return {
    parameters: [ [ 'vec3', 'point' ] ],
    returnType: 'float',
    body: `
      float x = ${ numToGLSL( amplitude.x ) } * ${ types.x }( point.x * ${ numToGLSL( frequency.x ) } );
      float y = ${ numToGLSL( amplitude.y ) } * ${ types.y }( point.y * ${ numToGLSL( frequency.y ) } );
      float z = ${ numToGLSL( amplitude.z ) } * ${ types.z }( point.z * ${ numToGLSL( frequency.z ) } );

      ${ normalize ? `
        ${ normalizeValue( 'x' ) } 
        ${ normalizeValue( 'y' ) } 
        ${ normalizeValue( 'z' ) } 
      ` : '' }

      float v = pow( ${ opToGLSL( combinationOperation, 'x', 'y', 'z' ) }, ${ numToGLSL( pow ) } );

      return v;
    `
  };
};

export const buildCombinedSource = (
  source : CombinedSource, 
  uniforms : Uniforms, 
  textureNames : Set<string>, 
  functionCache : FunctionCache, 
  isMain = false 
) : GlslFunction => {
  const getPart = ( name : string, index : number ) => {
    let multiplier;
    if( source.multipliers && source.multipliers.length > index ) {
      multiplier = source.multipliers[ index ];
    } else {
      multiplier = 1.0;
    }

    return `${ numToGLSL( multiplier ) } * ${ name }( point )`;
  };

  const subSources : FunctionWithName[] = source.sources.map( subSource => buildSource( subSource, uniforms, textureNames, functionCache, isMain ) );

  let combinedGLSL = opToGLSL( source.operation, ...subSources.map( ( { name }, index ) => getPart( name, index ) ) );
  if( source.postModifications ) {
    combinedGLSL = buildModification( `( ${ combinedGLSL } )`, source.postModifications );
  }

  return {
    parameters: [ [ 'vec3', 'point' ] ],
    returnType: 'float',
    body: `
      return ${ combinedGLSL };
    `
  };
};

export const buildWarpedSource = ( 
  source : WarpedSource, 
  uniforms : Uniforms, 
  textureNames : Set<string>, 
  functionCache : FunctionCache, 
  isMain = false 
) : GlslFunction => {
  const { name: sourceFunctionName } = buildSource( source.source, uniforms, textureNames, functionCache, isMain );
  const { name: warpFunctioName } = buildWarpFunction( source.warp, uniforms, textureNames, functionCache );

  return {
    parameters: [ [ 'vec3', 'point' ] ],
    returnType: 'float',
    body: `
      return ${ sourceFunctionName }( ${ warpFunctioName }( point ) );
    `
  };
};

export const buildWarpFunction = ( 
  warp : DomainWarp, 
  uniforms : Uniforms, 
  textureNames : Set<string>,
  functionCache : FunctionCache 
) : FunctionWithName => {
  if( functionCache.has( warp ) ) return functionCache.get( warp ) as FunctionWithName;

  const helperNames : string[] = [];

  const amount = warp.amount ?? 1.0;
  const iterations = Math.floor( warp.iterations ?? 1 );

  AXES.forEach( axis => {
    const { name } = buildSource( warp.sources[ axis ], uniforms, textureNames, functionCache );
    helperNames.push( name );
  } );

  // Build amount multipliers
  let amountMultipliers : GLSL[];

  if ( typeof amount === 'number' ) {
    amountMultipliers = Array( 3 ).fill( buildAmount( amount, uniforms, textureNames, functionCache ) );
  } else if( Array.isArray( amount ) ) {
    amountMultipliers = amount.map( a => buildAmount( a, uniforms, textureNames, functionCache ) );
  } else if( ( amount as Source ).kind ) {
    amountMultipliers = Array( 3 ).fill( buildAmount( amount as Source, uniforms, textureNames, functionCache ) );
  } else {
    const { x, y, z } = amount as THREE.Vector3;
    amountMultipliers = [
      numToGLSL( x ),
      numToGLSL( y ),
      numToGLSL( z )
    ];
  }

  const func : GlslFunction = {
    parameters: [ [ 'vec3', 'point' ] ],
    returnType: 'vec3',
    body: `
      vec3 previous = vec3( point );
      for( int i = 0; i < ${ iterations }; i++ ) {
        point.x = point.x + ${ helperNames[ 0 ] }( previous ) * ${ amountMultipliers[ 0 ] };
        point.y = point.y + ${ helperNames[ 1 ] }( previous ) * ${ amountMultipliers[ 1 ] };
        point.z = point.z + ${ helperNames[ 2 ] }( previous ) * ${ amountMultipliers[ 2 ] };
        previous = vec3( point );
      }
      return point;
    `
  };

  const name = getFunctionName( 'domainWarp' );
  const data = { name, func };
  functionCache.set( warp, data );

  return data;
};

const buildTextureSource = ( 
  source : TextureSource, 
  convertToFloat : boolean, 
  uniforms : Uniforms,
  textureNames : Set<string>, 
  functionCache : FunctionCache,
) : GlslFunction & { isTexture : boolean } => {
  if( !uniforms ) throw new Error( 'Uniforms object cannot be undefined' );
  if( textureNames.has( source.name ) ) throw new Error( `A texture with the name "${ source.name }" already exists. }` );

  let sampleGLSL = `
    vec2 samplePoint = point.xy;
    ${ source.repeat ? `samplePoint *= ${ variableValueToGLSL( { type: 'vec2', value: source.repeat } ) };` : '' }
  `;
  if( convertToFloat ) {
    const { name: converterFuncName } = nameFunction( source.toFloat ?? defaultTextureToFloatFunction, functionCache );
    sampleGLSL = `
      ${ sampleGLSL }
      vec4 textureSample = texture2D( ${ source.name }, samplePoint );
      float result = ${ converterFuncName }( textureSample );
    `;
  } else {
    sampleGLSL = `
      ${ sampleGLSL }
      vec4 result = texture2D( ${ source.name }, samplePoint );
    `;
  }

  textureNames.add( source.name );
  uniforms[ source.name ] = {
    type: 'sampler2D',
    value: source.texture
  };

  return {
    isTexture: true,
    parameters: [ [ 'vec3', 'point' ] ],
    returnType: convertToFloat ? 'float' : 'vec4',
    body: `
      ${ sampleGLSL }
      return result;
    `
  };
};

export const buildCustomSource = ( source : CustomSource ) : GlslFunction => {
  return {
    parameters: [ [ 'vec3', 'point' ] ],
    returnType: 'float',
    body: source.body
  };
};

export const defaultTextureToFloatFunction : TexelToFloatFunction = {
  parameters: [ [ 'vec4', 'color' ] ],
  returnType: 'float',
  body: `
    return ( color.r * 0.3 + color.g * 0.6 + color.b * 0.1 ) * color.a;
  `
};

export const colorToGLSL = ( color : THREE.Color ) => {
  return `vec3( ${ numToGLSL( color.r ) }, ${ numToGLSL( color.g ) }, ${ numToGLSL( color.b ) } )`;
};

export const buildFog = ( fog : Fog, functionCache : FunctionCache ) : FunctionWithName => {
  const nearColorGLSL = colorToGLSL( fog.nearColor );
  const farColorGLSL = colorToGLSL( fog.farColor );
  const func : GlslFunction = {
    parameters: [ [ 'vec3', 'fragColor' ], [ 'float', 'depth' ] ],
    returnType: 'vec3',
    body: `
      ${ fog.opacity === undefined ? `
        if( depth < ${ numToGLSL( fog.near ) } ) return fragColor;
        if( depth > ${ numToGLSL( fog.far ) } ) return ${ farColorGLSL };
      ` : '' }

      float factor = smoothstep( ${ numToGLSL( fog.near ) }, ${ numToGLSL( fog.far ) }, depth );

      ${ fog.pow ? `factor = pow( factor, ${ numToGLSL( fog.pow ) });` : '' }
      vec3 fogColor = mix( ${ nearColorGLSL }, ${ farColorGLSL }, factor );

      ${ fog.opacity ? `factor *= ${ numToGLSL( fog.opacity ) };` : '' }
      return mix( fragColor, fogColor, factor );
      // return fragColor;
    `
  };

  const name = getFunctionName( 'fog' );
  const data = { name, func };

  functionCache.set( fog, data );

  return data;
};

// Effect implemented with the help of this video: https://www.youtube.com/watch?v=arn_3WzCJQ8
export const buildSoftParticleTransform = ( 
  softParticleSettings : SoftParticleSettings, 
  uniforms : Uniforms,
  textureNames : Set<string>,
  functionCache : FunctionCache,
) => {
  if( !uniforms ) throw new Error( 'Uniforms cannot be null' );
  if( functionCache.has( softParticleSettings ) ) return functionCache.get( softParticleSettings ) as FunctionWithName;

  const functionName = getFunctionName( 'softParticle' );
  const textureName = getFunctionName( 'depthTexture' );

  const camera = softParticleSettings.camera;
  const nf = camera.far * camera.near;
  const fSubN = camera.far - camera.near;
  const f = camera.far;

  const pow = softParticleSettings.pow ?? 1.0;
  const falloffRange = softParticleSettings.falloffRange ?? 1.0;
  const smooth = softParticleSettings.smooth ?? true;

  const func : GlslFunction = {
    parameters: [ [ 'vec4', 'fragColor' ], [ 'vec2', 'uv' ] ],
    returnType: 'vec4',
    body: `
      float nf = ${ numToGLSL( nf ) };
      float fSubN = ${ numToGLSL( fSubN ) };
      float f = ${ numToGLSL( f ) };

      float z = texture2D( ${ textureName }, uv).x;
      float screenDepth = nf / ( fSubN * z - f );
      float currentDepth = vViewPosition.z;

      float diff = clamp( ( currentDepth - screenDepth ) / ${ numToGLSL( falloffRange ) }, 0.0, 1.0 );

      ${ smooth ? 'diff = smoothstep( 0.0, 1.0, diff );' : '' }
      ${ pow !== 1.0 ? `diff = pow( diff, ${ numToGLSL( pow ) } );` : '' }

      fragColor.a *= diff;

      return fragColor;
    `
  };

  textureNames.add( textureName );
  uniforms[ textureName ] = {
    type: 'sampler2D',
    value: softParticleSettings.depthTexture
  };

  uniforms[ 'resolution' ] = {
    type: 'vec2',
    value: new THREE.Vector2( 0.0, 0.0 )
  };
  
  const data = { name: functionName, func };
  functionCache.set( softParticleSettings, data );

  return data;
};

// Adapted from https://gist.github.com/983/e170a24ae8eba2cd174f
export const rgbToHsvFunction : GlslFunction = {
  parameters: [ [ 'vec3', 'c' ] ],
  returnType: 'vec3',
  body: `
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  `
};

// Adapted from https://gist.github.com/983/e170a24ae8eba2cd174f
export const hsvToRgbFunction : GlslFunction = {
  parameters: [ [ 'vec3', 'c' ] ],
  returnType: 'vec3',
  body: `
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  `
};

// 
export const isNanFunction : GlslFunction = {
  parameters: [ [ 'float', 'value' ] ],
  returnType: 'bool',
  body: `
    return ( value < 0.0 || 0.0 < value || value == 0.0 ) ? false : true;
  `
};

export const isInfFunction : GlslFunction = {
  parameters: [ [ 'float', 'value' ] ],
  returnType: 'bool',
  body: `
    return (value != 0.0 && value * 2.0 == value) ? true : false;
  `
};

export const sanitizeFunction : GlslFunction = {
  parameters: [ [ 'float', 'value' ] ],
  returnType: 'float',
  body: ` 
    if( isNan( value ) || value < 0.0 ) {
      return 0.0;
    } else if( isInf( value ) || value > 1.0 ) {
      return 1.0;
    }
    return value;
  `
};

//
const domainToAttributeConverter : { [ domain in Domain ] : { name : string, type : GlslType } } = {
  'uv': { name: 'vUv', type: 'vec2' },
  'view': { name: 'vViewPosition', type: 'vec3' },
  'vertex': { name: 'vVertexPosition', type: 'vec3' },
};

export const domainToAttribute = ( domain : Domain ) => {
  return domainToAttributeConverter[ domain ];
};