
import React from 'react';

const Post1 = React.lazy( () => import( './post1' ) );
const Post2 = React.lazy( () => import( './post2' ) );
const Post3 = React.lazy( () => import( './post3' ) );
const Post4 = React.lazy( () => import( './post4' ) );

export const postsData = [
  {
    metadata: {'title':'Test post','keywords':'art, c2, c3','date':'Nov 21, 2021','image':'../../../assets/img/rehash-transform/crowd.jpg','id':1},
    snippet: `undefined`,
    Component: Post1
  },
  {
    metadata: {'title':'Test post 2','keywords':'tech, c3','date':'Nov 23, 2021','id':2},
    snippet: `undefined`,
    Component: Post2
  },
  {
    metadata: {'title':'Test post 3','keywords':'internet, c4','date':'Nov 22, 2021','id':3},
    snippet: `undefined`,
    Component: Post3
  },
  {
    metadata: {'title':'Test post 4','keywords':'other, c5','date':'Nov 26, 2021','id':4},
    snippet: `undefined`,
    Component: Post4
  },
];
  