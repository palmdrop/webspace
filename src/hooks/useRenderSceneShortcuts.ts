import { useCallback, useEffect, useReducer } from 'react'
import { selectIsAdmin } from '../state/slices/adminSlice';
import { useAppSelector } from '../state/store/hooks';
import { RenderScene } from '../three/core';
import { promptDownload } from '../utils/file';


const useRenderSceneShortcuts = ( renderScene : RenderScene | null ) => {
  const isAdmin = useAppSelector( selectIsAdmin );
  const [ reloadValue, reload ] = useReducer( ( current : number ) => current + 1, 0 );

  const handleCaptureFrame = useCallback( () => {
    if( !isAdmin || !renderScene ) return;

    renderScene.captureFrame( ( dataURL ) => {
      promptDownload( dataURL, 'canvas.png' );
    });
  }, [ isAdmin, renderScene ] );

  const handleKeyDown = useCallback( ( event : KeyboardEvent ) => {
    if( event.type !== 'keydown' ) return;

    switch( event.key ) {
      case 'c' : handleCaptureFrame(); break;
      case ' ' : reload(); break;
    }
  }, [ handleCaptureFrame ] );

  useEffect( () => {
    if( !renderScene ) return;

    window.addEventListener( 'keydown', handleKeyDown );

    return () => {
      window.removeEventListener( 'keydown', handleKeyDown );
    }
  }, [ renderScene, handleKeyDown ] );

  return {
    reloadValue
  }
}

export default useRenderSceneShortcuts;
