import { PageProps } from '../PageWrapper';
import { useNavBar } from '../../components/navigation/navbar/NavBar';
import MainHeader from './header/MainHeader';
import MainFooter from './footer/MainFooter';
import Paragraph from '../../components/paragraph/Paragraph';

import './mainPage.scss';

const MainPage = ( { route, fadeOut } : PageProps ) : JSX.Element => {
  const navBar = useNavBar( route );

  return (
    <div 
      className={ `main-page ${ fadeOut ? 'main-page--fade-out' : '' }` }
    >
      <MainHeader />

      { navBar }

      <div className="main-page__info">
        <Paragraph>
          A webspace as developing ideas, thoughts and knowledge.
        </Paragraph>
        <Paragraph>
          Thorugh the centralization of the internet, we lose private spaces.
        </Paragraph>
        <Paragraph>
          Optimization of user interfaces, A/B-testing, digital survailance...
        </Paragraph>
      </div>

      <MainFooter />
    </div>
  )
}

export default MainPage;
