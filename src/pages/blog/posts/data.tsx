
import React from 'react';

const Post4 = React.lazy( () => import( './post4' ) );
const Post3 = React.lazy( () => import( './post3' ) );
const Post2 = React.lazy( () => import( './post2' ) );
const Post1 = React.lazy( () => import( './post1' ) );

import image4 from '../../../assets/posts/alien-patterns.jpg';
import image3 from '../../../assets/posts/characteristics-of-modified-noise.jpg';
import image2 from '../../../assets/posts/my-take-on-domain-warping.jpg';
import image1 from '../../../assets/posts/on-navigating-brain-fog.jpg';

export const images : { [id : number] : string } = {
  4: image4,
  3: image3,
  2: image2,
  1: image1,
};

export const postsData = [
  {
    metadata: {'title':'Alien Patterns','keywords':['genart','noise','perlin','simplex','procedural','patterns'],'date':'2022-01-13','image':'../../../assets/posts/alien-patterns.jpg','id':4},
    snippet: `[OLD POST] Combining domain warping and modified noise functions can produce extremely detailed and varied alien-like textures and shapes. This post is a peek into how I've been using these techniques to create pieces of generative art.`,
    Component: Post4
  },
  {
    metadata: {'title':'Characteristics of Modified Noise','keywords':['genart','noise','perlin','simplex','procedural'],'date':'2022-01-12','image':'../../../assets/posts/characteristics-of-modified-noise.jpg','id':3},
    snippet: `[OLD POST] Regular gradient noise, such as Perlin and Simplex noise, is extremely useful for procedurally generating textures, flowfields, heightmaps, etc. But a texture or heightmap created using plain noise is rarely that interesting. Often, noise is modified or used in unique, creative ways.`,
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
  