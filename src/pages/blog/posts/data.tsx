
import React from 'react';

const Post1 = React.lazy( () => import( './post1' ) );
const Post2 = React.lazy( () => import( './post2' ) );

export const postsData = [
  
  {
    metadata: { 'title': 'Test post','date': 'Nov 21, 2021','id': 1 },
    Component: Post1
  },

  {
    metadata: { 'title': 'Test post 2','date': 'Nov 21, 2021','id': 2 },
    Component: Post2
  },
];
  