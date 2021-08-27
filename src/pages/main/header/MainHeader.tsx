import Bar from '../../../components/ornamental/bars/Bar';
import Title from '../../../components/title/Title';

import { ReactComponent as Obstacle } from '../../../assets/svg/obstacle1.svg';

import './MainHeader.scss';

type Props = {
  obstacleLocation? : number | null
}

const MainHeader = ( { obstacleLocation = null } : Props ) => {
  return (
      <header className="main-header">
        <div>
          <Title 
            level={ 1 }
            text="OBSCURED"
          />
          <Bar
            direction="horizontal"
            variant="inset"
          />

          <Obstacle className={
            //`main-header__obstacle ${ obstacleLocation ? `main-header__obstacle--location${ obstacleLocation }` : '' }`
            'main-header__obstacle'
          }
          />

          <div>
            <Title
              level={ 5 }
              text="palm drop"
            />
            <Title
              level={ 5 }
              text="Experimental webspace, unclear blog and generative art"
            />
          </div>

        </div>
      </header>
  )
}

export default MainHeader;
