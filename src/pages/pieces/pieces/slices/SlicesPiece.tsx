import { useEffect } from 'react';
import { PieceProps } from '../pieces';

const SlicesPiece = ( 
  { onLoad } : PieceProps 
) => {

  useEffect( () => {
    onLoad?.();
  }, [] );

  return (
    <iframe
      src="https://palmdrop.github.io/slices"
      style={{
        width: '100vw',
        height: '100vh'
      }}
    />
  );
};

export default SlicesPiece;