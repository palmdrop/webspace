import * as THREE from 'three';

/* Basic types */
export type GLSL = string;
export type GlslType = 'float' | 'int' | 'bool' | 'vec2' | 'vec3' | 'vec4' | 'sampler2D';

export type Trigonometry = 'sin' | 'cos' | 'tan';
export type Operation = 'mult' | 'div' | 'add' | 'sub' | 'avg';


export type FunctionSignature = {
  parameters : [ GlslType, string ][] // array of parameters
  returnType : GlslType,
}

export type ShaderChunk = {
  content : string,
  functionSignatures ?: { [ key : string ] : FunctionSignature }
}


/* Variables */
type IVariable<T extends GlslType, V> = {
  type : T,
  value ?: V
}

export type Float = IVariable<'float', number>;
export type Int = IVariable<'int', number>;
export type Bool = IVariable<'bool', boolean>;
export type Vec2 = IVariable<'vec2', THREE.Vector2>;
export type Vec3 = IVariable<'vec3', THREE.Vector3>;
export type Vec4 = IVariable<'vec4', THREE.Vector4>;
export type Variable = Float | Int | Vec2 | Vec3 | Vec4;

export type Variables = { [ name : string ] : Variable };

/* Constants */
export type Constant = Variable;
export type Constants = Variables;

/* Uniforms */
export type Uniform = THREE.IUniform & { 
  type : GlslType 
}

export type Uniforms = { [ uniform : string ] : Uniform };

/* Attributes */
export type Attribute = {
  type : GlslType 
}
export type Attributes = { [ varying : string ] : Attribute };

/* Imports */
export type Imports = ShaderChunk[] | undefined;

/* Functions */
export type FunctionSignatures = { [ name : string ] : FunctionSignature };
export type Function = FunctionSignature & {
  body : GLSL,
}

export type Functions = { [ name : string ] : Function };

/* Shaders */
export type Shader = {
  uniforms : Uniforms,
  vertexShader : GLSL,
  fragmentShader : GLSL
}

/* Utility */
export type UniformObject = {
  uniforms ?: { 
    [uniform : string] : {
      value : any
    }
  }
}

export const setUniform = <T>( 
  name : string,
  value : T,
  destinationObject : UniformObject | undefined
) => {
  if( 
    !destinationObject || 
    !destinationObject.uniforms ||
    !destinationObject.uniforms[ name ]
  ) return false;

  destinationObject.uniforms[ name ].value = value;

  return true;
};