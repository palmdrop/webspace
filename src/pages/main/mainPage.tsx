import { Routes, pages } from '../../App';
import { useState } from 'react';

import MainHeader from './header/MainHeader';
import NavBar, { NavEntry } from '../../components/navigation/navbar/NavBar';
import Paragraph from '../../components/paragraph/Paragraph';

import './mainPage.scss';
import NoiseBackground from '../../components/ornamental/noise/NoiseBackground';

const MainPage = () : JSX.Element => {
  const [ activeNavBarEntry, setActiveNavBarEntry ] = useState<number | null>( null );

  // Create a navbar entries using all pages but the root page
  // The value is calculated using a function callback to avoid 
  // recalculating on each page re-render, and to make memoization possible
  const [ navEntries ] = useState( () => {
    return pages
      .filter( ( { route } ) => route !== Routes.root )
      .map( ( { name, route } ) => {
        return { path: route, text: name }
      });
  });

  const handleNavBarHover = ( entry : NavEntry, index : number ) : void => {
    setActiveNavBarEntry( index ); 
  };

  return (
    <div className="main-page">
      <MainHeader obstacleLocation={ activeNavBarEntry } />

      <NoiseBackground />


      {/*<div className="main-page__sharp-disks">
        <SharpDisk />
        <SharpDisk />
        <SharpDisk />
      </div>
      */}

      <NavBar
        entries={ 
          navEntries
        }
        activeEntry={ activeNavBarEntry }
        onHover={ handleNavBarHover }
      />

      { /* <HorizonGradient /> */}
      
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
    </div>
  )
}

export default MainPage
