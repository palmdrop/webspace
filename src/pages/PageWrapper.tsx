import React from 'react'
import { useEffect } from 'react';
import { PageRoute } from '../App';
import { ColorScheme, setColorScheme, setNextPageRoute } from '../state/slices/uiSlice';
import { useAppDispatch } from '../state/store/hooks';

import './PageWrapper.scss';

type Props = {
  route : PageRoute,
  colorScheme : ColorScheme,
  children : React.ReactChild | React.ReactChild[] 
}

const PageWrapper = ( { route, colorScheme, children } : Props ) : JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect( () => {
    dispatch( setNextPageRoute( route ) );
    dispatch( setColorScheme( colorScheme ) );

  }, [ colorScheme ] );

  return (
    <div className="page-wrapper">
      { children }
    </div>
  )
}

export type PageProps = {
  route : PageRoute,
  fadeOut : boolean
}

export default React.memo( PageWrapper );
