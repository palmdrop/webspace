import { postsData } from './posts/data';
import blogConfig from '../../blog-config.json';
import { PostData, PostMetadata } from './components/post/Post';

export const categories = [ 
  ...blogConfig[ 'categories' ], 
  ( blogConfig['default-category'] || 'other' ) 
] as const;

export const allPostsData = ( postsData as unknown as PostData[] )
  .sort( ( p1, p2 ) => {
    // NOTE: Inefficient to allocate new date object when sorting, especially if number of posts grows large
    return new Date( p1.metadata.date ).getTime() - new Date( p2.metadata.date ).getTime();
  } );

export const postDataByCategory = allPostsData.reduce( ( acc, data ) => {
  const category = data.metadata.keywords[ 0 ];
  if ( !acc[ category ] ) acc[ category ] = [];
  acc[ category ].push( data );
  return acc;
}, {} as { [category : string] : PostData[] } );

const months = [
  'jan',
  'feb',
  'mar',
  'apr',
  'maj',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
];

export const formatDate = ( dateString : string ) => {
  const date = new Date( dateString );
  const day = date.getUTCDate();
  const month = date.getUTCMonth( );
  const year = date.getUTCFullYear();

  return `${ months[ month - 1 ] } ${ day }, ${ year }`;
};