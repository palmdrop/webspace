import { EdgePathRenderScene } from '../../../../three/renderScenes/immerse/ImmerseRenderScene';
import { createPiece } from '../Piece';



export default createPiece( 
  EdgePathRenderScene,
  {
    mouseMoveThrottle: 20
  },
  {
    cursor: 'none'
  }
);