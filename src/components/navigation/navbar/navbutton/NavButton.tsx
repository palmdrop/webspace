import React from "react";

import { Link } from "react-router-dom";

import Button from "../../../input/button/Button";

import './NavButton.scss';

type Props = {
  text : string,
  path : string,
  onClick? : ( event : React.MouseEvent ) => void,
  onHover? : ( event : React.MouseEvent ) => void,
}

const NavButton = ( { text, path, onClick, onHover } : Props ) : JSX.Element => {
  return (
    <li className="nav-button">
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
