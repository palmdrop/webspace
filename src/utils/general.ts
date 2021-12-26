import { clamp } from 'three/src/math/MathUtils';
import { v4 as uuidv4 } from 'uuid';

export const generateUUID = () => uuidv4();

export const noop = () => { return; };

export const nameToPath = ( name : string ) => {
  return name.replaceAll( ' ', '-' ).trim().toLowerCase();
};

type WeightedElement<T> = [
  element : T,
  weight : number
];

export const weightedRandomElement = <T>( elements : WeightedElement<T>[] ) => {
  const sum = elements.reduce( ( acc, [ _, weight ] ) => acc + weight, 0.0 );
  const r = Math.random() * sum;

  let accumulator = 0.0;
  for( let i = 0; i < elements.length; i++ ) {
    accumulator += elements[ i ][ 1 ];
    if( accumulator >= r ) {
      return elements[ i ][ 0 ];
    }
  }

  return elements[ elements.length - 1 ][ 0 ];
};

export const smoothStep = ( value : number, min : number, max : number ) => {
  const t = clamp( ( value - min ) / ( max - min ), 0.0, 1.0 );
  return t * t * ( 3.0 - 2.0 * t );
};
