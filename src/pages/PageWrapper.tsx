import React from 'react'
import { useEffect } from 'react';
import { PageRoute } from '../App';
import { ColorScheme, setColorScheme, setNextPageRoute } from '../state/slices/uiSlice';
import { useAppDispatch } from '../state/store/hooks';

import './PageWrapper.scss';

type Props = {
  route : PageRoute,
  colorScheme : ColorScheme,
  scroll? : boolean,
  children : React.ReactChild | React.ReactChild[] 
}

const PageWrapper = ( { route, colorScheme, scroll = true, children } : Props ) : JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect( () => {
    dispatch( setNextPageRoute( route ) );
    dispatch( setColorScheme( colorScheme ) );

  }, [ colorScheme ] );

  return (
    <div className={ `page-wrapper ${ scroll ? 'page-wrapper--scroll' : '' }` }>
      { children }
    </div>
  )
}

export type PageProps = {
  route : PageRoute,
  fadeOut : boolean
}

export default React.memo( PageWrapper );
