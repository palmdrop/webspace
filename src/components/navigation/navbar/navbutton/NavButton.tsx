import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { setActiveNavBarEntry } from '../../../../state/slices/uiSlice';
import { useAppDispatch } from '../../../../state/store/hooks';

import { NavEntry } from '../NavBar';
import Button from '../../../input/button/Button';

import './NavButton.scss';

type Props = {
  navEntry : NavEntry,
  active ?: boolean,
  index ?: number,
}

const NavButton = ( { navEntry, active, index = 0 } : Props ) : JSX.Element => {
  const dispatch = useAppDispatch();
  // If "undefined" is passed as the active state, the button will handle the state on its own 
  const [ hovering, setHovering ] = useState( false );

  const handleClick = ( event : React.MouseEvent ) => {
    navEntry.onClick?.( navEntry, index, event );
  };

  const handleHover = ( event : React.MouseEvent ) => {
    navEntry.onHover?.( navEntry, index, event );
    dispatch( setActiveNavBarEntry( index ) );

    if( active === undefined ) {
      setHovering( true );
    }
  };

  const handleLeave = () => {
    if( active === undefined ) {
      setHovering( false );
    }
  };

  return (
    <li 
      className={ `nav-button ${ active || hovering ? 'nav-button--active' : '' }` }
    >
      <Link
        className='nav-button__link'
        to={ navEntry.route }
        onMouseEnter={ handleHover }
        onMouseLeave={ handleLeave }
      >
        <Button
          onClick={ handleClick }
        >
          { navEntry.text }
        </Button>
      </Link>
    </li>
  );
};

export default NavButton;
