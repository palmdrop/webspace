import { RhizomeRenderScene } from '../../../../three/renderScenes/rhizome/RhizomeRenderScene';
import { createPiece } from '../Piece';

export default createPiece( 
  RhizomeRenderScene,
  {
    mouseMoveThrottle: 20
  },
  {
    background: 'black'
  }
);