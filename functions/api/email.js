export const onRequestPost = async ( context ) => {
  const {
    request,
    env,
    params,
    data
  } = context;

  const postData = {
    message: 'Hello world!',
    request: data
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