import * as THREE from 'three';

/* Basic types */
export type GLSL = string;
export type GlslType = 'float' | 'int' | 'bool' | 'vec2' | 'vec3' | 'vec4' | 'sampler2D';

export type Trigonometry = 'sin' | 'cos' | 'tan';
export type Operation = 'mult' | 'div' | 'add' | 'sub' | 'avg';


export type GlslFunctionSignature = {
  parameters : [ GlslType, string ][] // array of parameters
  returnType : GlslType,
}

export type ShaderChunk = {
  content : string,
  functionSignatures ?: { [ key : string ] : GlslFunctionSignature }
}


/* Variables */
type IGlslVariable<T extends GlslType, V> = {
  type : T,
  value ?: V
}

export type Float = IGlslVariable<'float', number>;
export type Int = IGlslVariable<'int', number>;
export type Vec2 = IGlslVariable<'vec2', THREE.Vector2>;
export type Vec3 = IGlslVariable<'vec3', THREE.Vector3>;
export type Vec4 = IGlslVariable<'vec4', THREE.Vector4>;
export type GlslVariable = Float | Int | Vec2 | Vec3 | Vec4;

export type GlslVariables = { [ name : string ] : GlslVariable };

/* Constants */
export type Constant = GlslVariable;
export type Constants = GlslVariables;

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
export type GlslFunctionSignatures = { [ name : string ] : GlslFunctionSignature };
export type GlslFunction = GlslFunctionSignature & {
  body : GLSL,
}

export type GlslFunctions = { [ name : string ] : GlslFunction };

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
  value ?: T,

  destinationObject ?: { 
    uniforms ?: { 
      [uniform : string] : {
        value : any
      }
    } | undefined
  }
) => {
  if( 
    !destinationObject || 
    !destinationObject.uniforms ||
    !destinationObject.uniforms[ name ]
  ) return undefined;

  if( value ) destinationObject.uniforms[ name ].value = value;
  return destinationObject.uniforms [ name ].value;
};