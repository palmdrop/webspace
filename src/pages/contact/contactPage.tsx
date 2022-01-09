/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { sendFormEmail, isValidEmail } from '../../utils/email';

import { PageRoute } from '../../App';

import GlassCard from '../../components/cards/glass/GlassCard';
import Header from '../../components/header/Header';
import TextInputArea from '../../components/input/area/TextInputArea';
import TextInputField from '../../components/input/field/TextInputField';
import SubmitInput from '../../components/input/submit/SubmitInput';
import HomeBar from '../../components/navigation/home/HomeBar';
import Paragraph from '../../components/paragraph/Paragraph';
import ExternalLink from '../../components/link/ExternalLink';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle5.svg';

import './contactPage.scss';
import { githubIconData, IconData, instagramIconData, mailIconData } from '../../assets/external-icons';
import { useMemoizedDebounce } from '../../hooks/useMemoizedDebounce';
import StarLoader from '../../components/loader/starLoader/StarLoader';

enum Status {
  IDLE,
  SEND_PENDING,
  SEND_SUCCESSFUL,
  SEND_FAILED,
  INPUT_ERROR,
}

const invalidEmailErrorMessage = 'Invalid Email :( ';
const invalidMessageErrorMessage = 'Include some unironic CONTENT before sending';
const sendFailedMessage = 'Email NOT sent. Please try again.';
const successMessage = 'Email sent successfully';

const validationDelay = 700;

const icons : IconData[] = [
  instagramIconData,
  githubIconData,
  mailIconData
];

const ContactPage = () : JSX.Element => {
  const formRef = useRef<HTMLFormElement>( null );

  // Form content and status
  const [ email, setEmail ] = useState( '' );
  const [ message, setMessage ] = useState( '' );
  const [ formStatus, setFormStatus ] = useState( Status.IDLE );
  const [ errorResponseActive, setErrorResponseActive ] = useState( false );

  // Input validation
  const [ isEmailValid, setIsEmailValid ] = useState<boolean | undefined>( undefined );

  // User feedback 
  const [ errorMessage, setErrorMessage ] = useState( '' );

  const handleSubmit = ( event : React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault();

    validateEmailDebounced.cancel();
    const emailValid = validateEmail( email );

    const messageValid = message !== '';

    // TODO prevent user from sending too many emails, since I have limited supply! 
    if( !messageValid || !emailValid ) {
      setFormStatus( Status.INPUT_ERROR );
      setErrorResponseActive( true );
      setTimeout( () => {
        setErrorResponseActive( false ); 
      }, 1000 );
    }

    if( !messageValid ) {
      setErrorMessage( invalidMessageErrorMessage );
    } else if( messageValid && emailValid ) {
      setFormStatus( Status.SEND_PENDING );
      // Send email
      sendFormEmail( 
        formRef.current as HTMLFormElement 
      ).then( () => {
        setFormStatus( Status.SEND_SUCCESSFUL );
      }, ( error ) => {
        setFormStatus( Status.SEND_FAILED );
        console.error( error );
      } );
    }
  };

  const validateEmail = useCallback( ( value : string ) => {
    const valid = isValidEmail( value );
    setIsEmailValid( valid );
    return valid;
  }, [ setIsEmailValid ] );

  const validateEmailDebounced = useMemoizedDebounce( validateEmail, validationDelay, [ validateEmail ] );

  const handleEmailInputChange = ( value : string ) => {
    setEmail( value );
    setIsEmailValid( undefined ); 
    validateEmailDebounced( value );
  };

  const handleMessageInputChange = ( value : string ) => {
    setMessage( value );
  };

  useEffect( () => {
    return () => validateEmailDebounced.cancel();
  }, [ validateEmailDebounced ] );

  useEffect( () => {
    setErrorMessage( '' );
    setFormStatus( Status.IDLE );
  }, [ email, message ] );

  return (
    <div className="contact-page">
      <Header 
        mainTitle="OBSCURED"
        firstSubtitle="Contact me"
        mainLevel={ 3 }
        subLevel={ 5 }
        linkTo={ PageRoute.root }
      />

      <main className={ `contact-page__main ${ errorResponseActive ? 'contact-page__main--error' : '' }`}>
        <GlassCard>
          <div className="contact-page__header-container">
            <Header
              mainTitle="Contact me" 
              mainLevel={ 3 }
            >
              <Obstacle className="contact-page__obstacle" />
            </Header>

            <GlassCard>
              { icons.map( ( icon, index ) => (
                <ExternalLink
                  link={ icon.link }
                  key={ `${ icon.link }-${ index }` }
                >
                  <img src={ icon.src } alt={ icon.alt } />
                </ExternalLink>
              ) )}
            </GlassCard>
          </div>

          <Paragraph>
            I'm Anton. Reach me through the contact form below, or at <ExternalLink link="mailto:contact.palmdrop@gmail.com">contact.palmdrop@gmail.com</ExternalLink>
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

              { ( email !== '' || formStatus === Status.INPUT_ERROR ) && isEmailValid === false && (
                <label className="contact-page__invalid-email-message">
                  { invalidEmailErrorMessage }
                </label>
              )}
            </div>

            <TextInputArea
              label="Your message"
              name="message"
              onChange={ handleMessageInputChange }
            />

            <div className="contact-page__submit">
              <SubmitInput
                text="Send"
              />

              { formStatus === Status.SEND_PENDING && (
                <StarLoader />
              ) }

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

              { formStatus === Status.SEND_FAILED && (
                <div className="contact-page__send-failed-message">
                  { sendFailedMessage }
                </div>
              )}
            </div>
          </form>
        </GlassCard>
      </main>

      <HomeBar />
    </div>
  );
};

export default ContactPage;