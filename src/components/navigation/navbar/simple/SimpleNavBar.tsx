import React, { useMemo } from 'react';
import { PageRoute } from '../../../../App';
import { NavEntry, NavEntryCallback, useNavEntries } from '../NavBar';
import NavButton from '../navbutton/NavButton';

import './SimpleNavBar.scss';

export type Props = {
  mainRoute ?: PageRoute,
  entries ?: NavEntry[],
  onClick ?: NavEntryCallback,
}

const SimpleNavBar = ( { mainRoute, entries, onClick } : Props ) => {
  const allEntries = useNavEntries( undefined, entries, onClick );

  const mainEntry = useMemo( 
    () => allEntries.find( entry => entry.route === mainRoute ), 
    [ allEntries ] 
  );

  const otherEntries = useMemo(
    () => allEntries.filter( entry => entry.route !== mainRoute ),
    [ allEntries ]
  );

  return (
    <div className='simple-nav-bar'>
      { mainEntry && ( 
        <div className='simple-nav-bar__main-entry'>
          <NavButton
            navEntry={ mainEntry }
            index={ 0 }
          /> 
        </div>
      ) }
      <ul className='simple-nav-bar__other-entries'>
        { otherEntries.map( ( entry, index ) => (
          <NavButton
            key={ `${ entry.text }-${ index }` }
            navEntry={ entry }
            index={ index + 1 }
          /> 
        ) )}
      </ul>
    </div>
  );
};

export default SimpleNavBar;
