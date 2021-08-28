import { Routes, pages } from '../../App';
import { useState } from 'react';

import MainHeader from './header/MainHeader';
import NavBar, { NavEntry } from '../../components/navigation/navbar/NavBar';
import Paragraph from '../../components/paragraph/Paragraph';

import './mainPage.scss';
import NoiseBackground from '../../components/ornamental/noise/NoiseBackground';
import SharpDisk from '../../components/ornamental/disk/sharp/SharpDisk';
import MainFooter from './footer/MainFooter';

const MainPage = () : JSX.Element => {
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

  return (
    <div className="main-page">
      <MainHeader />

      <NoiseBackground opacity={ 0.4 } />

      <NavBar
        entries={ 
          navEntries
        }
      />

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

export default MainPage
