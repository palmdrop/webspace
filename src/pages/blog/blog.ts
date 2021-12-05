import { postsData } from "./posts/data";
import blogConfig from '../../blog-config.json';
import { PostMetadata } from "./components/post/Post";

export const categories = [ 
  ...blogConfig[ "categories" ], 
  ( blogConfig["default-category"] || "other" ) 
] as const;

export const allPostsMetadata = postsData
  .map( ( { metadata } ) => metadata )
  .sort( ( m1, m2 ) => {
    // NOTE: Inefficient to allocate new date object when sorting, especially if number of posts grows large
    return new Date( m1.date ).getTime() - new Date( m2.date ).getTime()
  });

export const postMetadataByCategory = allPostsMetadata.reduce( ( acc, metadata ) => {
  const category = metadata.keywords[ 0 ];
  if ( !acc[ category ] ) acc[ category ] = [];
  acc[ category ].push( metadata );
  return acc;
}, {} as { [category : string] : PostMetadata[] });