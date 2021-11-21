import React from "react";
import { ColorTheme } from "../../../state/slices/uiSlice";

import retroCoreImage from '../../../assets/content/pieces/retro-core.jpg';
import solarChromeImage from '../../../assets/content/pieces/solar-chrome.jpg';
import solarLandscapeImage from '../../../assets/content/pieces/solar-landscape-1.jpg';
import virtualImprintImage from '../../../assets/content/pieces/virtual-imprint.jpg';
import rehashTransformImage from '../../../assets/content/pieces/rehash-transform.jpg';

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
      "Depth, Geometry"
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
      "Warp, Geometry"
    ],

    image: solarChromeImage,

    Component: React.lazy( () => import( './solarChrome/SolarChromePiece' ) ),
  },
  {
    name: "Solar Landscape",
    description: [
      "An extension of the Solar Chrome Piece. Experiments with geometry instancing",
      `
      I wanted to 1) try to practice generative composition (with varied results) and 2)
      test what was possible in terms of 3D running in the web. I do not recommend running 
      this piece on a mobile device. 
      `,
    ],
    tags : [
      "Instancing, Composition"
    ],

    image: solarLandscapeImage,

    Component: React.lazy( () => import( './solarLandscape/SolarLandscapePiece' ) ),
  },
  {
    name: "Virtual Imprint",
    description: [
      `First experiments with a custom shader builds for composing complex domain warping patterns.`,
      `I've been working with domain warping for a long time, but only recently using shaders. Since shaders code have some limitations 
      that are not present in "regular" code (like not being able to have loops that iterate a variable number of times), I wanted to
      create a small shader builder library that allows me to work with shaders in a more convenient way.`,
      `Although please note that the use case of this "library" is highly specific and probably not useful for anyone but me.`
    ],
    tags : [
      "Warp, Space"
    ],

    image: virtualImprintImage,

    Component: React.lazy( () => import( './virtualImprint/VirtualImprintPiece' ) ),
  },
  {
    name: "Rehash Transform",
    description: [
      `An experiment with instanced geometry, shader builders and fake depth.`,
      `Beyond technique, I wanted to explore abstract visualization of the human mind on the Internet. When interacting with the web,
       we're in a loop of derivation and creation. I'm endlessly fascinated (and horrified) by how we shape the Internet and how it shapes us in a increasingly rapid feedback loop.
       The Internet is a tool, and our minds are extremely adapt at incorporating tools into itself. A physical tool becomes an extension of
       the body, a mental tool becomes an extension of, well, the mind. This is a topic I'll likely explore further in future pieces or posts.
      `,
      `
       Images are used as source material for the textures. Some of them you might recognize, one way or another.
      `
    ],
    tags : [
      "Web, Mind"
    ],

    image: rehashTransformImage,

    Component: React.lazy( () => import( './rehashTransform/RehashTransformPiece' ) ),
  },
]

export const FeaturedPieceIndex = pieces.findIndex( pieceData => pieceData.name === 'Retro Core' );
