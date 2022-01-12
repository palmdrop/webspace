
import React from 'react';

const Post2 = React.lazy( () => import( './post2' ) );
const Post1 = React.lazy( () => import( './post1' ) );

import image2 from '../../../assets/posts/my-take-on-domain-warping/main.jpg';
import image1 from '../../../assets/posts/on-navigating-brain-fog/main.jpg';

export const images : { [id : number] : string } = {
  2: image2,
  1: image1,
};

export const postsData = [
  {
    metadata: {'title':'My Take on Domain Warping','keywords':['generative'],'date':'2022-01-10','image':'../../../assets/posts/my-take-on-domain-warping/main.jpg','id':2},
    snippet: `[OLD POST] Domain warping: a procedural method for generating natural-looking patterns and shapes. I've used this technique for a long time, and the results can be beautiful and strangely organic. This post will explore my (slightly different) approach, and some of the images this approached helped produce.`,
    Component: Post2
  },
  {
    metadata: {'title':'On Navigating Brain Fog','keywords':['first','intro','brain fog'],'date':'2022-01-09','image':'../../../assets/posts/on-navigating-brain-fog/main.jpg','id':1},
    snippet: `The purpose of this blog is intentionally unclear. I want to share thoughts, ideas, and things I create. Most of all, I want to force myself to think and explore more deeply. Time will tell how this goes. Everything is under construction, always.`,
    Component: Post1
  },
];
  