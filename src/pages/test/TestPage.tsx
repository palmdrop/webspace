import React from 'react';

async function testFunction() {
  const res = await fetch( '/api/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify( {
      content: 'post this please'
    } )
  } );
  const json = await res.json();
  return json;
}

const TestPage = () => {
  // const { data, error } = useSWR( '/api/email' );
  React.useEffect( () => {
    testFunction().then( result => {
      console.log( 'Fetch succeeded' );
      console.log( result );
    } ).catch( error => {
      console.log( 'Fetch failed' );
      console.error( error );
    } );
  }, [] );

  return (
    <div>
      Test page
    </div>
  );
};

export default TestPage;