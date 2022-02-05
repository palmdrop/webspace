export const onRequestPost = async ( context ) => {
  const {
    request,
    env,
    params,
    data
  } = context;

  return new Response( 'Hello world!' );
};

export const onRequestGet = onRequestPost;