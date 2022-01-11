import React from 'react';
import { useEffect } from 'react';
import { PageRoute } from '../App';
import { RestoreScroll } from '../components/navigation/scroll/RestoreScroll';
import { useTitle } from '../hooks/useTitle';
import { ColorTheme, setColorTheme } from '../state/slices/uiSlice';
import { useAppDispatch } from '../state/store/hooks';

import './PageWrapper.scss';

export type PageProps = {
  route : PageRoute
}

type Props = {
  title : string,
  colorTheme : ColorTheme,
  children : React.ReactChild | React.ReactChild[] 
}

const PageWrapper = ( { title, colorTheme, children } : Props ) : JSX.Element => {
  const dispatch = useAppDispatch();

  useTitle( title );

  useEffect( () => {
    dispatch( setColorTheme( colorTheme ) );
  }, [ colorTheme, dispatch ] );

  return (
    <div className="page-wrapper">
      <RestoreScroll />
      { children }
    </div>
  );
};

export default React.memo( PageWrapper );
