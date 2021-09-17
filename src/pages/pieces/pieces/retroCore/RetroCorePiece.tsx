import AnimationCanvas from '../../../../components/canvas/AnimationCanvas';
import { RetroCoreRenderScene } from '../../../../three/renderScenes/retroCore/RetroCoreRenderScene';
import { Piece } from '../pieces';

import '../pieces.scss';

const RetroCorePiece : Piece = ( { onLoad } ) : JSX.Element => {
  const onMouseMove = ( x : number, y : number, deltaX : number, deltaY : number, renderScene : RetroCoreRenderScene ) => {
    renderScene.rotate( deltaX, deltaY );
  };

  return (
    <div className="piece">
      <AnimationCanvas 
        renderSceneConstructor={ RetroCoreRenderScene }
        onMouseMove={ onMouseMove }
        onLoad={ onLoad }
      />
    </div>
  )
}

export default RetroCorePiece;
