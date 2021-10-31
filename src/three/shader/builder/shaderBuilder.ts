import { Attributes, Functions, Function, GLSL, Imports, Shader, Uniforms, SupportedVariable, Variables, Constants, GlslType } from "../core";

export type ShaderSourceData = {
  imports : Imports,
  constants : Constants,
  functions : Functions,
  main : GLSL,
}

const arrayToString = <T>( 
  array : T[], 
  itemToString : ( item : T, index? : number ) => string,
  separator : string = '\n'
) => {
  return array.map( itemToString ).join( separator );
}

const variableValueToString = ( { type, value } : SupportedVariable ) => {
  if( type === 'float' ) {
    if( Number.isInteger( value ) ) return value + '.0';
    else return value + '';
  }

  return value + '';
}

const importsToGLSL = ( imports : Imports ) => {
  if( !imports ) return '';
  return arrayToString( imports, chunk => `${ chunk.content }\n` );
}

const constantsToGLSL = ( constants : Constants ) => {
  if( !constants ) return '';
  return arrayToString( 
    Object.entries( constants ), 
    ( [ name, { type, value } ] ) => `const ${ type } ${ name } = ${ variableValueToString( { type, value } as SupportedVariable ) };` 
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
  return `${ glslFunction.returnValue } ${ name }( 
    ${ arrayToString( glslFunction.arguments, ( arg ) => `${ arg[ 0 ] } ${ arg[ 1 ] }`, ',' ) }
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

/*
  Allow for building functions and main functions
  
  * method chaining
  * variables, functions, attributes and uniforms stored in list
  * user calls function, can access these variables and perform operations
  * define simple operations, like mult, div, etc... should only be defined for certain combinations of types

*/

export type ShaderBuilder = {
  attributes : Attributes,
  uniforms : Uniforms,
  functions : Functions,
  constants : Constants,

  variables : Variables,
  declareVariable : ( name : string, variable : SupportedVariable ) => ShaderBuilder,
}

export const createShaderBuilder = (
 attributes : Attributes, 
 uniforms : Uniforms,  
 functions : Functions, 
 constants : Constants,
) : ShaderBuilder => { return {
  attributes,
  uniforms,
  functions,
  constants,

  variables : {},
  declareVariable : function( name, variable ) {
    if( !this.variables ) this.variables = {};
    if( this.variables[ name ] ) throw new Error( `Shader builder: Variable ${ name } already defined` );

    this.variables[ name ] = variable;

    return this;
  }
}}

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

