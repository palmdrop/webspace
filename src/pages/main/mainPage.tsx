import { Routes, pages } from '../../App';

import NavBar from '../../components/navigation/navbar/NavBar';
import MainHeader from './header/MainHeader';

import SoftDisk from '../../components/ornamental/disk/soft/SoftDisk';
import HorizonGradient from '../../components/ornamental/gradient/HorizonGradient';
import SharpDisk from '../../components/ornamental/disk/sharp/SharpDisk';

import './mainPage.scss';
import GradientCard from '../../components/cards/gradient/GradientCard';
import Paragraph from '../../components/paragraph/Paragraph';
import Title from '../../components/title/Title';

const MainPage = () : JSX.Element => {
  return (
    <div className="main-page">
      <MainHeader />

      {/*<div className="main-page__sharp-disks">
        <SharpDisk />
        <SharpDisk />
        <SharpDisk />
      </div>
      */}

      <NavBar
        entries={ 
          /* Create a navbar using all pages but the root page */
          pages
          .filter( ( { route } ) => route !== Routes.root )
          .map( ( { name, route } ) => {
            return { path: route, text: name }
          })
        }
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
