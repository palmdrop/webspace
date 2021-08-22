import React from "react";

import './Button.scss';

type Props = {
  isPressed? : boolean,  
  onClick? : ( event : React.MouseEvent ) => void,
  onHover? : ( event : React.MouseEvent ) => void,
  additionalClasses? : string,
  children? : React.ReactChild | React.ReactChild[] | never[]
}

const Button = ( { isPressed = false, onClick, onHover, additionalClasses = '', children } : Props ) : JSX.Element => {

  const handleClick = ( event : React.MouseEvent ) : void => {
    onClick && onClick( event );
  };

  return (
    <button
      className={ 
        `button ${ isPressed ? 'button--pressed' : '' } ${ additionalClasses }` 
      }
      onClick={ handleClick }
      onMouseEnter={ onHover }
    >
      { children } 
    </button>
  )
}

export default Button;
