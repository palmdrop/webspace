import React from 'react';
import { ColorTheme } from '../../../state/slices/uiSlice';
import Paragraph from '../../../components/paragraph/Paragraph';
import ExternalLink from '../../../components/link/ExternalLink';

import retroCoreImage from '../../../assets/content/pieces/retro-core.jpg';
import solarChromeImage from '../../../assets/content/pieces/solar-chrome.jpg';
import solarLandscapeImage from '../../../assets/content/pieces/solar-landscape-1.jpg';
import virtualImprintImage from '../../../assets/content/pieces/virtual-imprint.jpg';
import rehashTransformImage from '../../../assets/content/pieces/rehash-transform.jpg';
import flatCloudsImage from '../../../assets/content/pieces/flat-clouds.jpg';
import immerseImage from '../../../assets/content/pieces/immerse.jpg';
import substrateImage from '../../../assets/content/pieces/substrate.jpg';
import rhizomeImage from '../../../assets/content/pieces/rhizome.jpg';
import slicesImage from '../../../assets/content/pieces/slices.jpg';
import skewBulbsImage from '../../../assets/content/pieces/skew-bulbs.jpg';
import noiseConstructImage from '../../../assets/content/pieces/noise-construct.jpg';
import medusaNetworkImage from '../../../assets/content/pieces/medusa-network.jpg';
import blockDissolveImage from '../../../assets/content/pieces/block-dissolve.jpg';

export type PieceProps = { 
  onLoad : ( () => void ) | undefined,
  overlayEnabled ?: boolean,
};

export type Piece = React.FunctionComponent<PieceProps>;
export type PieceData = {
  name : string,
  description : ( string | JSX.Element )[],
  tags : string[],
  image ?: string,

  Component : React.LazyExoticComponent<Piece>,

  colorTheme ?: ColorTheme
}

