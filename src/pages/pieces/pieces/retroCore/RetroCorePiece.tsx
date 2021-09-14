import AnimationCanvas from '../../../../components/canvas/AnimationCanvas';
import { MainRenderScene } from '../../../../three/main/MainRenderScene';
import { Piece } from '../pieces';

import '../pieces.scss';

const RetroCorePiece : Piece = ( { onLoad } ) : JSX.Element => {
  const onMouseMove = ( x : number, y : number, deltaX : number, deltaY : number, renderScene : MainRenderScene ) => {
    renderScene.rotate( deltaX, deltaY );
  };

  return (
    <div className="piece">
      <AnimationCanvas 
        renderSceneConstructor={ MainRenderScene }
        onMouseMove={ onMouseMove }
        onLoad={ onLoad }
      />
    </div>
  )
}

export default RetroCorePiece;
