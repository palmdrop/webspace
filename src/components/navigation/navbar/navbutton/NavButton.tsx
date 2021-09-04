import React from "react";
import { useState } from "react";

import { useNavigation } from "../../../../App";
import { setActiveNavBarEntry } from "../../../../state/slices/uiSlice";
import { useAppDispatch } from "../../../../state/store/hooks";

import Button from "../../../input/button/Button";
import { NavEntry } from "../NavBar";

import './NavButton.scss';

type Props = {
  navEntry : NavEntry,
  active? : boolean,
  index : number,
}

const NavButton = ( { navEntry, active, index } : Props ) : JSX.Element => {
  const dispatch = useAppDispatch();
  const navigateTo = useNavigation();

  // If "undefined" is passed as the active state, the button will handle the state on its own 
  const [ hovering, setHovering ] = useState( false );

  const handleClick = ( event : React.MouseEvent ) => {
    navEntry.onClick?.( navEntry, index, event );
    navigateTo( navEntry.route );
  };

  const handleHover = ( event : React.MouseEvent ) => {
    navEntry.onHover?.( navEntry, index, event );
    dispatch( setActiveNavBarEntry( index ) );

    if( active === undefined ) {
      setHovering( true );
    }
  }

  const handleLeave = ( event : React.MouseEvent ) => {
    if( active === undefined ) {
      setHovering( false );
    }
  }

  return (
    <li className={ `nav-button ${ active || hovering ? 'nav-button--active' : '' }` }
    >
      <Button
        onClick={ handleClick }
        onHover={ handleHover }
        onLeave={ handleLeave }
      >
        { navEntry.text }
      </Button>
    </li>
  )
}

export default React.memo( NavButton );
