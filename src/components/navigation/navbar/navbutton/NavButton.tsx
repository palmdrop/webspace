import React from "react";

import { useNavigation } from "../../../../App";
import { setActiveNavBarEntry } from "../../../../state/slices/uiSlice";
import { useAppDispatch } from "../../../../state/store/hooks";

import Button from "../../../input/button/Button";
import { NavEntry } from "../NavBar";

import './NavButton.scss';

type Props = {
  navEntry : NavEntry,
  active : boolean,
  index : number,
}

const NavButton = ( { navEntry, active = false, index } : Props ) : JSX.Element => {
  const dispatch = useAppDispatch();
  const navigateTo = useNavigation();

  const handleClick = ( event : React.MouseEvent ) => {
    navEntry.onClick?.( navEntry, index, event );
    navigateTo( navEntry.route );
  };

  const handleHover = ( event : React.MouseEvent ) => {
    navEntry.onHover?.( navEntry, index, event );
    dispatch( setActiveNavBarEntry( index ) );
  }

  return (
    <li className={ `nav-button ${ active ? 'nav-button--active' : '' }` }
    >
      <Button
        onClick={ handleClick }
        onHover={ handleHover }
      >
        { navEntry.text }
      </Button>
    </li>
  )
}

export default React.memo( NavButton );
