import React, { useEffect } from 'react'
import { selectIsAdmin } from '../state/slices/adminSlice';
import { useAppSelector } from '../state/store/hooks';
import { RenderScene } from '../three/core';
import { promptDownload } from '../utils/file';



const useRenderSceneShortcuts = ( renderScene : RenderScene | null ) => {
  const isAdmin = useAppSelector( selectIsAdmin );

  const handleCaptureFrame = () => {
    if( !isAdmin || !renderScene ) return;

    renderScene.captureFrame( ( dataURL ) => {
      promptDownload( dataURL, 'canvas.png' );
    });
  }

  const handleKeyDown = ( event : KeyboardEvent ) => {
    if( event.type !== 'keydown' ) return;

    switch( event.key ) {
      case 'c': handleCaptureFrame(); break;
    }
  }

  useEffect( () => {
    if( !renderScene ) return;

    window.addEventListener( 'keydown', handleKeyDown );

    return () => {
      window.removeEventListener( 'keydown', handleKeyDown );
    }
  }, [ renderScene ] );
}

export default useRenderSceneShortcuts;
