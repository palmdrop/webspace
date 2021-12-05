import React from 'react';

import './Button.scss';

type Props = {
  isPressed ?: boolean,  
  onClick ?: ( event : React.MouseEvent, which ?: number ) => void,
  onHover ?: ( event : React.MouseEvent ) => void,
  onLeave ?: ( event : React.MouseEvent ) => void,
  additionalClasses ?: string,
  children ?: React.ReactChild | React.ReactChild[] | never[]
}

const Button = ( { isPressed = false, onClick, onHover, onLeave, additionalClasses = '', children } : Props ) : JSX.Element => {

  const handleClick = ( event : React.MouseEvent, which ?: number ) : void => {
    onClick?.( event, which );
  };

  return (
    <button
      className={ 
        `button ${ isPressed ? 'button--pressed' : '' } ${ additionalClasses }` 
      }
      onClick={ handleClick }
      onAuxClick={ ( e ) => handleClick( e, 2 ) }
      onMouseEnter={ onHover }
      onMouseLeave={ onLeave }
    >
      { children } 
    </button>
  );
};

export default Button;
