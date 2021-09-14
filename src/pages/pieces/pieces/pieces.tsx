import React, { ReactNode, useState } from "react";
import GradientBackground from "../../../components/ornamental/gradient/GradientBackground";
import { ColorTheme } from "../../../state/slices/uiSlice";
import RetroCorePiece from "./retroCore/RetroCorePiece";

import './pieces.scss';

export type PieceProps = { onLoad : (() => void ) | undefined };
export type Piece = React.FunctionComponent<PieceProps>;

export const mainPiece = './pages/pieces/pieces/retroCore/RetroCorePiece';
export const MainPieceComponent = RetroCorePiece;


type PieceWrapperProps = {
  PieceComponent : Piece,
  backgroundColorTheme? : ColorTheme,
  onLoad? : () => void
} 

export const PieceWrapper = ( {
  PieceComponent,
  backgroundColorTheme,
  onLoad
} : PieceWrapperProps ) => {
  const [ isLoaded, setIsLoaded ] = useState( false );

  const handleLoad = () : void => {
    setIsLoaded( true );
    onLoad?.();
  }

  return (
    <div className={ `piece-wrapper ${ isLoaded ? 'piece-wrapper--loaded' : '' }` }>
      { backgroundColorTheme && (
        <GradientBackground colorTheme={ backgroundColorTheme } /> 
      )}
      <PieceComponent 
        onLoad={ handleLoad }
      />
    </div>
  )
}