/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require( 'fs' );
const path = require( 'path' );
const hljs = require( 'highlight.js' );
const marked = require( 'marked' );

const ASSETS_PATH = 'src/assets/';
const IMAGES_PATH = `${ ASSETS_PATH }/posts`;

const BLOG_PATH = 'src/pages/blog';
const POSTS_PATH = `${ BLOG_PATH }/posts`;
const CONFIG_PATH = path.relative( __dirname, 'src/blog-config.json' );

const POST_COMPONENT_PATH = `${ BLOG_PATH }/components/post/Post`;
const ABSOLUTE_POSTS_PATH = path.join( __dirname, '..', POSTS_PATH );
const RELATIVE_POST_COMPONENT_PATH = path.relative( POSTS_PATH, POST_COMPONENT_PATH );

const { getPostsData } = require( './getPostsData' );
const config = require( CONFIG_PATH );

const codeThemePath = ( config && config[ 'code-theme' ] ) 
  ? path.relative( POSTS_PATH, config[ 'code-theme' ] )
  : undefined;

// Configure syntax highlighting for code blocks
const markedRenderer = new marked.Renderer();

marked.setOptions( {
  highlight: function( code, lang ) {
    const language = hljs.getLanguage( lang ) ? lang : 'plaintext';
    return hljs.highlight( code, { language } ).value;
  },
  langPrefix: 'hljs language-',
} );

markedRenderer.link = ( href, title, text ) => {
  return `<a target="_blank" href="${ href }" rel="noopener noreferrer" title="${ title ?? `${ text } - ${ href }` }">${ text }</a>`;
};

/*
markedRenderer.image = ( href, title, text ) => {

}
*/

const processMetadata = ( posts ) => {
  return posts.map( post => {
    const processedMetadata = { ...post.metadata };

    if( processedMetadata.image ) {
      processedMetadata.image = path.relative( POSTS_PATH, path.join( IMAGES_PATH, post.metadata.image ) );
    }

    return {
      ...post,
      metadata: processedMetadata,
    };
  } );
};

// TODO fix indentation
const htmlToReactComponent = ( metadata, html ) => {
  return `import Post from '${ RELATIVE_POST_COMPONENT_PATH }';
${ codeThemePath && (
    `import '${ codeThemePath }';
${ metadata.image ? `import image from '${ metadata.image }';` : '' }`
  ) }

const metadata = ${ JSON.stringify( metadata, null, 2 ).replaceAll( '"', '\'' ) };

const Post${ metadata.id } = () => {
  return (
    <Post 
      metadata={ metadata }
      ${ metadata.image ? 'image={ image }' : '' }
    >
      <div 
        className="post__content"
        dangerouslySetInnerHTML={ { __html: \`${ html }\` } }
      />
    </Post>
  );
};

export default Post${ metadata.id };

`;
};

const createPostsHTML = ( posts ) => {
  return posts.map( ( { metadata, content } ) => {
    // const html = marked.parse( content );
    const html = marked.parse( content, { renderer: markedRenderer } );
    return {
      html: htmlToReactComponent( metadata, html ),
      id: metadata.id
    };
  } );
};

const writeMetadata = ( posts ) => {
  const module = `
import React from 'react';

${ posts.map( ( { metadata } ) => (
    `const Post${ metadata.id } = React.lazy( () => import( './post${ metadata.id }' ) );`
  ) ).join( '\n' ) }

${ posts.map( ( { metadata } ) => {
    if ( metadata.image ) return `import image${ metadata.id } from '${ metadata.image }';`;
    return null;
  } ).filter( line => line ).join( '\n' ) }

export const images : { [id : number] : string } = {
${ posts.map( ( { metadata } ) => {
    if ( metadata.image ) return `  ${ metadata.id }: image${ metadata.id },`;
    return null;
  } ).filter( line => line ).join( '\n' ) }
};

export const postsData = [
${ posts.map( ( { metadata, snippet } ) => `  {
    metadata: ${ JSON.stringify( metadata ).replaceAll( '"', '\'' ) },
    snippet: \`${ snippet }\`,
    Component: Post${ metadata.id }
  },` ).join( '\n' ) }
];
  `;

  fs.writeFileSync( `${ ABSOLUTE_POSTS_PATH }/data.tsx`, module );

  return posts;
};

const writePostsComponents = ( postsHTML ) => {
  postsHTML.forEach( ( { html, id } ) => {
    const filePath = `${ ABSOLUTE_POSTS_PATH }/post${ id }.tsx`;
    fs.writeFileSync( filePath, html );
  } );
};

console.log( ' Building Posts HTML ' );

if ( fs.existsSync( ABSOLUTE_POSTS_PATH ) ) fs.rmSync( ABSOLUTE_POSTS_PATH, { recursive: true } );
fs.mkdirSync( ABSOLUTE_POSTS_PATH );

getPostsData()
  .then( processMetadata )
  .then( posts => {
    writeMetadata( posts );
    return createPostsHTML( posts );
  } )
  .then( writePostsComponents )
  .catch( error => {
    console.error( error );
  } );