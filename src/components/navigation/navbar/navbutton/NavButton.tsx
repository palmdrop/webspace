import React from "react";

import { useHistory } from "react-router-dom";
import { setActiveNavBarEntry, setColorScheme, setNextPageRoute } from "../../../../state/slices/uiSlice";
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
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleClick = ( event : React.MouseEvent ) => {
    navEntry.colorScheme && dispatch( setColorScheme( navEntry.colorScheme ));
      
    dispatch( setNextPageRoute( navEntry.route ) );

    navEntry.onClick?.( navEntry, index, event );

    if( navEntry.redirectionDelay ) {
      setTimeout( () => {
        history.push( navEntry.route );
      }, navEntry.redirectionDelay );
    } else {
      history.push( navEntry.route );
    }
  };

  const handleHover = ( event : React.MouseEvent ) => {
    dispatch( setActiveNavBarEntry( index ) );

    navEntry.onHover?.( navEntry, index, event );
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

export default NavButton;
