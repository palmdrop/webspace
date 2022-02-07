// Tutorial: https://developers.cloudflare.com/pages/tutorials/build-an-api-with-workers

export const onRequestPost = async ( context ) => {
  const {
    request,
    env,
    params,
    data
  } = context;

  const postData = {
    message: 'Hello world!',
    request,
    SECRET: env.TESTING.get( 'data' )
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