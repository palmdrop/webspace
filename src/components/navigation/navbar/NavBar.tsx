import NavButton from './navbutton/NavButton'

import './NavBar.scss';

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
    <nav className="nav-bar">
      <ul>
      { entries.map( ( entry, index ) => (
          <NavButton
            key={ `${ entry.text }-${ index }` }
            path={ entry.path }
            text={ entry.text }
          />
        ))
      }
      </ul>
    </nav>
  )
}

export default NavBar
