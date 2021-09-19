import React, { Suspense, useState } from "react";
import GradientBackground from "../../../components/ornamental/gradient/GradientBackground";
import { ColorTheme } from "../../../state/slices/uiSlice";

import retroCoreImage from '../../../assets/content/pieces/retro-core/img1.png';

import './pieces.scss';
import Title from "../../../components/title/Title";
import Button from "../../../components/input/button/Button";

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
  const [ isLoaded, setIsLoaded ] = useState( false );

  const [ pieceData ] = useState( pieces[ pieceIndex ] );

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

      { ( showOverlay && handlePieceNavigation ) && (
        <div className="piece-wrapper__overlay">
          <Title
            level={ 3 }
            text={ `${ pieceIndex + 1 }. ${ pieceData.name }` }
          />

          <nav className="piece-wrapper__nav">
            { ( pieceIndex !== 0 ) && (
              <Button 
                additionalClasses="piece-wrapper__previous-button"
                onClick={ handlePrevious }
              >
                Previous
              </Button>
            )}
            { ( pieceIndex !== pieces.length - 1 ) && (
              <Button 
                additionalClasses="piece-wrapper__next-button"
                onClick={ handleNext }
              >
                Next
              </Button>
            )}


          </nav>
        </div>
      )}
    </div>
  )
})