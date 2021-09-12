import { useRef, useState } from 'react';

import { PageProps } from '../PageWrapper';
import { useNavBar } from '../../components/navigation/navbar/NavBar';
import MainHeader from './header/MainHeader';
import MainFooter from './footer/MainFooter';
import Paragraph from '../../components/paragraph/Paragraph';

import './mainPage.scss';
import AnimationCanvas from '../../components/canvas/AnimationCanvas';
import { MainRenderScene } from '../../three/main/MainRenderScene';

const MainPage = ( { route, fadeOut } : PageProps ) : JSX.Element => {
  const mousePosition = useRef<{ x : number, y : number } | null>( null );

  const navBar = useNavBar( route );

  const [ animationLoaded, setAnimationLoaded ] = useState( false );

  const onAnimationLoad = () : void => {
    setAnimationLoaded( true );
  }

  const onMouseMove = ( event : MouseEvent, renderScene : MainRenderScene) => {
    let previousX, previousY;

    if( mousePosition.current === null ) {
      previousX = event.clientX;
      previousY = event.clientY;
      mousePosition.current = { x : 0, y : 0 };
    } else {
      previousX = mousePosition.current.x;
      previousY = mousePosition.current.y;
    }

    const deltaX = event.clientX - previousX;
    const deltaY = event.clientY - previousY;

    renderScene.rotate( deltaX, deltaY );

    mousePosition.current.x = event.clientX;
    mousePosition.current.y = event.clientY;
  };

  return (
    <div 
      className={ 
        `main-page ${ fadeOut ? 'main-page--fade-out' : '' }` + 
        ` ${ animationLoaded ? 'main-page--loaded' : '' }`
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

      <AnimationCanvas 
        renderSceneConstructor={ MainRenderScene }
        onLoad={ onAnimationLoad }
        onMouseMove={ onMouseMove }
      />

      <MainFooter />
    </div>
  )
}

export default MainPage;
