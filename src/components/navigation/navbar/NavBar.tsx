import React from 'react';

import { useAppDispatch, useAppSelector } from '../../../state/store/hooks';
import { selectActiveNavBarEntry, setActiveNavBarEntry } from '../../../state/slices/uiSlice';

import GlassCard from '../../cards/glass/GlassCard';
import SoftDisk from '../../ornamental/disk/soft/SoftDisk';
import NavButton from './navbutton/NavButton'

import './NavBar.scss';

export type NavEntry = {
  text : string,
  path : string,
  callback? : ( path : string ) => void
}

type Props = {
  entries : NavEntry[],
  onHover? : ( entry : NavEntry, index : number ) => void
}

const NavBar = ( { entries, onHover } : Props ) : JSX.Element => {
  const dispatch = useAppDispatch();
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
              path={ entry.path }
              text={ entry.text }
              active= { index === activeNavBarEntry }
              onClick={ ( e : React.MouseEvent ) => {
                entry.callback && entry.callback( entry.path );
              }}
              onHover={ ( e : React.MouseEvent ) => {
                onHover && onHover( entry, index );
                dispatch( setActiveNavBarEntry( index ) );
              }}
            />)
          )}
          </ul>
        </GlassCard>
      </nav>
    </div>
  )
}

export default React.memo( NavBar );
