import * as THREE from 'three';
import { random } from '../../../../utils/random';

import { simplex3dChunk } from "../../chunk/noise";
import { Attributes, GLSL, Shader, Uniforms, Functions, Constants, ShaderChunk } from "../../core";
import { buildShader } from "../shaderBuilder";
import { numToGLSL } from '../utils';
import { buildModification, buildSource, buildWarpFunction, domainToAttribute, hsvToRgbFunction, rgbToHsvFunction } from './helpers';
import { Domain, FunctionCache, FunctionWithName, PatternShaderSettings } from './types';

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

export const buildPatternShader = ( settings : PatternShaderSettings ) : Shader => {
  const imports = getImports();
  const attributes = getAttributes();
  const uniforms = getUniforms();
  const constants = getConstants( settings );

  // Cache
  const functionCache : FunctionCache = new Map<any, FunctionWithName>();
  const textureNames = new Set<string>();
  const domains = new Set<Domain>();

  /* GLSL Construction */
  domains.add( settings.domain );

  // Fragment shader
  const { name : mainSourceName } = buildSource( settings.mainSource, uniforms, textureNames, functionCache, true );

  let warpGLSL = '';
  if( settings.domainWarp ) {
    const { name } = buildWarpFunction( settings.domainWarp, uniforms, textureNames, functionCache );
    warpGLSL = `samplePoint = ${ name }( origin );`;
  }

  const functions : Functions = {};
  functionCache.forEach( ( { name, func } ) => functions[ name ] = func );

  const mainFromTexture = settings.mainSource.kind === 'texture';
  let toFragColorGLSL = '';
  if( !settings.colorSettings ) {
    toFragColorGLSL = mainFromTexture ?
      `gl_FragColor = color;` :
      `gl_FragColor = vec4( n, n, n, 1.0 );`;
  } else {
    const colorMode = settings.colorSettings.mode;
    if( colorMode === 'hsv' ) {
      functions[ 'hsvToRgb' ] = hsvToRgbFunction;
      
      if ( mainFromTexture ) {
        functions[ 'rgbToHsv' ] = rgbToHsvFunction;
      }
    }

    let modifications = settings.colorSettings.componentModifications ?? {};

    let xInputGLSL, yInputGLSL, zInputGLSL, aInputGLSL;
    if( mainFromTexture ) {
      xInputGLSL = '( color.r )';
      yInputGLSL = '( color.g )';
      zInputGLSL = '( color.b )';
      aInputGLSL = '( color.a )';
    } else {
      xInputGLSL = yInputGLSL = zInputGLSL = aInputGLSL = '( n )';
    }

    const xGLSL = modifications.x ? buildModification( xInputGLSL, modifications.x ) : 
      colorMode === 'rgb' ? xInputGLSL : numToGLSL( Math.random() );

    const yGLSL = modifications.y ? buildModification( yInputGLSL, modifications.y ) : 
      colorMode === 'rgb' ? yInputGLSL : numToGLSL( random( 0.3, 0.8 ) );

    const zGLSL = modifications.z ? buildModification( zInputGLSL, modifications.z ) : 
      colorMode === 'rgb' ? zInputGLSL : '1.0';

    const aGLSL = modifications.a ? buildModification( aInputGLSL, modifications.a ) :
      '1.0';

    toFragColorGLSL = `
      ${ mainFromTexture && colorMode === 'hsv' ? 
        `color = vec4( rgbToHsv( color.rgb ), color.a );` : '' 
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

  const seed = settings.seed ?? Math.random() * 10000;
	const fragmentMain : GLSL = `
    ${ settings.domain === 'uv' ? 
      `vec3 origin = vec3( vUv, 0.0 );` : 
       settings.domain === 'view' ?
      `vec3 origin = vec3( vViewPosition );` :
      `vec3 origin = vec3( vVertexPosition );`
    }

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

  domains.forEach( domain => {
    const { name, type } = domainToAttribute( domain );
    attributes[ name ] = { type };
  })

  // Vertex shader
  const vertexMain : GLSL = `
    vUv = uv;
    ${ settings.domain === 'vertex' ? `vVertexPosition = vec3( modelMatrix * vec4( position, 1.0 ) );` : '' }
    ${ settings.domain === 'view'   ? `vViewPosition = vec3( modelViewMatrix * vec4( position, 1.0 ) );` : '' }
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  `;


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