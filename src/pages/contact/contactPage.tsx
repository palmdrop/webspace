import React, { useEffect, useRef, useState } from "react";

import { sendFormEmail, validateEmail } from "../../utils/email";

import { PageRoute } from "../../App";
import { PageProps } from "../PageWrapper";

import GlassCard from "../../components/cards/glass/GlassCard";
import Header from "../../components/header/Header";
import TextInputArea from "../../components/input/area/TextInputArea";
import TextInputField from "../../components/input/field/TextInputField";
import SubmitInput from "../../components/input/submit/SubmitInput";
import HomeBar from "../../components/navigation/home/HomeBar";
import Paragraph from "../../components/paragraph/Paragraph";

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle5.svg';

import './contactPage.scss';

enum Status {
  WAITING,
  SEND_SUCCESSFUL,
  SEND_FAILED,
  INPUT_ERROR,
}

const invalidEmailErrorMessage   = "Invalid Email :( ";
const invalidMessageErrorMessage = "Include some unironic CONTENT before sending";
const successMessage = "Email sent successfully";

const validationDelay = 700;

const ContactPage = ( { route } : PageProps ) : JSX.Element => {
  const formRef = useRef<HTMLFormElement>( null );

  // Form content and status
  const [ email, setEmail ] = useState( "" );
  const [ message, setMessage ] = useState( "" );
  const [ formStatus, setFormStatus ] = useState( Status.WAITING );

  // Input validation
  const [ isEmailValid, setIsEmailValid ] = useState<boolean | undefined>( undefined );
  const validationDelayRef = useRef<NodeJS.Timeout | null>( null );

  // User feedback 
  const [ errorMessage, setErrorMessage ] = useState( "" );

  
  const cancelDelayedEmailValidation = () => {
    if( validationDelayRef.current ) clearTimeout( validationDelayRef.current );
  }

  const handleSubmit = ( event : React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault();

    cancelDelayedEmailValidation();
    const emailValid = validateEmail( email );
    setIsEmailValid( emailValid );

    const messageValid = message !== "";

    // TODO prevent user from sending too many emails, since I have limited supply! 

    if( !messageValid || !emailValid ) {
      setFormStatus( Status.INPUT_ERROR );
    }

    if( !messageValid ) {
      setErrorMessage( invalidMessageErrorMessage );
    } else if( messageValid && emailValid ) {
      // Send email
      sendFormEmail( 
        formRef.current as HTMLFormElement 
      ).then( ( response ) => {
        setFormStatus( Status.SEND_SUCCESSFUL );
      }, ( error ) => {
        setFormStatus( Status.SEND_FAILED );
      })
    }
  }

  const handleEmailInputChange = ( value : string ) => {
    setEmail( value );

    cancelDelayedEmailValidation();

    setIsEmailValid( undefined ); // undefined means pending state, waiting to be validated
    validationDelayRef.current = setTimeout( () => {
      setIsEmailValid( validateEmail( value ) );
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
    setFormStatus( Status.WAITING );
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
          >
            <Obstacle className="contact-page__obstacle" />
          </Header>
          <Paragraph>
            Reach me through the contact form below, or using one of the external resources on the side
          </Paragraph>

          <form
            spellCheck={ false } 
            onSubmit={ handleSubmit }
            ref={ formRef }
          >
            <div className="contact-page__email-input">
              <TextInputField
                label="Your email"
                name="user_email"
                onChange={ handleEmailInputChange }
              />

              { ( email !== "" || formStatus === Status.INPUT_ERROR ) && isEmailValid === false && (
                <label className="contact-page__invalid-email-message">
                  { invalidEmailErrorMessage }
                </label>
              )}
            </div>

            <TextInputArea
              label="What you'd like to say"
              name="message"
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

              { !errorMessage && formStatus === Status.SEND_SUCCESSFUL && (
                <div className="contact-page__success-message">
                  { successMessage }
                </div>
              )}
            </div>
          </form>
        </GlassCard>

      </main>
      <aside className="contact-page__aside" >
        <HomeBar />
      </aside>
    </div>
  )
}

export default ContactPage;