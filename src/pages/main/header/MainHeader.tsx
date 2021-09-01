import { PageRoute } from '../../../App';
import { ReactComponent as Obstacle } from '../../../assets/svg/obstacle1.svg';

import Header from '../../../components/header/Header';
import NavButton from '../../../components/navigation/navbar/navbutton/NavButton';

import './MainHeader.scss';

const MainHeader = () => {
  return (
    <Header 
      mainTitle="OBSCURED"
      firstSubtitle="palm drop"
      secondSubtitle="Experimental webspace, unclear blog and generative art"
      linkTo={ PageRoute.root }
    >
      <Obstacle className="header__obstacle" />
    </Header>
  )
}

export default MainHeader;
