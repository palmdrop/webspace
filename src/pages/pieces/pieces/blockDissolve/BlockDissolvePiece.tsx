import { BlockDissolveRenderScene } from '../../../../three/renderScenes/blockDissolve/BlockDissolveRenderScene';
import { createPiece } from '../Piece';

export default createPiece( 
  BlockDissolveRenderScene,
  {
    mouseMoveThrottle: 20
  }
);