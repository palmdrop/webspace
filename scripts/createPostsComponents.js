const { getPostsData } = require( './getPostsData' );

const fs = require( "fs" );
const path = require( "path" );

const marked = require( "marked" );
const hljs = require( "highlight.js" );

const postsOutputPath = path.join( __dirname, "../src/pages/blog/posts" );
const config = require( "../blog-config.json" );

// Configure syntax highlighting for code blocks
marked.setOptions({
  highlight: function( code, lang ) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight( code, { language } ).value;
  },
  langPrefix: 'hljs language-',
});

const htmlToReactComponent = ( metadata, html ) => {
  return `
import Post from '../posts';
${ config && config[ "code-theme" ] && (
  `import \"${ config[ "code-theme" ] }\";`
)}

const metadata = ${ JSON.stringify( metadata, null, 2 ) };

const Post${ metadata.id } = () => {
  return (
    <Post metadata={ metadata }>
      <div dangerouslySetInnerHTML={ { __html: \`${ html }\` } }/>
    </Post>
  )
}

export default Post${ metadata.id };

`;
}

const createPostsHTML = ( posts ) => {
  return posts.map( ( { metadata, content } ) => {
    const html = marked.parse( content );
    return {
      html: htmlToReactComponent( metadata, html ),
      id: metadata.id
    };
  })
}

const writeMetadata = ( posts ) => {
  const module = `
import React from 'react';

${ posts.map( ( { metadata } ) => (
    `const Post${ metadata.id } = React.lazy( () => import( './post${ metadata.id }' ) );`
)).join( "\n" ) }

export const postsData = [
  ${ posts.map( ( { metadata } ) => `
    {
      metadata: ${ JSON.stringify( metadata ) },
      Component: Post${ metadata.id }
    },`).join( "\n" ) }
];
  `;

  fs.writeFileSync( `${ postsOutputPath }/data.tsx`, module );

  return posts;
}

const writePostsComponents = ( postsHTML ) => {
  postsHTML.forEach( ( { html, id } ) => {
    const filePath = `${ postsOutputPath }/post${ id }.tsx`;
    fs.writeFileSync( filePath, html )
  });
}

console.log( " Building Posts HTML ");

if ( fs.existsSync( postsOutputPath ) ) fs.rmSync( postsOutputPath, { recursive: true } );
fs.mkdirSync( postsOutputPath );

getPostsData()
  .then( posts => {
    writeMetadata( posts );
    return createPostsHTML( posts );
  })
  .then( writePostsComponents )
  .catch( error => {
    console.error( error );
  });