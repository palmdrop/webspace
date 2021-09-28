import AnimationCanvas from '../../../../components/canvas/AnimationCanvas';
import { SolarLandscapeRenderScene } from '../../../../three/renderScenes/solarLandscape/SolarLandscapeRenderScene';
import { Piece } from '../pieces';

import '../pieces.scss';

const SolarLandscapePiece : Piece = ( { onLoad } ) : JSX.Element => {
  const onMouseMove = ( x : number, y : number, deltaX : number, deltaY : number, renderScene : SolarLandscapeRenderScene ) => {
    renderScene.rotate( deltaX, deltaY );
  };

  const onScroll = ( deltaScroll : number, renderScene : SolarLandscapeRenderScene ) => {
    renderScene.zoom( deltaScroll );
  }

  return (
    <div className="piece">
      <AnimationCanvas renderSceneConstructor={ SolarLandscapeRenderScene }
        onMouseMove={ onMouseMove }
        onLoad={ onLoad }
        onScroll={ onScroll }
      />
    </div>
  )
}

export default SolarLandscapePiece;
