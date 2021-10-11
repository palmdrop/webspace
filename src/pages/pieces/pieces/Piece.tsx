import { useReducer } from 'react';
import AnimationCanvas, { MouseMoveCallback, MouseScrollCallback } from '../../../components/canvas/AnimationCanvas';
import { RenderScene, RenderSceneConstructor, VoidCallback } from '../../../three/core'
import { Piece } from './pieces'

import './pieces.scss';

export const createPiece = <T extends RenderScene>( renderSceneConstructor : RenderSceneConstructor<T> ) : Piece => {
  return ( { onLoad } ) => {
    const onMouseMove : MouseMoveCallback<T> = ( x, y, deltaX, deltaY, renderScene ) => {
      renderScene.onMouseMove?.( x, y, deltaX, deltaY );
    }

    const onScroll : MouseScrollCallback<T> = ( deltaScroll, renderScene ) => {
      renderScene.onScroll?.( deltaScroll );
    }

    return (
      <div className="piece">
        <AnimationCanvas 
          renderSceneConstructor={ renderSceneConstructor }
          onMouseMove={ onMouseMove }
          onScroll={ onScroll }
          onLoad={ onLoad }
        />
      </div>
    );
  }
}
