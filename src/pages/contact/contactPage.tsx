import React, { useEffect, useRef, useState } from "react";
import { PageRoute } from "../../App";
import GlassCard from "../../components/cards/glass/GlassCard";
import Header from "../../components/header/Header";
import TextInputArea from "../../components/input/area/TextInputArea";
import TextInputField from "../../components/input/field/TextInputField";
import SubmitInput from "../../components/input/submit/SubmitInput";
import Paragraph from "../../components/paragraph/Paragraph";
import { PageProps } from "../PageWrapper";

import './contactPage.scss';

// Thanks to https://stackoverflow.com/a/201378 for regex
const emailValidationRegex = 
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const validationDelay = 700;

const ContactPage = ( { route } : PageProps ) : JSX.Element => {
  // Email and email validation
  const [ email, setEmail ] = useState( "" );
  const [ isEmailValid, setIsEmailValid ] = useState<boolean | undefined>( undefined );
  const validationDelayRef = useRef<NodeJS.Timeout | null>( null );

  // Message 
  const [ message, setMessage ] = useState( "" );

  // Error message
  const [ errorMessage, setErrorMessage ] = useState( "" );

  const validateEmail = ( email : string ) => {
    const isValid = emailValidationRegex.test( email );
    setIsEmailValid( isValid );
    return isValid;
  }

  const cancelDelayedEmailValidation = () => {
    if( validationDelayRef.current ) clearTimeout( validationDelayRef.current );
  }

  const handleSubmit = ( event : React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault();

    let emailValid = isEmailValid;
      // validationDelayRef.current 
      //? validateEmail( email ) 
      // : isEmailValid;

    // cancelDelayedEmailValidation();

    const messageValid = message !== "";

    // TODO prevent user from sending too many emails, since I have limited supply! 

    if( !emailValid && !messageValid )  {
      setErrorMessage( "Invalid email and empty message" );
    } else if ( !emailValid ) {
      setErrorMessage( "Invalid email" );
    } else if ( !messageValid ) {
      setErrorMessage( "Empty message" );
    } else {
      // send email
    }
  }

  const handleEmailInputChange = ( value : string ) => {
    setEmail( value );

    cancelDelayedEmailValidation();

    setIsEmailValid( undefined ); // undefined means pending state, waiting to be validated
    validationDelayRef.current = setTimeout( () => {
      validateEmail( value );
      validationDelayRef.current = null;
    }, validationDelay );
  }

  const handleMessageInputChange = ( value : string ) => {
    setMessage( value );
  }

  useEffect( () => {
    return () => {
      cancelDelayedEmailValidation();
    }
  }, [] );

  useEffect( () => {
    setErrorMessage( "" );
  }, [ email, message ] );

  return (
    <div className="contact-page">
      <Header 
        mainTitle="OBSCURED"
        firstSubtitle="Ways of reaching me"
        mainLevel={ 3 }
        subLevel={ 5 }
        linkTo={ PageRoute.root }
      />

      <main>
        <GlassCard>
          <Header
            mainTitle="Contact me" 
            mainLevel={ 3 }
          />
          <Paragraph>
            Reach me through the contact form below, or using one of the external resources on the side
          </Paragraph>

          <form
            spellCheck={ false } 
            onSubmit={ handleSubmit }
          >
            <div className="contact-page__email-input">
              <TextInputField
                label="Your email"
                onChange={ handleEmailInputChange }
              />

              { email !== "" && isEmailValid === false && (
                <label className="contact-page__invalid-email-message">
                  Invalid Email :( 
                </label>
              )}
            </div>

            <TextInputArea
              label="What you'd like to say"
              onChange={ handleMessageInputChange }
            />

            <div className="contact-page__submit">
              <SubmitInput
                text="Send"
              />

              { errorMessage && (
                <div className="contact-page__error-message">
                  { errorMessage }
                </div>
              )}
            </div>


          </form>


        </GlassCard>

      </main>
    </div>
  )
}

export default ContactPage;