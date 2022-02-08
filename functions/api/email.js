// Tutorial: https://developers.cloudflare.com/pages/tutorials/build-an-api-with-workers
// emailjs public api: https://www.emailjs.com/docs/rest-api/send/

export const onRequestPost = async ( context ) => {
  const {
    request,
    env,
  } = context;
  
  const userID = await env.EMAILJS.get( 'USER_ID' );
  const templateID = await env.EMAILJS.get( 'TEMPLATE_ID' );
  const serviceID = await env.EMAILJS.get( 'SERVICE_ID' );

  const { 
    email,
    message
  } = await request.json();

  // const res = await request.json();
  const data = {
    type: 'POST',
    data: {
      service_id: serviceID,
      template_id: templateID,
      user_id: userID,
      template_params: {
        'user_email': email,
        'message': message
      }
    }
  };

  let result;

  try {
    result = await fetch( 'https://api.emailjs.com/api/v1.0/email/send', {
      body: JSON.stringify( data ),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    } );
  } catch ( error ) {
    result = error;
  }

  result.email = email;
  result.message = message;

  return new Response( 
    JSON.stringify( result ),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};