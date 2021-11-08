import { Attributes, Functions, Function, GLSL, Imports, Shader, Uniforms, SupportedVariable, Variables, Constants, GlslType, ShaderChunk, FunctionSignatures, variableValueToGLSL, } from "../core";
import { arrayToString } from "./utils";

export type ShaderSourceData = {
  imports : Imports,
  constants? : Constants,
  functions? : Functions,
  main : GLSL,
}

const importsToGLSL = ( imports : Imports ) => {
  if( !imports ) return '';
  return arrayToString( imports, chunk => `${ chunk.content }\n` );
}

const constantsToGLSL = ( constants : Constants ) => {
  if( !constants ) return '';
  return arrayToString( 
    Object.entries( constants ), 
    ( [ name, { type, value } ] ) => `const ${ type } ${ name } = ${ variableValueToGLSL( { type, value } as SupportedVariable ) };` 
  );
}

const uniformsToGLSL = ( uniforms : Uniforms ) => {
  if( !uniforms ) return '';
  return arrayToString( 
    Object.entries( uniforms ), 
    ( [ name, { type } ] ) => `uniform ${ type } ${ name };`   
  );
}

const attributesToGLSL = ( attributes : Attributes ) => {
  if( !attributes ) return '';
  return arrayToString( 
    Object.entries( attributes ), 
    ( [ name, { type } ] ) => `varying ${ type } ${ name };`   
  );
}

const functionToGLSL = ( name : string, glslFunction : Function ) => {
  return `${ glslFunction.returnType } ${ name }( 
    ${ arrayToString( glslFunction.parameters, ( arg ) => `${ arg[ 0 ] } ${ arg[ 1 ] }`, ',' ) }
  ) {\n
    ${ glslFunction.body }\n
  }\n`
}

const functionsToGLSL = ( functions : Functions ) => {
  if( !functions ) return '';
  return arrayToString( 
    Object.entries( functions ), 
    ( [ name, glslFunction ] ) => functionToGLSL( name, glslFunction ), '\n\n' 
  );
}

/*export type ShaderBuilder = {
  imports : Imports,
  attributes : Attributes,
  uniforms : Uniforms,
  functions : Functions,
  functionSignatures : FunctionSignatures,
  constants : Constants,

  variables : Variables,

  glsl : GLSL[],

  initialize : () => ShaderBuilder,

  declareVariable : ( name : string, variable : SupportedVariable ) => ShaderBuilder,
  addChunk : ( chunk : ShaderChunk ) => ShaderBuilder

  callFunction : ( name : string, args : ( string | SupportedVariable )[], assignTo? : string ) => ShaderBuilder,

  buildGLSL : () => GLSL,
}

export const createShaderBuilder = (
  imports : Imports,
  // TODO add support to reading from uniforms and read/writing to attributes
  attributes : Attributes, 
  uniforms : Uniforms,  
  functions : Functions, 
  constants : Constants,
) : ShaderBuilder => { return {
  imports,
  attributes,
  uniforms,
  functions,
  functionSignatures: {},
  constants,

  variables : {},

  glsl : [],

  initialize : function() {
    if( this.functions ) {
      this.functionSignatures = Object.assign(
        this.functionSignatures,
        this.functions,
      );
    }

    if( this.imports ) {
      Object.entries( this.imports ).map( ( [ name, { functionSignatures } ] ) => {
        if( functionSignatures ) {
          this.functionSignatures = Object.assign( 
            this.functionSignatures,
            functionSignatures
          );
        }
      })
    }

    return this;
  },

  declareVariable : function( name, variable ) {
    if( !this.variables ) this.variables = {};
    if( this.variables[ name ] ) throw new Error( `Shader builder: Variable ${ name } already defined` );

    this.variables[ name ] = variable;

    return this;
  },

  addChunk : function( chunk ) {
    this.glsl.push( chunk.content );
    return this;
  },

  // TODO merge functions and imports! make imports also include a function!!!? 
  // TODO also imports are lacking from builder?
  callFunction : function( name, args, assignTo ) {
    if( !this.functions ) return this;
    const glslFunction = this.functions[ name ];
    if( !glslFunction ) return this;

    let glslFunctionCall = `${ name }( ${ 
      args.map(arg => {
        if( typeof arg === 'string' ) {
          if( !this.variables || !this.variables[ arg ] ) throw new Error( `The variable ${ arg } does not exist` );
          const variable = this.variables[ arg ];
          return '' + variable.value;
        } else {
          return '' + arg.value;
        }
      }).join('\n')
    })`

    if( assignTo ) {
      if( this.variables ) {
        let variable = this.variables[ assignTo ];

        if( variable && variable.type !== glslFunction.returnType ) 
          throw new Error( `The return type of ${ name } does not match the type of ${ assignTo }` );
        else if( !variable ) {
          variable = {
            type : glslFunction.returnType
          }
        }

        this.variables[ assignTo ] = variable;

        glslFunctionCall = `${ assignTo } = ` + glslFunctionCall;
      }
    }

    this.glsl.push( glslFunctionCall );

    return this;
  },

  buildGLSL : function() {
    const variableDeclarations = Object.entries( this.variables || {} ).map( ( [ name, variable ] ) => (
      `${ variable.type } ${ name } ${ variable.value ? ` = ${ variableValueToGLSL( variable ) };\n` : '' }`
    )).join( '\n' );

    return variableDeclarations + '\n' + this.glsl.join( '\n' );
  }
}}
*/

export const buildShader = ( 
  attributes : Attributes,
  uniforms : Uniforms,

  vertexSourceData : ShaderSourceData,
  fragmentSourceData : ShaderSourceData
) : Shader => {

  const attributesGLSL = attributesToGLSL( attributes );
  const uniformsGLSL = uniformsToGLSL( uniforms );

  const vertexShader = `
    ${ importsToGLSL( vertexSourceData.imports ) }
    ${ attributesGLSL }
    ${ uniformsGLSL }

    ${ constantsToGLSL( fragmentSourceData.constants ) }

    ${ functionsToGLSL( vertexSourceData.functions ) }

    void main() {
      ${ vertexSourceData.main }
    }
  `;

  const fragmentShader = `
    ${ importsToGLSL( fragmentSourceData.imports ) }
    ${ attributesGLSL }
    ${ uniformsGLSL }
    
    ${ constantsToGLSL( fragmentSourceData.constants ) }

    ${ functionsToGLSL( fragmentSourceData.functions ) }

    void main() {
      ${ fragmentSourceData.main }
    }
  `;

  return {
    uniforms,
    vertexShader,
    fragmentShader
  }
}

