import * as THREE from 'three';

/* Basic types */
export type GLSL = string;
export type GlslType = 'float' | 'int' | 'vec2' | 'vec3' | 'vec4';

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
export type Imports = ShaderChunk<any>[] | undefined;

/* Functions */
export type Function = {
  arguments : [ GlslType, String ][] // array of arguments
  returnValue : GlslType,
  body : GLSL,
  // call : ( args : SupportedVariable ) => SupportedVariable,
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