/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

// Developed with the help of wiljw3
// https://www.youtube.com/playlist?list=PLASldBPN_pkBfRXOkBOaeCJYzCnISw5-Z 

const path = require( 'path' );
const fs = require( 'fs' );
const cliProgress = require( 'cli-progress' );

const POSTS_DATA_DIR_PATH = path.join( __dirname, '../src/posts' );

const requiredMetadata = [ 'title', 'keywords', 'date' ];
const allowedMetadata = [ 'title', 'keywords', 'date', 'image' ];

const parseMetadata = ( file, metadataLines ) => {
  const metadata = {};
  metadataLines.forEach( line => {
    let [ name, value ] = line.split( ':' );
    if( !name || !value || !allowedMetadata.includes( name ) ) {
      throw new Error( `Malformed metadata field in file ${ file }` );
    }

    name = name.trim();

    if( name === 'keywords' ) {
      metadata[ name ] = value.split( ',' ).map( category => category.trim() );
    } else if( name === 'date' ) {
      if( ( new Date( value ) == 'Invalid Date' ) ) {
        throw new Error( `Malformed metadata: ${ file } contains an invalid date, ${ value }` );
      } 

      metadata[ name ] = value.trim();
    } else {
      metadata[ name ] = value.trim();
    }

  } );

  requiredMetadata.forEach( name => {
    if( !metadata[ name ] ) {
      throw new Error( `Malformed metadata: ${ file } has no "${ name }" property` );
    }
  } );

  return metadata;
};

const parsePost = ( file, data, index, numberOfPosts ) => {
  // All lines
  const lines = data.split( '\n' );

  // Separators
  const separatorIndices = lines.reduce( ( indices, line, index ) => {
    if ( /^---/.test( line ) ) {
      indices.push( index );
    }
    return indices;
  }, [] );

  if( separatorIndices.length < 3 ) {
    throw new Error( `Malformed formatting in file ${ file }` );
  }

  // Parse metadata
  const metadataLines = lines.slice( 
    separatorIndices[0] + 1, 
    separatorIndices[1]
  );

  const metadata = parseMetadata( file, metadataLines );
  metadata[ 'id' ] = numberOfPosts - index;

  // Parse snippet
  const snippet = lines.slice(
    separatorIndices[1] + 1,
    separatorIndices[2]
  ).join( '\n' );

  // Parse content
  const content = lines.slice( 
    separatorIndices[1] + 1, 
    lines.length
  ).join( '\n' );
 
  return { 
    metadata, 
    snippet: snippet.trim(),
    content 
  };
};

const getPostsData = () => new Promise( ( resolve, reject ) => {
  const posts = [];

  let postsLoaded = 0;
  const progressBar = new cliProgress.SingleBar( 
    {}, cliProgress.Presets.shades_classic
  );

  fs.readdir( POSTS_DATA_DIR_PATH, ( dirError, files ) => {
    if( dirError ) {
      reject( `Failed to list contents of ${ POSTS_DATA_DIR_PATH }` );
      return;
    }

    progressBar.start( files.length, 0 );

    files.forEach( ( file, index ) => {
      fs.readFile( `${ POSTS_DATA_DIR_PATH }/${ file }`, 'utf8', ( fileError, content ) => {
        if( fileError ) {
          reject( `Failed to load file ${ file }` );
          return;
        }

        posts.push( 
          parsePost( file, content, index, files.length ) 
        );

        postsLoaded++;
        progressBar.update( postsLoaded );

        // All posts have been successfully loaded
        if( postsLoaded === files.length ) {
          progressBar.stop();
          resolve( posts );
        }
      } );
    } );
  } );
} );

module.exports = {
  getPostsData
};