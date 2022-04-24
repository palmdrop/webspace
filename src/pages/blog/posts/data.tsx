
import React from 'react';

const Post7 = React.lazy( () => import( './post7' ) );
const Post6 = React.lazy( () => import( './post6' ) );
const Post5 = React.lazy( () => import( './post5' ) );
const Post4 = React.lazy( () => import( './post4' ) );
const Post3 = React.lazy( () => import( './post3' ) );
const Post2 = React.lazy( () => import( './post2' ) );
const Post1 = React.lazy( () => import( './post1' ) );

import image7 from '../../../assets/posts/alien-patterns.jpg';
import image6 from '../../../assets/posts/characteristics-of-modified-noise.jpg';
import image5 from '../../../assets/posts/consumption-production-and-play.jpg';
import image4 from '../../../assets/posts/homes-and-the-creek.jpg';
import image3 from '../../../assets/posts/illuminating-horror-of-ai-art.jpg';
import image2 from '../../../assets/posts/my-take-on-domain-warping.jpg';
import image1 from '../../../assets/posts/on-navigating-brain-fog.jpg';

export const images : { [id : number] : string } = {
  7: image7,
  6: image6,
  5: image5,
  4: image4,
  3: image3,
  2: image2,
  1: image1,
};

export const postsData = [
  {
    metadata: {'title':'Alien Patterns','keywords':['genart','noise','perlin','simplex','procedural','patterns'],'date':'2022-01-13','image':'../../../assets/posts/alien-patterns.jpg','id':7},
    snippet: `[OLD POST] Combining domain warping and modified noise functions can produce extremely detailed and varied alien-like textures and shapes. This post is a peek into how I've been using these techniques to create pieces of generative art.`,
    Component: Post7
  },
  {
    metadata: {'title':'Characteristics of Modified Noise','keywords':['genart','noise','perlin','simplex','procedural'],'date':'2022-01-12','image':'../../../assets/posts/characteristics-of-modified-noise.jpg','id':6},
    snippet: `[OLD POST] Regular gradient noise, such as Perlin and Simplex noise, is extremely useful for procedurally generating textures, flowfields, heightmaps, etc. But a texture or heightmap created using plain noise is rarely that interesting. Often, noise is modified or used in unique, creative ways.`,
    Component: Post6
  },
  {
    metadata: {'title':'Consumption, Production and Play','keywords':['words','web','play','Internet','capitalism'],'date':'2022-02-17','image':'../../../assets/posts/consumption-production-and-play.jpg','id':5},
    snippet: `I've lost all sense of pacing. I want to do everything but I can only do nothing. There's resistance, desire, and shame. This post is a semi-structured stream of thoughts about creativity, happiness, cultural drives, and play. These thoughts will hopefully be developed in future posts.`,
    Component: Post5
  },
  {
    metadata: {'title':'Homes and the Creek','keywords':['words'],'date':'2022-03-14','image':'../../../assets/posts/homes-and-the-creek.jpg','id':4},
    snippet: `We lived by the creek. We constructed intricate weaves of sticks, debris, and the long grass that had been cut from the football field. In our huts, we spent most of our spare time. As we grew older, our projects became larger and more complex. At some point, we stopped.`,
    Component: Post4
  },
  {
    metadata: {'title':'The Illuminating Horror of AI Art','keywords':['words'],'date':'2022-04-28','image':'../../../assets/posts/illuminating-horror-of-ai-art.jpg','id':3},
    snippet: `AI art is often eerie. Beautiful, but eerie, which I think reveals something about the inner mechanisms of today's AI. The featured image of this post is an artwork by the artist Mario Klingeman.`,
    Component: Post3
  },
  {
    metadata: {'title':'My Take on Domain Warping','keywords':['genart'],'date':'2022-01-10','image':'../../../assets/posts/my-take-on-domain-warping.jpg','id':2},
    snippet: `[OLD POST] Domain warping: a procedural method for generating natural-looking patterns and shapes. I've used this technique for a long time, and the results can be beautiful and strangely organic. This post will explore my (slightly different) approach, and some of the images this approached helped produce.`,
    Component: Post2
  },
  {
    metadata: {'title':'On Navigating Brain Fog','keywords':['first','intro','brain fog'],'date':'2022-01-09','image':'../../../assets/posts/on-navigating-brain-fog.jpg','id':1},
    snippet: `The purpose of this blog is intentionally unclear. I want to share thoughts, ideas, and things I create. Most of all, I want to force myself to think and explore more deeply. Time will tell how this goes. Everything is under construction, always.`,
    Component: Post1
  },
];
  