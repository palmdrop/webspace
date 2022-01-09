
import React from 'react';

const Post1 = React.lazy( () => import( './post1' ) );

import image1 from '../../../assets/img/rehash-transform/crowd.jpg';

export const images : { [id : number] : string } = {
  1: image1,
};

export const postsData = [
  {
    metadata: {'title':'On Navigating Mind Fog','keywords':'other','date':'Jan 10, 2022','image':'../../../assets/img/rehash-transform/crowd.jpg','id':1},
    snippet: 'The purpose of this blog is intentionally unclear. I want to share thoughts, ideas, and things I create. Most of all I want to force myself to think and explore more deeply. Time will tell how this goes. At this point, everything is under construction. Nothing is clear, but all is open and free to read.',
    Component: Post1
  },
];
  