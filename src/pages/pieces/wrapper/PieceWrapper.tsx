import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { PageRoute } from '../../../App';
import { ColorTheme } from '../../../state/slices/uiSlice';
import { pieces } from '../pieces/pieces';

import Button from '../../../components/input/button/Button';
import Bar from '../../../components/ornamental/bars/Bar';
import GradientBackground from '../../../components/ornamental/gradient/GradientBackground';
import Paragraph from '../../../components/paragraph/Paragraph';
import Title from '../../../components/title/Title';

import SoftDisk from '../../../components/ornamental/disk/soft/SoftDisk';
import StarLoader from '../../../components/loader/starLoader/StarLoader';

import { useTitle } from '../../../hooks/useTitle';
import { InternalLink } from '../../../components/link/InternalLink';

import { nameToPath } from '../../../utils/general';

import './PieceWrapper.scss';

type Props = {
  baseRoute ?: PageRoute,
  pieceIndex : number,
  backgroundColorTheme ?: ColorTheme,
  onLoad ?: () => void,
  showLoadingPage ?: boolean,
  showOverlay ?: boolean,
  setPageTitle ?: boolean,
} 

const PieceWrapper = React.memo( ( { 
  baseRoute,
  pieceIndex, 
  backgroundColorTheme, 
  onLoad, 
  showLoadingPage = false,
  showOverlay = false,
  setPageTitle = false,
} : Props ) => {
  const fadeOutRef = useRef<NodeJS.Timeout | null>( null );

  const [ overlayEnabled, setOverlayEnabled ] = useState( true );
  const [ overlayVisible, setOverlayVisible ] = useState( true );
  const [ isLoaded, setIsLoaded ] = useState( false );
  const pieceData = useMemo( () => pieces[ pieceIndex ], [ pieceIndex ] );

  useTitle( setPageTitle ? pieceData.name : undefined );

  const cancelFadeOut = useCallback( () => {
    if( fadeOutRef.current ) {
      clearTimeout( fadeOutRef.current );
    }
  }, [] );

  const handleOverlayBlur = useCallback( () => {
    cancelFadeOut();
    fadeOutRef.current = setTimeout( () => {
      setOverlayVisible( false );
    }, 1500 );
  }, [ setOverlayVisible, cancelFadeOut ] );

  useEffect( () => {
    const handleKeyPress = ( event : KeyboardEvent ) => {
      switch( event.key ) {
        case 'h': setOverlayEnabled( enabled => !enabled ); break;
        default: break;
      }
    };

    window.addEventListener( 'keydown', handleKeyPress );
    return () => {
      window.removeEventListener( 'keydown', handleKeyPress );
    };
  }, [] );
  
  useEffect( () => {
    if( isLoaded ) {
      handleOverlayBlur();
    }
  }, [ isLoaded, handleOverlayBlur ] );

  const handleOverlayFocus = () => {
    cancelFadeOut();
    setOverlayVisible( true );
  };
  
  const handleLoad = useCallback( () => {
    setIsLoaded( true );
    onLoad?.();
  }, [ setIsLoaded, onLoad ] );

  const getPieceRoute = ( index : number ) => {
    return `${ baseRoute }/${ nameToPath( pieces[ index ].name ) }`;
  };

  return (
    <div className={ `piece-wrapper ${ isLoaded ? 'piece-wrapper--loaded' : '' }` }>
      { !isLoaded && showLoadingPage && (
        <div className="piece-wrapper__loading">
          <StarLoader />
          <Title 
            level={ 3 }
            text={ `Loading ${ pieceData.name }...` }
          />
          <StarLoader />
        </div>
      )}

      <div className="piece-wrapper__content">
        { backgroundColorTheme && (
          <GradientBackground colorTheme={ backgroundColorTheme } /> 
        )}
        <Suspense fallback={ null }>
          <pieceData.Component 
            onLoad={ handleLoad }
            overlayEnabled={ showOverlay && overlayEnabled }
          />
        </Suspense>
      </div>
      
      { isLoaded && showOverlay && overlayEnabled && (
        <div
          className={ `piece-wrapper__overlay-icon ${ !overlayVisible ? 'piece-wrapper__overlay-icon--visible' : '' }` }
          onClick={ handleOverlayFocus }
          onMouseOver={ handleOverlayFocus }
        >
          { '>' }
        </div>
      )}

      { isLoaded && showOverlay && overlayEnabled && (
        <div 
          className={ `piece-wrapper__overlay ${ overlayVisible ? 'piece-wrapper__overlay--visible' : '' }` }
          onMouseOver={ handleOverlayFocus }
          onMouseLeave={ handleOverlayBlur }
        >
          <nav className="piece-wrapper__index-back-home">
            <InternalLink 
              className="piece-wrapper__back-button"
              to={ PageRoute.pieces }
            >
              { '<<< index <<<' }
            </InternalLink>
          </nav>

          <Title
            level={ 3 }
            text={ `${ pieceIndex + 1 }. ${ pieceData.name }` }
          />

          <Bar 
            direction="horizontal"
            variant="inset"
          />

          <nav className="piece-wrapper__piece-nav">
            { ( pieceIndex !== 0 && baseRoute ) && (
              <InternalLink 
                className="piece-wrapper__previous-button"
                to={ getPieceRoute( pieceIndex - 1 ) }
              >
                { '< previous' }
              </InternalLink>
            )}
            { ( ( pieceIndex !== pieces.length - 1 ) && baseRoute ) && (
              <InternalLink 
                className="piece-wrapper__next-button"
                to={ getPieceRoute( pieceIndex + 1 ) }
              >
                { 'next >' }
              </InternalLink>
            )}
          </nav>

          <section className="piece-wrapper__description">
            <div>
              { pieceData.description.map( ( paragraph, index ) => (
                <Paragraph
                  key={ `paragraph-${ index }` }
                >
                  { paragraph }
                </Paragraph>
              ) )}
            </div>
          </section>
          <div className="piece-wrapper__overlay-close">
            <Button
              additionalClasses="piece-wrapper__overlay-close-button"
              onClick={ () => setOverlayVisible( false ) }
            >
              { '<<<' }
            </Button>
            <SoftDisk />
          </div>
        </div>
      )}
    </div>
  );
} );

export default PieceWrapper;