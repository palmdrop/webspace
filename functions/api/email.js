// Tutorial: https://developers.cloudflare.com/pages/tutorials/build-an-api-with-workers

export const onRequestPost = async ( context, other ) => {
  const {
    request,
    env,
    params,
    data
  } = context;
  
  const secret = await env.TESTING.get( 'data' );
  const res = await request.json();
  const postData = {
    message: 'Hello world!',
    request,
    secret,
    params,
    other,
    data,
    res
  };


  return new Response( 
    JSON.stringify( postData ),
    {
      headers: {
        'content-type': 'application/json'
      }
    }
  );
};

export const onRequestGet = onRequestPost;
export const onRequestPut = onRequestPost;