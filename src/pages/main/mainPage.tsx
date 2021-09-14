import { useState } from 'react';

import { PageProps } from '../PageWrapper';
import { useNavBar } from '../../components/navigation/navbar/NavBar';
import MainHeader from './header/MainHeader';
import MainFooter from './footer/MainFooter';
import Paragraph from '../../components/paragraph/Paragraph';

import AnimationCanvas from '../../components/canvas/AnimationCanvas';
import { MainRenderScene } from '../../three/main/MainRenderScene';

import './mainPage.scss';
import RetroCorePiece from '../pieces/pieces/retroCore/RetroCorePiece';
import { MainPieceComponent, PieceWrapper } from '../pieces/pieces/pieces';

const MainPage = ( { route } : PageProps ) : JSX.Element => {
  const navBar = useNavBar( route );

  const [ animationLoaded, setAnimationLoaded ] = useState( false );

  const onAnimationLoad = () : void => {
    setAnimationLoaded( true );
  }

  return (
    <div 
      className={ 
        `main-page ${ animationLoaded ? 'main-page--loaded' : '' }`
      }
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

      <PieceWrapper 
        PieceComponent={ MainPieceComponent }
      />

      <MainFooter />
    </div>
  )
}

export default MainPage;
