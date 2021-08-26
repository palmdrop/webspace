import NavButton from './navbutton/NavButton'

import './NavBar.scss';
import GlassCard from '../../cards/glass/GlassCard';
import SoftDisk from '../../ornamental/disk/soft/SoftDisk';
import React from 'react';

export type NavEntry = {
  text : string,
  path : string,
  callback? : ( path : string ) => void
}

type Props = {
  entries : NavEntry[],
  activeEntry? : number | null,
  onHover? : ( entry : NavEntry, index : number ) => void
}

const NavBar = ( { entries, activeEntry = null, onHover } : Props ) : JSX.Element => {
  return (
    <div className="nav-bar">
      <nav 
        className={ 
          `nav-bar__nav ${ activeEntry !== null ? `nav-bar__nav--entry${ activeEntry }` : '' }` 
        }
      >
        <SoftDisk />
        <SoftDisk />
        <GlassCard>
          <ul>
          { entries.map( ( entry, index ) => (
              <NavButton
                key={ `${ entry.text }-${ index }` }
                path={ entry.path }
                text={ entry.text }
                active= { index === activeEntry }
                onClick={ ( e : React.MouseEvent ) => {
                  entry.callback && entry.callback( entry.path );
                }}
                onHover={ ( e : React.MouseEvent ) => {
                  onHover && onHover( entry, index );
                }}
              />
            ))
          }
          </ul>
        </GlassCard>
      </nav>
    </div>
  )
}

export default NavBar;
