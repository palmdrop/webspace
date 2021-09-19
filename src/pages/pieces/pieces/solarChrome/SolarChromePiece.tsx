import AnimationCanvas from '../../../../components/canvas/AnimationCanvas';
import { SolarChromeRenderScene } from '../../../../three/renderScenes/solarChrome/SolarChromeRenderScene';
import { Piece } from '../pieces';

import '../pieces.scss';

const SolarChromePiece : Piece = ( { onLoad } ) : JSX.Element => {
  const onMouseMove = ( x : number, y : number, deltaX : number, deltaY : number, renderScene : SolarChromeRenderScene ) => {
    //renderScene.rotate( deltaX, deltaY );
  };

  return (
    <div className="piece">
      <AnimationCanvas renderSceneConstructor={ SolarChromeRenderScene }
        onMouseMove={ onMouseMove }
        onLoad={ onLoad }
      />
    </div>
  )
}

export default SolarChromePiece;
