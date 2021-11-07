import * as THREE from 'three';

import { random } from "../../../../utils/random";
import { simplex3dChunk } from "../../chunk/noise";
import { Attributes, GLSL, Shader, Uniforms, Functions, Function, Constants, ShaderChunk } from "../../core";
import { buildShader } from "../shaderBuilder";

const axes = [ 'x', 'y', 'z' ] as const;

const vertexShaderMain : GLSL = `
  vUv = uv;
  // TODO: get model matrix!
  vVertexPosition = vec3( modelMatrix * vec4( position, 1.0 ) );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
`;

const imports : ShaderChunk[] = [
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
}

const attributes : Attributes = {
  'vUv' : {
    type : 'vec2'
  },
  'vVertexPosition' : {
    type : 'vec3'
  }
}

const getFunctionName = (() => {
  let counter = 0;
  return ( name : string ) => {
    const functionName = name + counter;
    counter++;
    return functionName;
  }
})();

export enum PointVariable {
  samplePoint = 'samplePoint',
  origin = 'origin',
}

export type Domain = 'uv' | 'vertex';
type Trigonometry = 'sin' | 'cos' | 'tan';
type BinaryOperation = 'mult' | 'div' | 'add' | 'sub';

type NoiseSource = {
  kind : string,
  frequency : THREE.Vector3,
  amplitude? : number,
  pow? : number,
  octaves? : number,
  persistance? : number,
  lacunarity? : number,
  ridge? : number,
}

type TrigSource = {
  kind : string,
  types : { 
    x : Trigonometry,
    y : Trigonometry,
    z : Trigonometry
  },
  frequency? : THREE.Vector3,
  amplitude? : THREE.Vector3,
  combinationOperation? : Exclude<BinaryOperation, 'div'>,
  pow? : number,
}

type CustomSource = {
  glsl : GLSL,
}

type Source = NoiseSource | TrigSource;

type DomainWarp = {
  sources : {
    x : Source,
    y : Source,
    z : Source,
  },
  amount? : THREE.Vector3,
  iterations? : number,

  inputVariable : PointVariable,
}

type PatternShaderSettings = {
  domain : Domain,
  scale? : number,
  timeOffset? : THREE.Vector3,

  mainSource : Source,
  domainWarp? : DomainWarp,
}

const numberToGLSL = ( n : number ) => {
  return Number.isInteger( n ) ? n + '.0' : n;
}

const binaryOperationToGLSL = ( operation : BinaryOperation, a : string, b : string, ...c : string[] ) => {
  const op = (() => {
    switch( operation ) {
      case 'add': return '+';
      case 'sub': return '-';
      case 'mult': return '*';
      case 'div': return '/';
    }
  })();

  const operands = [ a, b, ...c ];
  return operands.join( ` ${ op } ` );
}

const createSource = ( source : Source ) : Function => {
  switch( source.kind ) {
    case 'noise' : return createNoise( source as NoiseSource );
    default : return createTrig( source as TrigSource );
  }
}

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
      float a = ${ numberToGLSL( amplitude ) };
      float divider = 0.0;
      for( int i = 0; i < ${ octaves }; i++ ) {
        vec3 p = point * f;
        float on = pow( simplex3d( p ), ${ numberToGLSL( pow ) });

        ${ ridge < 1.0 ? `
          float rt = ${ numberToGLSL( ridge ) };
          if( on > rt ) on = rt - ( on - rt );
          on /= rt;
        ` : '' }

        n += a * on;

        divider += a;

        a *= ${ numberToGLSL( persistance ) };
        f *= ${ numberToGLSL( lacunarity ) };
      }

      return ${ numberToGLSL( amplitude ) } * n / divider;
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
      float x = ${ numberToGLSL( amplitude.x ) } * ${ types.x }( point.x * ${ numberToGLSL( frequency.x ) } );
      float y = ${ numberToGLSL( amplitude.y ) } * ${ types.y }( point.y * ${ numberToGLSL( frequency.y ) } );
      float z = ${ numberToGLSL( amplitude.z ) } * ${ types.z }( point.z * ${ numberToGLSL( frequency.z ) } );
      return pow( ${ binaryOperationToGLSL( combinationOperation, 'x', 'y', 'z' ) }, ${ numberToGLSL( pow ) } );
    `
  }
}

// TODO wrap everything in a function or class! too much data stored in module... 
// TODO will not work for building multiple shaders

// TODO add support for composite source! source made up of multiple sources, warped, combined, multed etc
const sources = new Map<Source, Function>();

const createWarp = ( warp : DomainWarp ) => {
  const functions : Functions = {};
  const helperNames : string[] = [];

  const amount = warp.amount ?? new THREE.Vector3( 1.0, 1.0, 1.0 );
  const iterations = Math.floor( warp.iterations ?? 1 );

  axes.forEach( axis => {
    const name = getFunctionName( `${ axis }Offset` );
    helperNames.push( name );
    if( !sources.has( warp.sources[ axis ] ) ) {
      functions[ name ] = createSource( warp.sources[ axis ] );
    }
  });

  const warpFunction : Function = {
    parameters : [ [ 'vec3', 'point' ] ],
    returnType : 'vec3',
    body : `
      vec3 previous = vec3( point );
      for( int i = 0; i < ${ iterations }; i++ ) {
        point.x = point.x + ${ helperNames[ 0 ] }( previous ) * ${ numberToGLSL( amount.x ) };
        point.y = point.y + ${ helperNames[ 1 ] }( previous ) * ${ numberToGLSL( amount.y ) };
        point.z = point.z + ${ helperNames[ 2 ] }( previous ) * ${ numberToGLSL( amount.z ) };
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

export const buildPatternShader = ( 
  seed : number = random( 0, Number.MAX_SAFE_INTEGER ) / 2.0,
  settings : PatternShaderSettings,
) : Shader => {

  const timeOffset = settings.timeOffset ?? new THREE.Vector3( 0.0 );

  const sourceName = 'source';

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

  const fragmentShaderFunctions : Functions = {
    'domainWarp': {
      parameters : [ 
        [ 'vec2',  'point' ], 
        [ 'float', 'amount'], 
        [ 'float', 'frequency'], 
      ],
      returnType : 'vec2',
      body: `
        float xOffset = simplex3d( vec3( point * frequency, 0.0 ) ) * amount;
        float yOffset = simplex3d( vec3( point * frequency, 18.4 ) ) * amount;
        return point + vec2( xOffset, yOffset );
      `
    },
  };

  if( !sources.has( settings.mainSource ) ) {
    fragmentShaderFunctions[ sourceName ] = createSource( settings.mainSource );
  }

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
      `vec3 origin = vec3( vVertexPosition );`
    }

    origin *= ${ numberToGLSL( settings.scale ?? 1.0 ) };

    origin += timeOffset * time;

    vec3 samplePoint = origin;

    ${ warpGLSL }

    float n = ${ sourceName }( samplePoint * frequency );
    // gl_FragColor = vec4( n, opacity, 0.3, 1.0 );
    gl_FragColor = vec4( n, n, n, 1.0 );
  `;

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