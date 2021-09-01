import React from 'react'
import Bar from '../ornamental/bars/Bar';
import Title from '../title/Title';

import './Header.scss';

type Props = {
  mainTitle : string,
  firstSubtitle? : string,
  secondSubtitle? : string,
  mainLevel? : number,
  subLevel? : number,
  children? : React.ReactChild | React.ReactChild[] | never[]
};

const Header = ( { mainTitle, firstSubtitle, secondSubtitle, mainLevel = 1, subLevel = 5, children } : Props ) : JSX.Element => {
  return (
    <header className="header">
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
    </header>
  )
}

export default Header;