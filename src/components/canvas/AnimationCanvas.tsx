import React, { useState } from 'react';
import { useLayoutEffect } from 'react';
import { useRef, useEffect } from 'react';
import { createRenderScene, RenderScene, RenderSceneConstructor } from '../../three/core';

type Props = {
  renderSceneConstructor : RenderSceneConstructor
};

const AnimationCanvas = ( { renderSceneConstructor } : Props ) : JSX.Element => {
  const [ renderScene, setRenderScene ] = useState<RenderScene | null>( null );
  const canvasRef = useRef<HTMLCanvasElement>( null );

  const handleResize = () : void => {
    renderScene?.resize();
  }

  const addListeners = () : void => {
    window.addEventListener( 'resize', handleResize );
    handleResize();
  }

  const removeListeners = () : void => {
    window.removeEventListener( 'resize', handleResize );
  }

  useEffect( () => {
    if( canvasRef.current !== null ) {
      const renderScene = createRenderScene( renderSceneConstructor, canvasRef.current );
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
