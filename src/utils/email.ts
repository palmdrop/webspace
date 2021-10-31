import emailjs from 'emailjs-com';

const { 
  REACT_APP_EMAILJS_USER_ID : userID,
  REACT_APP_EMAILJS_SERVICE_ID : serviceID,
  REACT_APP_EMAILJS_TEMPLATE_ID : templateID,
} = process.env;

// Thanks to https://stackoverflow.com/a/201378 for regex
const emailValidationRegex = 
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

// EmailJS
emailjs.init( userID as string );

export const isValidEmail = ( email : string ) => {
  return emailValidationRegex.test( email );
}

export const sendFormEmail = ( form : HTMLFormElement ) => {
  return emailjs.sendForm( 
    serviceID as string,
    templateID as string,
    form,
    userID
  );
}

