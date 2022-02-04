import * as THREE from 'three';
import { random } from '../../../../utils/random';

import { fastVoronoi3dChunk, genericNoise3dChunk, simplex3dChunk, voronoi3dChunk } from '../../chunk/noise';
import { Attributes, GLSL, Shader, Uniforms, GlslFunctions, Constants, ShaderChunk } from '../../core';
import { buildShader } from '../shaderBuilder';
import { numToGLSL } from '../utils';
import { buildFog, buildModification, buildSoftParticleTransform, buildSource, buildWarpFunction, domainToAttribute, hsvToRgbFunction, isInfFunction, isNanFunction, rgbToHsvFunction, sanitizeFunction } from './helpers';
import { ColorSettings, DomainWarp, FunctionCache, FunctionWithName, Modification, NoiseFunctionName, PatternShaderSettings } from './types';

const noiseMap : { [key in NoiseFunctionName] : ShaderChunk } = {
  'simplex3d': simplex3dChunk,
  'noise3d': genericNoise3dChunk,
  'voronoi3d': voronoi3dChunk,
  'fastVoronoi3d': fastVoronoi3dChunk
};

// Constants
const REGULAR_OUTPUT = 'n';
const TEXTURE_OUTPUT = 'color';

// Imports
const getImports = () : ShaderChunk[] => {
  return [];
};

// Uniforms
const getAttributes = () : Attributes => {
  return {
    'vUv': {
      type: 'vec2'
    }
  };
};

// Uniforms
const getUniforms = () : Uniforms => {
  return {
    'opacity': { 
      value: 1.0, 
      type: 'float' 
    },
    'viewport': {
      value: new THREE.Vector2( 1, 1 ),
      type: 'vec2'
    },
    'time': {
      value: 0.0,
      type: 'float'
    },
    'brightness': {
      value: 1.0,
      type: 'float'
    },
    'frequency': {
      type: 'float',
      value: 0.1,
    },
  };
};

// Constants
const getConstants = ( settings : PatternShaderSettings ) : Constants => {
  return {
    'timeOffset': {
      type: 'vec3',
      value: settings.timeOffset ?? new THREE.Vector3()
    }
  };
};

// Color
const buildFragColorConverterGLSL = ( 
  colorSettings : ColorSettings | undefined, 
  mainFromTexture : boolean, 
  functions : GlslFunctions,
  uniforms : Uniforms, 
  textureNames : Set<string>, 
  functionCache : FunctionCache, 
  noiseTypes : Set<NoiseFunctionName>
) : GLSL => {
  // No color adjustments if settings are absent
  if( !colorSettings ) {
    return mainFromTexture 
      ? `gl_FragColor = ${ TEXTURE_OUTPUT };` 
      : `gl_FragColor = vec4( ${ REGULAR_OUTPUT }, ${ REGULAR_OUTPUT }, ${ REGULAR_OUTPUT }, 1.0 );`;
  }

  const colorMode = colorSettings.mode;
  const modifications = colorSettings.componentModifications ?? {};

  // Add hsv/rgb converter functions
  if( colorMode === 'hsv' ) {
    functions[ 'hsvToRgb' ] = hsvToRgbFunction;
  }
  if( colorMode === 'hsv' && mainFromTexture ) {
    functions[ 'rgbToHsv' ] = rgbToHsvFunction;
  }

  // GLSL for one color component
  const getComponentGLSL = ( component : 'x' | 'y' | 'z' | 'a' ) => {
    return mainFromTexture ? `( ${ TEXTURE_OUTPUT }.${ component } )` : `( ${ REGULAR_OUTPUT } )`;
  };

  // Modifications applied to a single component
  const buildComponentModificationsGLSL = ( 
    input : GLSL, 
    modification : Modification | Modification[] | undefined, 
    alternative : GLSL,
    passThrough = false,
  ) => {
    if( modification ) {
      return buildModification( 
        input, 
        modification,
        uniforms,
        textureNames,
        functionCache,
        noiseTypes,
        'samplePoint'
      );
    } 
    if( colorMode === 'rgb' || passThrough ) return input;
    return alternative;
  };

  // Build GLSL for each component

  const xGLSL = buildComponentModificationsGLSL( 
    getComponentGLSL( 'x' ),
    modifications.x, 
    numToGLSL( Math.random() )
  );

  const yGLSL = buildComponentModificationsGLSL( 
    getComponentGLSL( 'y' ),
    modifications.y, 
    numToGLSL( random( 0.3, 0.8 ) )
  );

  const zGLSL = buildComponentModificationsGLSL( 
    getComponentGLSL( 'z' ),
    modifications.z, 
    numToGLSL( random( 0.3, 0.8 ) ),
    true
  );

  const aGLSL = modifications.a 
    ? buildModification( 
      getComponentGLSL( 'a' ), 
      modifications.a,
      uniforms,
      textureNames,
      functionCache,
      noiseTypes,
      'samplePoint'
    ) : '1.0';


  // Build shader code

  return `
    ${ mainFromTexture && colorMode === 'hsv' ? 
    `${ TEXTURE_OUTPUT } = vec4( rgbToHsv( ${ TEXTURE_OUTPUT }.rgb ), ${ TEXTURE_OUTPUT }.a );` : '' 
}

    float x = ${ xGLSL };
    float y = ${ yGLSL };
    float z = ${ zGLSL };
    float a = ${ aGLSL };

    ${ colorMode === 'rgb' ? 
    'gl_FragColor = vec4( vec3( x, y, z ) * brightness, a );' :
    'gl_FragColor = vec4( hsvToRgb( vec3( x, y, z ) ) * brightness, a );'
}
  `;
};

