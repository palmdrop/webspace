import React from 'react'
import { Link } from 'react-router-dom';
import { PageRoute } from '../../App';
import Bar from '../ornamental/bars/Bar';
import Title from '../title/Title';

import './Header.scss';

type Props = {
  mainTitle : string,
  firstSubtitle? : string,
  secondSubtitle? : string,
  mainLevel? : number,
  subLevel? : number,
  linkTo? : PageRoute,
  children? : React.ReactChild | React.ReactChild[] | never[]
};

const Header = ( { mainTitle, firstSubtitle, secondSubtitle, mainLevel = 1, subLevel = 5, linkTo, children } : Props ) : JSX.Element => {
  const headerContent = (
    <div>
      <Title 
        level={ mainLevel }
        text={ mainTitle }
      />

      { ( firstSubtitle || secondSubtitle ) ?
        <Bar
          direction="horizontal"
          variant="inset"
        />
        : null
      }

      <div>
        { firstSubtitle ? 
          <Title
            level={ subLevel }
            text={ firstSubtitle }
          />
          : null
        }

        { secondSubtitle ? 
          <Title
            level={ subLevel }
            text={ secondSubtitle }
          />
          : null
        }
      </div>

      { children }
    </div>
  );

  return (
    <header 
      className={ `header ${ linkTo ? 'header--link' : '' }` }
    >
      { linkTo ? (
          <Link to={ linkTo }>
            { headerContent }
          </Link>
        ) : headerContent 
      }
    </header>
  )
}

export default Header;