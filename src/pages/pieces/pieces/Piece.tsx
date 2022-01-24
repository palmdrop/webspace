import AnimationCanvas, { MouseMoveCallback, MouseScrollCallback } from '../../../components/canvas/AnimationCanvas';
import { RenderScene, RenderSceneConstructor } from '../../../three/core';
import { Piece, PieceProps } from './pieces';

import './pieces.scss';

export const createPiece = <T extends RenderScene>( 
  renderSceneConstructor : RenderSceneConstructor<T>,
  animationCanvasArgs : Record<string, unknown> = {}
) : Piece => {
  return ( { onLoad } : PieceProps ) => {
    const onMouseMove : MouseMoveCallback<T> = ( x, y, deltaX, deltaY, renderScene ) => {
      renderScene.onMouseMove?.( x, y, deltaX, deltaY );
    };

    const onScroll : MouseScrollCallback<T> = ( deltaScroll, renderScene ) => {
      renderScene.onScroll?.( deltaScroll );
    };

    return (
      <div className="piece">
        <AnimationCanvas 
          renderSceneConstructor={ renderSceneConstructor }
          onMouseMove={ onMouseMove }
          onScroll={ onScroll }
          onLoad={ onLoad }
          { ...animationCanvasArgs }
        />
      </div>
    );
  };
};
