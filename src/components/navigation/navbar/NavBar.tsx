import React from 'react';
import { useState } from 'react';

import { useAppSelector } from '../../../state/store/hooks';
import { selectActiveNavBarEntry } from '../../../state/slices/uiSlice';

import { Page, PageRoute, pages } from '../../../App';

import GlassCard from '../../cards/glass/GlassCard';
import SoftDisk from '../../ornamental/disk/soft/SoftDisk';
import NavButton from './navbutton/NavButton';

import './NavBar.scss';

export type NavEntry = {
  text : string,
  route : string,
  onClick ?: NavEntryCallback,
  onHover ?: NavEntryCallback
}

type NavEntryCallback = ( entry : NavEntry, index : number, event : React.MouseEvent ) => void;

type Props = {
  entries : NavEntry[],
}

const NavBar = ( { entries } : Props ) : JSX.Element => {
  const activeNavBarEntry = useAppSelector( selectActiveNavBarEntry );
  
  return (
    <div className="nav-bar">
      <nav 
        className={ 
          `nav-bar__nav ${ activeNavBarEntry !== null ? `nav-bar__nav--entry${ activeNavBarEntry }` : '' }` 
        }
      >
        <SoftDisk />
        <SoftDisk />
        <GlassCard>
          <ul>
            { entries.map( ( entry, index ) => (
              <NavButton
                key={ `${ entry.text }-${ index }` }
                active={ index === activeNavBarEntry }
                navEntry={ entry }
                index={ index }
              /> )
            )}
          </ul>
        </GlassCard>
      </nav>
    </div>
  );
};

export const createNavEntry = ( page : Page, text ?: string, onClick ?: NavEntryCallback ) : NavEntry => {
  const { name, route } = page; 
  
  return { 
    text: text || name, 
    route,
    onClick,
  };
};

// Helper function for creating an array of navbar entires
const createNavEntries = ( 
  pages : Page[],
  currentRoute ?: PageRoute, 
  onClick ?: NavEntryCallback, 
) : NavEntry[] => {

  // Create navbar entries using all pages EXCEPT the current page (if supplied)
  return pages

    // Filter out the root page
    .filter( ( { route } ) => {
      if( !currentRoute ) return true;
      else return route !== currentRoute;
    } )

    // Map the Page data to a NavEntry
    .map( ( { name, route } : Page ) : NavEntry => ( { 
      text: name, 
      route,
      onClick,
    } ) );
};

// Custom hook for creating a navbar and storing the navbar entries
export const useNavBar = ( 
  currentRoute ?: PageRoute, 
  onClick ?: NavEntryCallback,
) : JSX.Element => {

  // The navbar entires are calculated using a function callback to avoid 
  // recalculating on each page re-render, and to make memoization possible
  const [ navEntries ] = useState( () => createNavEntries(
    pages, currentRoute, onClick
  ) );

  return (
    <NavBar
      entries={ navEntries }
    />
  );
}; 

export default React.memo( NavBar );
