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
      {/*<MainHeader title="PALMDROP" /> */}
      <header>
        <Title
          text="OBSCURED"          
          level={1}
        />
        <div>
          <Title 
            text="palm"
            level={5}
          />
          <Title 
            text="Experimental web space"
            level={5}
          />
          <Title 
            text="drop"
            level={5}
          />
          <Title 
            text="Blog and entities"
            level={5}
          />
        </div>
      </header>

      {/*<div className="main-page__soft-disks">
        <SoftDisk />
        <SoftDisk />
      </div>

      <div className="main-page__sharp-disks">
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
    </div>
  )
}

export default MainPage
