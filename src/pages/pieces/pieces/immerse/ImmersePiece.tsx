import { ImmerseRenderScene } from '../../../../three/renderScenes/immerse/ImmerseRenderScene';
import { createPiece } from '../Piece';

export default createPiece( 
  ImmerseRenderScene,
  {
    mouseMoveThrottle: 20
  },
  {
    cursor: 'none'
  }
);