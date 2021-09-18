import React, { Suspense, useState } from "react";
import GradientBackground from "../../../components/ornamental/gradient/GradientBackground";
import { ColorTheme } from "../../../state/slices/uiSlice";

import retroCoreImage from '../../../assets/content/pieces/retro-core/img1.png';

import './pieces.scss';

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

export const FeautredPiece = pieces[ 0 ];

type PieceWrapperProps = {
  pieceData : PieceData,
  backgroundColorTheme? : ColorTheme,
  onLoad? : () => void
} 

export const PieceWrapper = React.memo( ( { pieceData, backgroundColorTheme, onLoad } : PieceWrapperProps ) => {
  const [ isLoaded, setIsLoaded ] = useState( false );

  const handleLoad = () : void => {
    setIsLoaded( true );
    onLoad?.();
  }

  return (
    <div className={ `piece-wrapper ${ isLoaded ? 'piece-wrapper--loaded' : '' }` }>
      { !isLoaded && (
        <div>
          Loading 
        </div>
      )}

      { backgroundColorTheme && (
        <GradientBackground colorTheme={ backgroundColorTheme } /> 
      )}
      <Suspense fallback={ null }>
        <pieceData.Component 
          onLoad={ handleLoad }
        />
      </Suspense>
    </div>
  )
})