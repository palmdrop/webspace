import React from "react";
import { ColorTheme } from "../../../state/slices/uiSlice";

import retroCoreImage from '../../../assets/content/pieces/retro-core.jpg';
import solarChromeImage from '../../../assets/content/pieces/solar-chrome.jpg';
import solarLandscapeImage from '../../../assets/content/pieces/solar-landscape-1.jpg';

export type PieceProps = { 
  onLoad : ( () => void ) | undefined,
};

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

export const pieces : PieceData[] = [
  {
    name: "Retro Core",
    description: [
      `An exploration of a particular aesthetic idea, involving plays with perspective and depth.`,
      `3D shapes are turned flat using transparency and disabled depth testing,
       Both the inside and the outside of the shapes are rendered. The 
       visible sides blend as the shapes rotate.
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
  },
  {
    name: "Solar Chrome",
    description: [
      "Generative geometry is exciting. Chrome is hip and cool -- modern and punk.",
      `
        For a long time I've been developing techniques based on perlin/simplex noise and domain warping. Combining 
        these techniques with 3D geometry produces interesting shapes. This piece consists of spheres or toruses that are distorted
        using underlying noise fields. The results are alien.
      `,
      `
        I especially like the moments when the smooth, polished surface breaks down under too much distortion. 
        This reveals the underlying, very digital geometry. 
      `
    ],
    tags : [
      "3d", "Warp"
    ],

    image: solarChromeImage,

    Component: React.lazy( () => import( './solarChrome/SolarChromePiece' ) ),
  },
  {
    name: "Solar Landscape",
    description: [
      "An extension of the Solar Chrome Piece. An exercise in generative composition.",
      `
        This piece is a work in process.
      `,
    ],
    tags : [
      "3d", "Warp"
    ],

    image: solarLandscapeImage,

    Component: React.lazy( () => import( './solarLandscape/SolarLandscapePiece' ) ),
  }
]

export const FeaturedPieceIndex = 0;
