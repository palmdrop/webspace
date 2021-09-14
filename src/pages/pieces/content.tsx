import React from 'react';

import { ColorTheme } from "../../state/slices/uiSlice";
import { PieceData } from './pieces/pieces';

/*
export const pieces : PieceData[] = [];

for( let i = 0; i < 10; i++ ) {
  pieces.push( {
    name: "Wave wave",

    description: [
      "This is a short description of a digital 3d experiment, generative art or whatever, etc etc",
      (""+i).repeat( 30 )
    ],

    tags: [ i + " tag1", i + " tag2" ],

    Component: React.lazy( () => import( './pieces/retroCore/RetroCorePiece' ) ), 
    colorTheme: ColorTheme.horizon
  })
}
*/

export const introduction = {
  title: "Pieces",
  description: [ 
    "a short description of what I do, the areas of work, artistic ideas, experience, interests,", 
    "what I've done before the purpose of this page, and so on" 
  ]
}