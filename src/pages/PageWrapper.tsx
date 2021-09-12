import React from 'react'
import { useEffect } from 'react';
import { PageRoute } from '../App';
import { ColorThemes, setColorScheme, setNextPageRoute } from '../state/slices/uiSlice';
import { useAppDispatch } from '../state/store/hooks';

import './PageWrapper.scss';

type Props = {
  route : PageRoute,
  colorScheme : ColorThemes,
  fadeOut : boolean,
  scroll? : boolean,
  children : React.ReactChild | React.ReactChild[] 
}

const PageWrapper = ( { route, colorScheme, scroll = true, fadeOut, children } : Props ) : JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect( () => {
    dispatch( setNextPageRoute( route ) );
    dispatch( setColorScheme( colorScheme ) );

  }, [ colorScheme, dispatch, route ] );

  return (
    <div 
      className={ 
        `page-wrapper 
        ${ scroll ? 'page-wrapper--scroll' : '' } 
        ${ fadeOut ? 'page-wrapper--fade-out' : '' }` 
      }
    >
      { children }
    </div>
  )
}

export type PageProps = {
  route : PageRoute
}

export default React.memo( PageWrapper );
