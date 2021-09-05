import React, { useState } from 'react';
import { useLayoutEffect } from 'react';
import { useRef, useEffect } from 'react';
import { createRenderScene, RenderScene, RenderSceneConstructor, VoidCallback } from '../../three/core';

type MouseMoveCallback<T extends RenderScene> = ( event : MouseEvent, renderScene : T ) => void;

type Props<T extends RenderScene> = {
  renderSceneConstructor : RenderSceneConstructor<T>,
  onLoad? : VoidCallback,
  onMouseMove? : MouseMoveCallback<T>,
};

const AnimationCanvas = <T extends RenderScene>( { renderSceneConstructor, onLoad, onMouseMove } : Props<T> ) : JSX.Element => {
  const [ renderScene, setRenderScene ] = useState<T | null>( null );
  const canvasRef = useRef<HTMLCanvasElement>( null );

  const handleResize = () : void => {
    renderScene?.resize();
  }

  const handleMouseMove = ( event : MouseEvent ) => {
    renderScene && onMouseMove?.( event, renderScene );
  };

  const addListeners = () : void => {
    window.addEventListener( 'resize', handleResize );
    onMouseMove && window.addEventListener( 'mousemove', handleMouseMove );
    handleResize();
  }

  const removeListeners = () : void => {
    window.removeEventListener( 'resize', handleResize );
    window.removeEventListener( 'mousemove', handleMouseMove );
  }

  useEffect( () => {
    if( canvasRef.current !== null ) {
      const renderScene = createRenderScene( renderSceneConstructor, canvasRef.current, onLoad );
      setRenderScene( renderScene );

      renderScene.start();

      return () => {
        renderScene.stop();
      }
    }
  }, [ renderSceneConstructor ]);

  useLayoutEffect( () => {
    addListeners()

    return () => {
      removeListeners();
    }
  });

  return (
    <canvas
      className="animation-canvas"
      ref={ canvasRef }
    />
  )
}

export default AnimationCanvas;
