import React from "react";

import { Link } from "react-router-dom";

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
  return (
    <li className={ `nav-button ${ active ? 'nav-button--active' : '' } `}
    >
      <Button
        onClick={ onClick }
        onHover={ onHover }
      >
        <Link
          to={ path }
        >
          { text }
        </Link>
      </Button>
    </li>
  )
}

export default NavButton;
