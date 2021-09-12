import React, { useState } from 'react'
import { Page, PageRoute, routePageMap } from '../../../App';
import SoftDisk from '../../ornamental/disk/soft/SoftDisk';
import { createNavEntry } from '../navbar/NavBar';
import NavButton from '../navbar/navbutton/NavButton';

import './HomeBar.scss';

const HomeBar = () : JSX.Element => {
  const [ rootNavEntry ] = useState( () => {
    const page = routePageMap.get( PageRoute.root );
    // The root page will always exist in the routePageMap
    return createNavEntry( page as Page, "Go back" );
  });

  return (
    <div className="home-bar">
      <SoftDisk />
      <nav>
        <NavButton 
          navEntry={ rootNavEntry }
          index={ 0 }
        />
      </nav>
    </div>
  )
}

export default HomeBar;
