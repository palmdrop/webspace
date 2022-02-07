import React from 'react';

async function testFunction() {
  const res = await fetch( '/api/email', {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( {
      data: `I'm palmdrop, now is ${ Date.now().toLocaleString() }`
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