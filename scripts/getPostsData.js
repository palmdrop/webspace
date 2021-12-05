// Developed with the help of wiljw3
// https://www.youtube.com/playlist?list=PLASldBPN_pkBfRXOkBOaeCJYzCnISw5-Z 

const path = require( "path" );
const fs = require( "fs" );
const cliProgress = require( "cli-progress" );

const postsDataDirPath = path.join( __dirname, "../src/posts" );

const allowedMetadata = [ 'title', 'keywords', 'date', 'image' ];
const requiredMetadata = [ 'title', 'keywords', 'date' ];

const parseMetadata = ( file, metadataLines ) => {
  const metadata = {}
  metadataLines.forEach( line => {
    let [ name, value ] = line.split( ":" );
    if( !name || !value || !allowedMetadata.includes( name ) ) {
      throw new Error( `Malformed metadata field in file ${ file }` );
    }

    name = name.trim()

    if( name === 'keywords' ) {
      metadata[ name ] = value.split( ',' ).map(category => category.trim());
    } else if( name === 'date' ) {
      if( ( new Date( value ) == 'Invalid Date' ) ) {
        throw new Error( `Malformed metadata: ${ file } contains an invalid date, ${ value }` );
      }
    } 

    metadata[ name ] = value.trim();
  });

  requiredMetadata.forEach( name => {
    if( !metadata[ name ] ) {
      throw new Error( `Malformed metadata: ${ file } has no "${ name }" property` );
    }
  })

  return metadata;
}

const parsePost = ( file, data, index ) => {
  const lines = data.split( "\n" );

  const metadataIndices = lines.reduce( ( indices, line, index ) => {
    if ( /^---/.test( line ) ) {
      indices.push( index );
    }
    return indices;
  }, [])

  if( metadataIndices.length !== 2 ) {
    throw new Error( `Malformed metadata in file ${ file }` );
  }

  const metadataLines = lines.slice( 
    metadataIndices[0] + 1, 
    metadataIndices[1]
  );

  const metadata = parseMetadata( file, metadataLines );
  metadata[ 'id' ] = index + 1;

  const content = lines.slice( 
    metadataIndices[1] + 1, 
    lines.length
  ).join( "\n" );
 
  return { 
    metadata, 
    content 
  };
}

const getPostsData = () => new Promise( ( resolve, reject ) => {
  const posts = [];

  let postsLoaded = 0;
  const progressBar = new cliProgress.SingleBar( 
    {}, cliProgress.Presets.shades_classic
  );

  fs.readdir( postsDataDirPath, ( dirError, files ) => {
    if( dirError ) {
      reject( `Failed to list contents of ${ postsDataDirPath }` );
      return;
    }

    progressBar.start( files.length, 0 );

    files.forEach( ( file, index ) => {
      fs.readFile( `${ postsDataDirPath }/${ file }`, "utf8", ( fileError, content ) => {
        if( fileError ) {
          reject( `Failed to load file ${ file }` );
          return;
        }

        posts.push( 
          parsePost( file, content, index ) 
        );

        postsLoaded++;
        progressBar.update( postsLoaded );

        // All posts have been successfully loaded
        if( postsLoaded === files.length ) {
          progressBar.stop();
          resolve( posts );
        }
      });
    });
  });
})

module.exports = {
  getPostsData
}