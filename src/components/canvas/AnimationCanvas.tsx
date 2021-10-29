import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';

import { createRenderScene, RenderScene, RenderSceneConstructor, VoidCallback } from '../../three/core';

import useRenderSceneShortcuts from '../../hooks/useRenderSceneShortcuts';
import { useMemoizedThrottle } from '../../hooks/useMemoizedThrottle';
import { useAppSelector } from '../../state/store/hooks';
import { selectIsAdmin } from '../../state/slices/adminSlice';

export type MouseMoveCallback<T extends RenderScene> = ( x : number, y : number, deltaX : number, deltaY : number, renderScene : T ) => void;
export type MouseScrollCallback<T extends RenderScene> = ( deltaScroll : number, renderScene : T ) => void;

type Props<T extends RenderScene> = {
  renderSceneConstructor : RenderSceneConstructor<T>,
  onLoad? : VoidCallback,
  onMouseMove? : MouseMoveCallback<T>,
  onScroll? : MouseScrollCallback<T>,

  resizeThrottle? : number,
  mouseMoveThrottle? : number,
  scrollThrottle? : number,
};

const AnimationCanvas = <T extends RenderScene>( { 
  renderSceneConstructor, 
  onLoad, 
  onMouseMove,
  onScroll,

  resizeThrottle = 300,
  mouseMoveThrottle = 100,
  scrollThrottle = 100,
} : Props<T> ) : JSX.Element => {
  const [ renderScene, setRenderScene ] = useState<T | null>( null );
  const mousePosition = useRef<{ x : number, y : number } | null>( null );
  const canvasRef = useRef<HTMLCanvasElement>( null );
  const isAdmin = useAppSelector( selectIsAdmin );

  const handleResize = useMemoizedThrottle( () => {
    renderScene?.resize()
  }, resizeThrottle, [ renderScene ] );

  const handleMouseMove = useMemoizedThrottle( ( event : MouseEvent ) => {
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
  }, mouseMoveThrottle, [ renderScene, onMouseMove ] );

  const handleMouseScroll = useMemoizedThrottle( ( event : React.WheelEvent ) => {
    let deltaScroll = Math.sign( -event.deltaY );

    renderScene && onScroll?.( deltaScroll, renderScene );
  }, scrollThrottle, [ renderScene, onScroll ] );

  const addListeners = () : void => {
    window.addEventListener( 'resize', handleResize );

    onMouseMove && window.addEventListener( 'mousemove', handleMouseMove );

    renderScene?.resize();
  }

  const removeListeners = () : void => {
    window.removeEventListener( 'resize', handleResize );

    onMouseMove && window.removeEventListener( 'mousemove', handleMouseMove );
  }

  const { reloadValue } = useRenderSceneShortcuts( renderScene );

  useEffect( () => {
    if( canvasRef.current !== null ) {
      const renderScene = createRenderScene( renderSceneConstructor, canvasRef.current, onLoad );
      setRenderScene( renderScene );

      if( isAdmin && renderScene.onUserAdmin ) renderScene.onUserAdmin();
      renderScene.start();

      return () => {
        renderScene.stop();
        renderScene.dispose && renderScene.dispose();
      }
    }
  }, [ renderSceneConstructor, onLoad, reloadValue ]);

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
      onWheel={ handleMouseScroll }
    />
  )
}

export default AnimationCanvas;
