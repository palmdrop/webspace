import * as THREE from 'three';
import { random } from '../../../../utils/random';

import { simplex3dChunk } from "../../chunk/noise";
import { Attributes, GLSL, Shader, Uniforms, Functions, Constants, ShaderChunk } from "../../core";
import { buildShader } from "../shaderBuilder";
import { numToGLSL } from '../utils';
import { buildModification, buildSource, buildWarpFunction, domainToAttribute, hsvToRgbFunction, rgbToHsvFunction } from './helpers';
import { ColorSettings, DomainWarp, FunctionCache, FunctionWithName, Modification, PatternShaderSettings } from './types';

// Constants
const REGULAR_OUTPUT = 'n';
const TEXTURE_OUTPUT = 'color';

// Imports
const getImports = () : ShaderChunk[] => {
  return [ simplex3dChunk ];
}

// Uniforms
const getAttributes = () : Attributes => {
  return  {
    'vUv' : {
      type : 'vec2'
    }
  }
}

// Uniforms
const getUniforms = () : Uniforms => {
  return {
    'opacity' : { 
      value : 1.0, 
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
    'brightness' : {
      value : 1.0,
      type : 'float'
    },
  }
}

// Constants
const getConstants = ( settings : PatternShaderSettings ) : Constants => {
  return {
    'frequency' : {
      type : 'float',
      value : 1.0,
    },
    'timeOffset' : {
      type : 'vec3',
      value : settings.timeOffset ?? new THREE.Vector3()
    }
  };
}

// Color
const buildFragColorConverterGLSL = ( colorSettings : ColorSettings | undefined, mainFromTexture : boolean, functions : Functions ) : GLSL => {
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
  }

  // Modifications applied to a single component
  const buildComponentModificationsGLSL = ( 
    input : GLSL, 
    modification : Modification | Modification[] | undefined, 
    alternative : GLSL,
    passThrough : boolean = false,
  ) => {
    if( modification ) return buildModification( input, modification );
    if( colorMode === 'rgb' || passThrough ) return input;
    return alternative;
  }

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
    ? buildModification( getComponentGLSL( 'a' ), modifications.a ) 
    : '1.0';


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
      `gl_FragColor = vec4( vec3( x, y, z ) * brightness, a );` :
      'gl_FragColor = vec4( hsvToRgb( vec3( x, y, z ) ) * brightness, a );'
    }
  `;
}

const buildWarpGLSL = ( domainWarp : DomainWarp | undefined, uniforms : Uniforms, textureNames : Set<string>, functionCache : FunctionCache ) => {
  if( !domainWarp ) return '';

  const { name } = buildWarpFunction( domainWarp, uniforms, textureNames, functionCache );
  return `samplePoint = ${ name }( origin );`;
}

export const buildPatternShader = ( settings : PatternShaderSettings ) : Shader => {
  // Cache and data
  const functionCache : FunctionCache = new Map<any, FunctionWithName>();
  const textureNames = new Set<string>();
  const functions : Functions = {};

  /* GLSL Construction */
  const imports = getImports();
  const attributes = getAttributes();
  const uniforms = getUniforms();
  const constants = getConstants( settings );
  const mainFromTexture = settings.mainSource.kind === 'texture';
  const seed = settings.seed ?? Math.random() * 10000;

  { // Add domain attribute
    const { name, type } = domainToAttribute( settings.domain );
    attributes[ name ] = { type };
  }

  // Vertex shader
  const vertexMain : GLSL = `
    ${ settings.domain === 'uv' ? `vUv = uv;` : '' }
    ${ settings.domain === 'vertex' ? `vVertexPosition = vec3( modelMatrix * vec4( position, 1.0 ) );` : '' }
    ${ settings.domain === 'view'   ? `vViewPosition = vec3( modelViewMatrix * vec4( position, 1.0 ) );` : '' }
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  `;

  // Fragment shader
  const warpGLSL = buildWarpGLSL( settings.domainWarp, uniforms, textureNames, functionCache );
  const toFragColorGLSL = buildFragColorConverterGLSL( settings.colorSettings, mainFromTexture, functions );
  const { name : mainSourceName } = buildSource( settings.mainSource, uniforms, textureNames, functionCache, true );

	const fragmentMain : GLSL = `
    ${ settings.domain === 'uv' ? `vec3 origin = vec3( vUv, 0.0 );` : '' }
    ${ settings.domain === 'view' ? `vec3 origin = vec3( vViewPosition );` : '' }
    ${ settings.domain === 'vertex' ? `vec3 origin = vec3( vVertexPosition );` : '' }

    ${ settings.domain !== 'uv' ? `origin += vec3( ${ numToGLSL( seed ) } );` : '' }

    origin *= ${ numToGLSL( settings.scale ?? 1.0 ) };
    origin += timeOffset * time;

    vec3 samplePoint = origin;

    ${ warpGLSL }

    ${ !mainFromTexture ? 
      `float n = ${ mainSourceName }( samplePoint * frequency );` :
      `vec4 color = ${ mainSourceName }( samplePoint * frequency );`
    }

    ${ toFragColorGLSL } 

    gl_FragColor *= opacity;
  `;
  
  // Add functions
  functionCache.forEach( ( { name, func } ) => functions[ name ] = func );

  // Build
  return buildShader(
    attributes,
    uniforms,
    {
      imports,
      main : vertexMain,
    },
    {
      imports,
      constants,
      functions,
      main : fragmentMain,
    }
  );
};