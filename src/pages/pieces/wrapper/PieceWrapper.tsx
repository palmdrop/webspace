import React, { Suspense, useEffect, useRef, useState } from "react";

import { useHistory } from "react-router";

import { PageRoute } from "../../../App";
import { ColorTheme } from "../../../state/slices/uiSlice";
import { PieceNavigationFunction, pieces } from "../pieces/pieces";

import Button from "../../../components/input/button/Button";
import Bar from "../../../components/ornamental/bars/Bar";
import GradientBackground from "../../../components/ornamental/gradient/GradientBackground";
import Paragraph from "../../../components/paragraph/Paragraph";
import Title from "../../../components/title/Title";

import './PieceWrapper.scss';
import SoftDisk from "../../../components/ornamental/disk/soft/SoftDisk";

type Props = {
  pieceIndex : number,
  backgroundColorTheme? : ColorTheme,
  onLoad? : () => void,
  showLoadingPage? : boolean,
  showOverlay? : boolean,
  handlePieceNavigation? : PieceNavigationFunction
} 

const PieceWrapper = React.memo( ( { 
  pieceIndex, 
  backgroundColorTheme, 
  onLoad, 
  showLoadingPage = false,
  showOverlay = false,
  handlePieceNavigation
} : Props ) => {
  const fadeOutRef = useRef<NodeJS.Timeout | null>( null );

  const [ isLoaded, setIsLoaded ] = useState( false );
  const [ pieceData ] = useState( pieces[ pieceIndex ] );

  const [ overlayVisible, setOverlayVisible ] = useState( true );

  const history = useHistory();
  
  useEffect( ( ) => {
    if( isLoaded ) {
      handleOverlayBlur();
    }
  }, [ isLoaded ] );

  const cancelFadeOut = () => {
    if( fadeOutRef.current ) {
      clearTimeout( fadeOutRef.current );
    }
  }

  const handleOverlayFocus = () => {
    cancelFadeOut();
    setOverlayVisible( true );
  }
  
  const handleOverlayBlur = () => {
    cancelFadeOut();
    fadeOutRef.current = setTimeout( () => {
      setOverlayVisible( false );
    }, 1500 );
  }

  const handleLoad = () : void => {
    setIsLoaded( true );
    onLoad?.();
  }

  const handlePrevious = ( event : React.MouseEvent ) => {
    handlePieceNavigation?.( pieceIndex - 1, event );
  }

  const handleNext = ( event : React.MouseEvent ) => {
    handlePieceNavigation?.( pieceIndex + 1, event );
  }

  const handleGoBack = ( event : React.MouseEvent ) => {
    history.push( PageRoute.pieces );
  }

  return (
    <div className={ `piece-wrapper ${ isLoaded ? 'piece-wrapper--loaded' : '' }` }>
      { !isLoaded && showLoadingPage && (
        <div className="piece-wrapper__loading">
          <Title 
            level={ 3 }
            text={ `Loading ${ pieceData.name }...` }
          />
        </div>
      )}

      <div className="piece-wrapper__content">
        { backgroundColorTheme && (
          <GradientBackground colorTheme={ backgroundColorTheme } /> 
        )}
        <Suspense fallback={ null }>
          <pieceData.Component 
            onLoad={ handleLoad }
          />
        </Suspense>
      </div>
      
      { isLoaded && showOverlay && handlePieceNavigation && (
        <div
          className={ `piece-wrapper__overlay-icon ${ !overlayVisible ? "piece-wrapper__overlay-icon--visible" : "" }` }
          onClick={ handleOverlayFocus }
          onMouseOver={ handleOverlayFocus }
        >
          { ">" }
        </div>
      )}

      { ( isLoaded && showOverlay && handlePieceNavigation ) && (
        <div 
          className={ `piece-wrapper__overlay ${ overlayVisible ? "piece-wrapper__overlay--visible" : "" }` }
          onMouseOver={ handleOverlayFocus }
          onMouseLeave={ handleOverlayBlur }
        >
          <nav className="piece-wrapper__index-back-home">
            <Button 
              additionalClasses="piece-wrapper__back-button"
              onClick={ handleGoBack }
            >
              { "<<< index <<<" }
            </Button>
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
            { ( pieceIndex !== 0 ) && (
              <Button 
                additionalClasses="piece-wrapper__previous-button"
                onClick={ handlePrevious }
              >
                { "< previous" }
              </Button>
            )}
            { ( pieceIndex !== pieces.length - 1 ) && (
              <Button 
                additionalClasses="piece-wrapper__next-button"
                onClick={ handleNext }
              >
                { "next >" }
              </Button>
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
              ))}
            </div>
          </section>
          <div className="piece-wrapper__overlay-close">
            <Button
              additionalClasses="piece-wrapper__overlay-close-button"
              onClick={ () => setOverlayVisible( false ) }
            >
              { "<<<" }
            </Button>
            <SoftDisk />
          </div>
        </div>
      )}
    </div>
  )
})

export default PieceWrapper;