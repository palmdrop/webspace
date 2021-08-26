import NavButton from './navbutton/NavButton'

import './NavBar.scss';
import GlassCard from '../../cards/glass/GlassCard';
import SoftDisk from '../../ornamental/disk/soft/SoftDisk';

type NavEntry = {
  text : string,
  path : string,
  callback? : ( path : string ) => void
}

type Props = {
  entries : NavEntry[]
}

const NavBar = ( { entries } : Props ) : JSX.Element => {
  return (
    <div className="nav-bar">
      <nav className="nav-bar">
        <SoftDisk />
        <SoftDisk />
        <GlassCard>
          <ul>
          { entries.map( ( entry, index ) => (
              <NavButton
                key={ `${ entry.text }-${ index }` }
                path={ entry.path }
                text={ entry.text }
                onClick={ ( e ) => {
                  entry.callback && entry.callback( entry.path );
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

export default NavBar
