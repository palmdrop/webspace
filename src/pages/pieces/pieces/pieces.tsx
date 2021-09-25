import React from "react";
import { ColorTheme } from "../../../state/slices/uiSlice";

import retroCoreImage from '../../../assets/content/pieces/retro-core/img1.png';
import solarChromeImage from '../../../assets/content/pieces/solar-chrome/img1.png';

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
    "Generative geometry is exciting. Chrome is hip and cool. Modern and punk.",
    `
      I've been for a long time developing personal techniques based on perlin/simplex noise, domain warping,
      recursion, and so on. Combining these with 3d creates interesting results. Simple geometrical shapes, like
      spheres, are distorted using some underlying noise field. The result is alien.
    `,
    `
      I especiall like the moments when the smooth, polished surface breaks down under too much distortion, and 
      reveals the underlying digital geometry -- the mesh of triangles, a sense of something being unveiled. 
    `,
    `
      In addition to this, I'd like to explore something futuristic, something not necessarily hopeful, but other.
      Modern popular aesthetics seem to resort to the retro, and although this surely can be extremely striking and imaginative,
      it's in certain ways always retrograde. I don't want to be feel stuck in a loop.
    `
  ],
  tags : [
    "3d", "Warp"
  ],

  image: solarChromeImage,

  Component: React.lazy( () => import( './solarChrome/SolarChromePiece' ) ),
}

export const FeaturedPieceIndex = 0;
