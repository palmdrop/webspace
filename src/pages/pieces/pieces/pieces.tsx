import React, { Suspense, useEffect, useRef, useState } from "react";
import GradientBackground from "../../../components/ornamental/gradient/GradientBackground";
import { ColorTheme } from "../../../state/slices/uiSlice";

import retroCoreImage from '../../../assets/content/pieces/retro-core/img1.png';

import './pieces.scss';
import Title from "../../../components/title/Title";
import Button from "../../../components/input/button/Button";
import Bar from "../../../components/ornamental/bars/Bar";
import { PageRoute } from "../../../App";
import { useHistory } from "react-router";
import Paragraph from "../../../components/paragraph/Paragraph";

export type PieceProps = { onLoad : (() => void ) | undefined };
export type Piece = React.FunctionComponent<PieceProps>;
export type PieceData = {
  name : string,
  description : string[],
  tags : string[],
  image? : string,

  Component: React.LazyExoticComponent<Piece>,

  colorTheme? : ColorTheme
}

export type PieceNavigationFunction = ( 
  index : number, 
  event : React.MouseEvent 
) => void;

export const pieces : PieceData[] = Array( 7 ).fill(
  {
    name: "Retro Core",
    description: [
      "An exploration of a particular aesthetic idea",
      `3D shapes are turned flat using transparency and disabled depth testing,
       Both the inside and the outside of the shapes are rendered, and the side that is
       visible shifts as the shapes rotate.
      `,
      `Creatures with good vision are often also exceptional at determining the orientation,
      size, shape and distance of objects using visual cues such as perspective distortion, shadows
      and lighting.
      `,
      `This piece tries to confuse our perception by intentionally not presenting 3D objects
      as we might expect them to be presented.
      `
    ],
    tags : [
      "3d", "Geometry"
    ],
    image: retroCoreImage,

    Component: React.lazy( () => import( './retroCore/RetroCorePiece' ) ),
    colorTheme: ColorTheme.horizon
  }
);

pieces[ 1 ] = {
  name: "Solar Chrome",
  description: [
    "Dummy"
  ],
  tags : [
    "3d", "Warp"
  ],

  Component: React.lazy( () => import( './solarChrome/SolarChromePiece' ) ),
}

export const FeaturedPieceIndex = 0;

type PieceWrapperProps = {
  pieceIndex : number,
  backgroundColorTheme? : ColorTheme,
  onLoad? : () => void,
  showLoadingPage? : boolean,
  showOverlay? : boolean,
  handlePieceNavigation? : PieceNavigationFunction
} 

export const PieceWrapper = React.memo( ( { 
  pieceIndex, 
  backgroundColorTheme, 
  onLoad, 
  showLoadingPage = false,
  showOverlay = false,
  handlePieceNavigation
} : PieceWrapperProps ) => {
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
          onMouseEnter={ handleOverlayFocus }
        >
          { ">" }
        </div>
      )}

      { ( isLoaded && showOverlay && handlePieceNavigation ) && (
        <div 
          className={ `piece-wrapper__overlay ${ overlayVisible ? "piece-wrapper__overlay--visible" : "" }` }
          //onMouseEnter={ handleOverlayFocus }
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
            { pieceData.description.map( ( paragraph, index ) => (
              <Paragraph
                key={ `paragraph-${ index }` }
              >
                { paragraph }
              </Paragraph>
            ))}
          </section>

          <Button
            additionalClasses="piece-wrapper__overlay-close-button"
            onClick={ () => setOverlayVisible( false ) }
          >
            { "<<<" }
          </Button>
        </div>
      )}
    </div>
  )
})