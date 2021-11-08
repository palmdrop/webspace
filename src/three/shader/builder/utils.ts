import { BinaryOperation } from "../core";

export const arrayToString = <T>( 
  array : T[], 
  itemToString : ( item : T, index? : number ) => string,
  separator : string = '\n'
) => {
  return array.map( itemToString ).join( separator );
}

export const numToGLSL = ( n : number ) => {
  return Number.isInteger( n ) ? n + '.0' : n;
}

export const binOpToGLSL = ( operation : BinaryOperation, ...args : string[] ) => {
  const op = (() => {
    switch( operation ) {
      case 'add': return '+';
      case 'sub': return '-';
      case 'mult': return '*';
      case 'div': return '/';
    }
  })();

  return args.join( ` ${ op } ` );
}
