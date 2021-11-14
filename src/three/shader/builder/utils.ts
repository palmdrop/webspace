import { Operation, GlslType, Variable } from "../core";

export const AXES = [ 'x', 'y', 'z' ] as const;

export const arrayToString = <T>( 
  array : T[], 
  itemToString : ( item : T, index? : number ) => string,
  separator : string = '\n'
) => {
  return array.map( itemToString ).join( separator );
}

export const numToGLSL = ( n : number ) => {
  return Number.isInteger( n ) ? n + '.0' : n + '';
}

export const opToGLSL = ( operation : Operation, ...args : string[] ) => {
  if( args.length === 0 ) return '';

  const op = (() => {
    switch( operation ) {
      case 'add': return '+';
      case 'sub': return '-';
      case 'mult': return '*';
      case 'div': return '/';
      case 'avg': return '+';
    }
  })();

  let result = args.join( ` ${ op } ` );

  if( operation === 'avg' ) {
    result = `( ${ result } ) / ${ numToGLSL( args.length ) }`;
  }

  return result;
}

const converters : { [ type in GlslType ] : ( value? : any ) => string }= {
  'float' : ( value? : number ) => !value ? '0.0' : '' + numToGLSL( value ),
  'int' : ( value? : number ) => !value ? '0' : '' + Math.floor( value ),
  'vec2' : ( value? : THREE.Vector2 ) => !value ? 'vec2()' : `vec2( ${ numToGLSL( value.x ) }, ${ numToGLSL( value.y ) } )`,
  'vec3' : ( value? : THREE.Vector3 ) => !value ? 'vec3()' : `vec3( ${ numToGLSL( value.x ) }, ${ numToGLSL( value.y ) }, ${ numToGLSL( value.z ) } )`,
  'vec4' : ( value? : THREE.Vector4 ) => !value ? 'vec4()' : `vec4( ${ numToGLSL( value.x ) }, ${ numToGLSL( value.y ) }, ${ numToGLSL( value.z ) }, ${ numToGLSL( value.w ) } )`,
  'sampler2D' : () => { throw new Error( "Cannot convert texture to value" ); }
}

export const variableValueToGLSL = ( variable : Variable ) => {
  return converters[ variable.type ]( variable.value );
}