import React from 'react'
import { useEffect } from 'react';
import { PageRoute } from '../App';
import { ColorTheme, setColorTheme, setNextPageRoute } from '../state/slices/uiSlice';
import { useAppDispatch } from '../state/store/hooks';

import './PageWrapper.scss';

export type PageProps = {
  route : PageRoute
}

type Props = {
  route : PageRoute,
  colorTheme : ColorTheme,
  children : React.ReactChild | React.ReactChild[] 
}

const PageWrapper = ( { route, colorTheme, children } : Props ) : JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect( () => {
    dispatch( setNextPageRoute( route ) );
    dispatch( setColorTheme( colorTheme ) );

  }, [ colorTheme, route, dispatch ] );

  return (
    <div className="page-wrapper">
      { children }
    </div>
  )
}

export default React.memo( PageWrapper );
