import React from "react";

import { useHistory } from "react-router-dom";

import Button from "../../../input/button/Button";

import './NavButton.scss';

type Props = {
  text : string,
  path : string,
  active? : boolean,
  onClick? : ( event : React.MouseEvent ) => void,
  onHover? : ( event : React.MouseEvent ) => void,
  redirectionDelay? : number
}

const NavButton = ( { text, path, active = false, onClick, onHover, redirectionDelay } : Props ) : JSX.Element => {
  const history = useHistory();

  const handleClick = ( event : React.MouseEvent ) => {
    onClick && onClick( event );

    if( redirectionDelay ) {
      setTimeout( () => {
        history.push( path );
      }, redirectionDelay );
    } else {
      history.push( path );
    }
  };

  return (
    <li className={ `nav-button ${ active ? 'nav-button--active' : '' } `}
    >
      <Button
        onClick={ handleClick }
        onHover={ onHover }
      >
        { text }
      </Button>
    </li>
  )
}

export default NavButton;
