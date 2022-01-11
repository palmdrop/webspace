import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { pageDidScroll, selectScrollPosition } from '../../../state/slices/pagesSlice';
import { RootState } from '../../../state/store/store';

export const RestoreScroll = () => {
  const history = useHistory();
  const scrollRef = useRef( { x: 0, y: 0 } );
  const [ path, setPath ] = useState<string>( '/' );

  const updatePath = ( newLocation : string ) => {
    path !== newLocation && setPath( newLocation );
  };

  const hasUpdated = useRef<boolean>( false );

  const dispatch = useDispatch();

  const storedScrollPosition = useSelector( ( state : RootState ) => selectScrollPosition( state, path ) );

  useEffect( () => {
    updatePath( history.location.pathname );

    const saveScrollPosition = () => {
      if( !hasUpdated.current ) return;

      dispatch( pageDidScroll( {
        location: path,
        x: scrollRef.current.x,
        y: scrollRef.current.y
      } ) );

      hasUpdated.current = false;
    };

    const debouncedSaveScrollPosition = debounce( saveScrollPosition, 500 );

    const onScroll = throttle( () => {
      scrollRef.current.x = document.body.scrollLeft || document.documentElement.scrollLeft;
      scrollRef.current.y = document.body.scrollTop || document.documentElement.scrollTop;

      hasUpdated.current = true;

      debouncedSaveScrollPosition();
    }, 300 );

    window.addEventListener( 'scroll', onScroll );

    const unregisterHistoryListener = history.listen( ( location ) => {
      // Save scroll position for previous page before updating the location
      saveScrollPosition();

      // Update path and restore previous scroll position (if existing)
      updatePath( location.pathname );
    } );

    return () => {
      window.removeEventListener( 'scroll', onScroll );
      unregisterHistoryListener();
      onScroll.cancel();
      debouncedSaveScrollPosition.cancel();
    };
  }, [ history, path ] );

  useEffect( () => {
    window.scrollTo( storedScrollPosition.x, storedScrollPosition.y );
  }, [ path ] );

  return null;
};