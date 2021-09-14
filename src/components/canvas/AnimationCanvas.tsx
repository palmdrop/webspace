import React, { useState } from 'react';
import { useLayoutEffect } from 'react';
import { useRef, useEffect } from 'react';
import { createRenderScene, RenderScene, RenderSceneConstructor, VoidCallback } from '../../three/core';

type MouseMoveCallback<T extends RenderScene> = ( x : number, y : number, deltaX : number, deltaY : number, renderScene : T ) => void;

type Props<T extends RenderScene> = {
  renderSceneConstructor : RenderSceneConstructor<T>,
  onLoad? : VoidCallback,
  onMouseMove? : MouseMoveCallback<T>,
};

const AnimationCanvas = <T extends RenderScene>( { renderSceneConstructor, onLoad, onMouseMove } : Props<T> ) : JSX.Element => {
  const [ renderScene, setRenderScene ] = useState<T | null>( null );
  const mousePosition = useRef<{ x : number, y : number } | null>( null );
  const canvasRef = useRef<HTMLCanvasElement>( null );

  const handleResize = () : void => {
    renderScene?.resize();
  }

  const handleMouseMove = ( event : MouseEvent ) => {
    let previousX, previousY;

    if( mousePosition.current === null ) {
      previousX = event.clientX;
      previousY = event.clientY;
      mousePosition.current = { x : 0, y : 0 };
    } else {
      previousX = mousePosition.current.x;
      previousY = mousePosition.current.y;
    }

    const deltaX = event.clientX - previousX;
    const deltaY = event.clientY - previousY;

    renderScene && onMouseMove?.( event.clientX, event.clientY, deltaX, deltaY, renderScene );

    mousePosition.current.x = event.clientX;
    mousePosition.current.y = event.clientY;
  };

  const addListeners = () : void => {
    window.addEventListener( 'resize', handleResize );
    onMouseMove && window.addEventListener( 'mousemove', handleMouseMove );

    handleResize();
  }

  const removeListeners = () : void => {
    window.removeEventListener( 'resize', handleResize );
    onMouseMove && window.removeEventListener( 'mousemove', handleMouseMove );
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
