import React from 'react'
import { useEffect } from 'react';
import { ColorScheme, setColorScheme } from '../state/slices/uiSlice';
import { useAppDispatch } from '../state/store/hooks';

type Props = {
  colorScheme : ColorScheme,
  children : React.ReactChild | React.ReactChild[] 
}

const PageWrapper = ( { colorScheme, children } : Props ) : JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect( () => {
    dispatch( setColorScheme( colorScheme ) );
  }, [ colorScheme ] );

  return (
    <div className="page">
      { children }
    </div>
  )
}

export default React.memo( PageWrapper );
