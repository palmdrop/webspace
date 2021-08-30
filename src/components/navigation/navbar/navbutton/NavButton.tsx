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
}

const NavButton = ( { text, path, active = false, onClick, onHover } : Props ) : JSX.Element => {
  const history = useHistory();

  const handleClick = ( event : React.MouseEvent ) => {
    onClick && onClick( event );
    history.push( path );
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