export const pieces : PieceData[] = [
  {
    name: 'Retro Core',
    description: [
      'An exploration of a particular aesthetic idea, involving plays with perspective and depth.',
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
    tags: [
      'Depth, Geometry'
    ],
    image: retroCoreImage,

    Component: React.lazy( () => import( './retroCore/RetroCorePiece' ) ),
    colorTheme: ColorTheme.horizon
  },
  {
    name: 'Solar Chrome',
    description: [
      'Generative geometry is exciting. Chrome is hip and cool -- modern and punk.',
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
    tags: [
      'Warp, Geometry'
    ],

    image: solarChromeImage,

    Component: React.lazy( () => import( './solarChrome/SolarChromePiece' ) ),
  },
  {
    name: 'Solar Landscape',
    description: [
      'An extension of the Solar Chrome Piece. Experiments with geometry instancing',
      `
      I wanted to 1) try to practice generative composition (with varied results) and 2)
      test what was possible in terms of 3D running in the web. I do not recommend running 
      this piece on a mobile device. 
      `,
    ],
    tags: [
      'Instancing, Composition'
    ],

    image: solarLandscapeImage,

    Component: React.lazy( () => import( './solarLandscape/SolarLandscapePiece' ) ),
  },
  {
    name: 'Virtual Imprint',
    description: [
      'First experiments with a custom shader builds for composing complex domain warping patterns.',
      `I've been working with domain warping for a long time, but only recently using shaders. Since shaders code have some limitations 
      that are not present in "regular" code (like not being able to have loops that iterate a variable number of times), I wanted to
      create a small shader builder library that allows me to work with shaders in a more convenient way.`,
      'Although please note that the use case of this "library" is highly specific and probably not useful for anyone but me.'
    ],
    tags: [
      'Warp, Space'
    ],

    image: virtualImprintImage,

    Component: React.lazy( () => import( './virtualImprint/VirtualImprintPiece' ) ),
  },
  {
    name: 'Rehash Transform',
    description: [
      'An experiment with instanced geometry, shader builders and fake depth.',
      `Beyond technique, I wanted to explore abstract visualization of the human mind on the Internet. When interacting with the web,
       we're in a loop of derivation and creation. I'm endlessly fascinated (and horrified) by how we shape the Internet and how it shapes us in a increasingly rapid feedback loop.
       The Internet is a tool, and our minds are extremely adapt at incorporating tools into itself. A physical tool becomes an extension of
       the body, a mental tool becomes an extension of, well, the mind. This is a topic I'll likely explore further in future pieces or posts.
      `,
      `
       Images are used as source material for the textures. Some of them you might recognize, one way or another.
      `
    ],
    tags: [
      'Web, Mind'
    ],

    image: rehashTransformImage,

    Component: React.lazy( () => import( './rehashTransform/RehashTransformPiece' ) ),
  },
  {
    name: 'Flat Clouds',
    description: [
      'Experiment with soft particles, shader builders, and (once again) generative geometry.',
      `The "soft" aesthetic came as a fairly abstract idea: sometimes I feel foggy and a bit numb. 
      Void of thoughts, at least in that moment. A sheet of strange material.`,
      'Not sure if this means anything. I decided to leave the idea undeveloped. Felt right.'
    ],
    tags: [
      'Warp, Mind'
    ],

    image: flatCloudsImage,

    Component: React.lazy( () => import( './flatClouds/FlatCloudsPiece' ) ),
  },
  {
    name: 'Immerse',
    description: [
      'Back to domain warping, organic substrate and floating geometries.',
      `I envisoned something living and breathing emerging in this environment. This gave me the opportunity to once again play with
      a mix of 2D and 3D. Will probably build on these ideas in the future. I'm also interested in interactivity and procedural animation.`,
      'Also, I ported some of my old domain warping blog posts over to this site. Can be found in the blog section.'
    ],
    tags: [
      'Warp, Organic', 
    ],

    image: immerseImage,

    Component: React.lazy( () => import( './immerse/ImmersePiece' ) ),
  },
  {
    name: 'Substrate',
    description: [
      'Feedback experimentation. Old domain warping techniques complemented with feedback.',
      'Each frame affects how the warp will be applied on the next frame. This sketch contains a couple of randomized sub-sketches. Try refreshing (or pressing SPACE) a couple of times.',
      'When experimenting, a lot of the results were extremely chaotic and unstructured, but always contained surprising variety. I had to reduce the influence of the previous frames to achieve coherence.',
      'But I do enjoy when the piece partly breaks into flickering glitches.'
    ],
    tags: [
      'Warp, Feedback', 
    ],

    image: substrateImage,

    Component: React.lazy( () => import( './substrate/SubstratePiece' ) )
  },
  {
    name: 'Rhizome',
    description: [
      'Rhizome -  all references to Deleuze a bit of a meme, but the underlying structure of this piece rhizomatic nontheless',
      'Exploring some more substrate configurations, along with a space colonization algorithm that grows a rhizome-like structure to fill an area.',
      'The structure is submerged in a "fog", causuing it to fade out as it moves further away from the viewer. I\'m imagining a structure like this one growing out of the background of a future web space of mine.'
    ],
    tags: [
      'Warp, Feedback', 
    ],

    image: rhizomeImage,

    Component: React.lazy( () => import( './rhizome/RhizomePiece' ) )
  },
  {
    name: 'Slices',
    description: [
      <Paragraph key={0}>
        Experiment with 3D CSS, photography and spaces. Located externally, will be opened in an iframe.
        If you prefer, visit the actual page at <ExternalLink link="https://palmdrop.github.io/slices">
          palmdrop.github.io
        </ExternalLink>
      </Paragraph>,
      `I've been thinking about interfaces, what they are, what they are doing to us, and what they could be. 
      There will probably be a blog post on this subject at some point.`,
      'Until then, here\'s an interface for viewing image fragments, or slices. Based on a long-form low-energy photo project I\'ve been working on.',
      'You can right-click and save any image you see.'
    ],
    tags: [
      'Photography, CSS', 
    ],

    image: slicesImage,

    Component: React.lazy( () => import( './slices/SlicesPiece' ) )
  },
  {
    name: 'Skew Bulbs',
    description: [
      'Experiment with trigonometric functions (sin, cos) in combination with noise. I also implemented a method of converting these domain warp experiments to normal maps using an additional shader step.',
      'In this piece, the pattern is first rendered as a normal map, then as a diffusion map (i.e, just color). These maps are applied to a three.js material that is then rendered with a few rotating lights.'
    ],
    tags: [
      'Warp, Trigometry', 
    ],

    image: skewBulbsImage,

    Component: React.lazy( () => import( './skewBulbs/SkewBulbsPiece' ) )
  },
  {
    name: 'Noise Construct',
    description: [
      'Experiment with domain warping and intense dithering -- blue noise.',
      'Strange mix of clearly digital static and organic underlying structures.',
    ],
    tags: [
      'Warp, Noise', 
    ],

    image: noiseConstructImage,

    Component: React.lazy( () => import( './noiseConstruct/NoiseConstructPiece' ) )
  },
  {
    name: 'Medusa Network',
    description: [
      'Building on previous sketch: using static in combination with organic effects, here also adding grids/columns.',
      'Reminded me of snakes or jellyfish, hence "Medusa". Quite enjoying this aesthetic: the mix of glitchy, digital effects and life like movements.',
      'The blue noise also adds a pleasant texture.'
    ],
    tags: [
      'Warp, Noise', 
    ],

    image: medusaNetworkImage,

    Component: React.lazy( () => import( './medusaNetwork/MedusaNetworkPiece' ) )
  },
  {
    name: 'Block Dissolve',
    description: [
      'Mix of previous techniques. Two different kinds of feedback passes combined.',
      'Most of my recent experiments have been based on the same core domain warping and noise modification technique. This one also incorporates the effects used in "Immerse" and "Substrate"'
    ],
    tags: [
      'Warp, Noise, Feedback', 
    ],

    image: blockDissolveImage,

    Component: React.lazy( () => import( './blockDissolve/BlockDissolvePiece' ) )
  },
];

export const FeaturedPieceIndex = pieces.findIndex( pieceData => pieceData.name === 'Retro Core' );
