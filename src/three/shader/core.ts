import * as THREE from 'three';

/* Basic types */
export type GLSL = string;
export type GlslType = 'float' | 'int' | 'vec2' | 'vec3' | 'vec4';

export type FunctionSignature = {
  parameters : [ GlslType, String ][] // array of parameters
  returnType : GlslType,
}

export type ShaderChunk = {
  content : string,
  functionSignatures? : { [ key : string ] : FunctionSignature }
}


/* Variables */
type Variable<T extends GlslType, V> = {
  type : T,
  value? : V
}

export type Float = Variable<'float', number>;
export type Int = Variable<'int', number>;
export type Vec2 = Variable<'vec2', THREE.Vector2>;
export type Vec3 = Variable<'vec3', THREE.Vector3>;
export type Vec4 = Variable<'vec4', THREE.Vector4>;
export type SupportedVariable = Float | Int | Vec2 | Vec3 | Vec4;

export type Variables = { [ name : string ] : SupportedVariable } | undefined;

/* Constants */
export type Constant = SupportedVariable;
export type Constants = Variables;

/* Uniforms */
export type Uniform = THREE.IUniform & { 
  type : GlslType 
}
export type Uniforms = { [ uniform : string ] : Uniform } | undefined;

/* Attributes */
export type Attribute = {
  type : GlslType 
}
export type Attributes = { [ varying : string ] : Attribute } | undefined;

/* Imports */
export type Imports = ShaderChunk[] | undefined;

/* Functions */
export type FunctionSignatures = { [ name : string ] : FunctionSignature } | undefined;
export type Function = FunctionSignature & {
  body : GLSL,
}

export type Functions = { [ name : string ] : Function } | undefined;

/* Shaders */
export type Shader = {
  uniforms : Uniforms,
  vertexShader : GLSL,
  fragmentShader : GLSL
}

/* Utility */
export const setUniform = <T>( 
  name : string,
  value : T,

  destinationObject? : { 
    uniforms?: { 
      [uniform: string]: {
        value : any
      }
    } | undefined
  }
) => {
  if( 
    !destinationObject || 
    !destinationObject.uniforms ||
    !destinationObject.uniforms[ name ]
  ) return false;

  destinationObject.uniforms[ name ].value = value;

  return true;
}

export const variableValueToGLSL = ( variable : SupportedVariable ) => {
  const converters : { [ type in GlslType ] : ( value? : any ) => string }= {
    'float' : ( value? : number ) => !value ? '0.0' : '' + value,
    'int' : ( value? : number ) => !value ? '0' : '' + value,
    'vec2' : ( value? : THREE.Vector2 ) => !value ? 'vec2()' : `vec2( ${ value.x }, ${ value.y } )`,
    'vec3' : ( value? : THREE.Vector3 ) => !value ? 'vec3()' : `vec3( ${ value.x }, ${ value.y }, ${ value.z } )`,
    'vec4' : ( value? : THREE.Vector4 ) => !value ? 'vec4()' : `vec4( ${ value.x }, ${ value.y }, ${ value.z }, ${ value.w } )`,
  }

  return converters[ variable.type ]( variable.value );
}