const buildWarpGLSL = ( 
  domainWarp : DomainWarp | undefined, 
  uniforms : Uniforms, 
  textureNames : Set<string>, 
  functionCache : FunctionCache,
  noiseTypes : Set<NoiseFunctionName>
) => {
  if( !domainWarp ) return '';

  const { name } = buildWarpFunction( domainWarp, uniforms, textureNames, functionCache, noiseTypes );
  return `samplePoint = ${ name }( origin );`;
};

export const buildPatternShader = ( settings : PatternShaderSettings ) : Shader => {
  // Cache and data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const functionCache : FunctionCache = new Map<any, FunctionWithName>();
  const textureNames = new Set<string>();
  const functions : GlslFunctions = {};
  const noiseTypes : Set<NoiseFunctionName> = new Set<NoiseFunctionName>();

  functions[ 'isNan' ] = isNanFunction;
  functions[ 'isInf' ] = isInfFunction;
  functions[ 'sanitize' ] = sanitizeFunction;

  /* GLSL Construction */
  const imports = getImports();
  const attributes = getAttributes();
  const uniforms = getUniforms();
  const constants = getConstants( settings );
  const mainFromTexture = settings.mainSource.kind === 'texture';
  const seed = settings.seed ?? Math.random() * 10000;

  { // Add domain attribute
    const addDomainAttribute = ( domain : 'view' | 'vertex' ) => {
      const { name, type } = domainToAttribute( domain );
      attributes[ name ] = { type };
    };

    addDomainAttribute( 'view' );
    addDomainAttribute( 'vertex' );
  }

  // Vertex shader
  const vertexMain : GLSL = `
    vUv = uv;

    ${ settings.forInstancedMesh ? `
      mat4 modifiedModelMatrix = modelMatrix * instanceMatrix;
      mat4 modifiedModelViewMatrix = modelViewMatrix * instanceMatrix;
    ` : `
      mat4 modifiedModelMatrix = modelMatrix;
      mat4 modifiedModelViewMatrix = modelViewMatrix;
    ` }

    vVertexPosition = vec3( modifiedModelMatrix * vec4( position, 1.0 ) );
    vViewPosition = vec3( modifiedModelViewMatrix * vec4( position, 1.0 ) );

    gl_Position = projectionMatrix * modifiedModelViewMatrix * vec4( position, 1.0 );
  `;

  // Fragment shader
  const warpGLSL = buildWarpGLSL( settings.domainWarp, uniforms, textureNames, functionCache, noiseTypes );
  const toFragColorGLSL = buildFragColorConverterGLSL( settings.colorSettings, mainFromTexture, functions, uniforms, textureNames, functionCache, noiseTypes );
  const { name: mainSourceName } = buildSource( settings.mainSource, uniforms, textureNames, functionCache, noiseTypes, true );
  const maskSourceData = settings.mask ? buildSource( settings.mask, uniforms, textureNames, functionCache, noiseTypes ) : undefined;
  const alphaMaskSourceData = settings.alphaMask ? buildSource( settings.alphaMask, uniforms, textureNames, functionCache, noiseTypes ) : undefined;

  const fogData = settings.fog ? buildFog( settings.fog, functionCache ) : undefined;

  const makeSoftParticle = settings.softParticleSettings ? buildSoftParticleTransform( settings.softParticleSettings, uniforms, textureNames, functionCache ) : undefined;

  const fragmentMain : GLSL = `
    ${ settings.domain === 'uv' ? 'vec3 origin = vec3( vUv, 0.0 );' : '' }
    ${ settings.domain === 'view' ? 'vec3 origin = vec3( vViewPosition );' : '' }
    ${ settings.domain === 'vertex' ? 'vec3 origin = vec3( vVertexPosition );' : '' }

    ${ settings.domain !== 'uv' ? `origin += vec3( ${ numToGLSL( seed ) } );` : '' }

    origin *= ${ numToGLSL( settings.scale ?? 1.0 ) };
    origin += timeOffset * time;

    vec3 samplePoint = origin;

    ${ warpGLSL }

    ${ !mainFromTexture ? 
    `float n = ${ mainSourceName }( samplePoint * frequency );
       n = sanitize( n );` : 
    `vec4 color = ${ mainSourceName }( samplePoint * frequency );
      `
}

    ${ toFragColorGLSL } 
    ${ maskSourceData ? 
    `gl_FragColor = vec4( gl_FragColor.rgb * ${ maskSourceData.name }( samplePoint * frequency ), gl_FragColor.a );` 
    : '' 
} 
    ${ alphaMaskSourceData ? `
      float alphaMask = ${ alphaMaskSourceData.name }( samplePoint * frequency );
      alphaMask = clamp( alphaMask, 0.0, 1.0 );
      gl_FragColor = vec4( gl_FragColor.rgb, alphaMask * gl_FragColor.a );`
    : '' 
} 

    gl_FragColor.x = sanitize( gl_FragColor.x );
    gl_FragColor.y = sanitize( gl_FragColor.y );
    gl_FragColor.z = sanitize( gl_FragColor.z );

    ${ fogData ? `
      float depth = gl_FragCoord.z / gl_FragCoord.w;
      gl_FragColor = vec4( ${ fogData.name }( gl_FragColor.rgb, depth ), gl_FragColor.a );
    ` : '' }

    gl_FragColor *= opacity;

    ${ makeSoftParticle ? `
      vec2 screenCoords = gl_FragCoord.xy / resolution.xy;
      gl_FragColor = ${ makeSoftParticle.name }( gl_FragColor, screenCoords );
    ` : '' }
  `;
  
  // Add functions and gather global variables
  let allGlobals = {};
  functionCache.forEach( ( { name, func, globals } ) => {
    functions[ name ] = func;
    if ( globals ) {
      allGlobals = {
        ...allGlobals,
        ...globals
      };
    }
  } );

  noiseTypes.forEach( type => imports.push( noiseMap[ type ] ) );

  // Build
  return buildShader(
    attributes,
    uniforms,
    {
      imports: [],
      main: vertexMain,
    },
    {
      imports,
      constants,
      globals: allGlobals,
      functions,
      main: fragmentMain,
    }
  );
};