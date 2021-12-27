import React, { useMemo } from 'react';

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

export type NavEntryCallback = ( entry : NavEntry, index : number, event : React.MouseEvent ) => void;

export type NavBarProps = {
  currentRoute ?: PageRoute,
  entries ?: NavEntry[],
  onClick ?: NavEntryCallback,
}

export const useNavEntries = ( currentRoute ?: PageRoute, defaultEntries ?: NavEntry[], onClick ?: NavEntryCallback ) => {
  return useMemo( () => {
    return defaultEntries || createNavEntries(
      pages, currentRoute, onClick
    );
  }, [ currentRoute, defaultEntries, onClick ] );
};

const NavBar = ( { currentRoute, entries, onClick } : NavBarProps ) : JSX.Element => {
  const activeNavBarEntry = useAppSelector( selectActiveNavBarEntry );
  const allEntries = useNavEntries( currentRoute, entries, onClick );
  
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
            { allEntries.map( ( entry, index ) => (
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
export const createNavEntries = ( 
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

export default React.memo( NavBar );
