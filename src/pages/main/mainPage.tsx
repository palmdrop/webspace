import { Routes, pages } from '../../App';

import NavBar from '../../components/navigation/navbar/NavBar';
import MainHeader from './header/MainHeader';

import SoftDisk from '../../components/ornamental/disk/soft/SoftDisk';
import HorizonGradient from '../../components/ornamental/gradient/HorizonGradient';
import SharpDisk from '../../components/ornamental/disk/sharp/SharpDisk';

import './mainPage.scss';
import GradientCard from '../../components/cards/gradient/GradientCard';
import Paragraph from '../../components/paragraph/Paragraph';

const MainPage = () : JSX.Element => {
  return (
    <div className="main-page">
      <MainHeader title="PALMDROP" />

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

      <GradientCard>
        <Paragraph>
          Some test text
        </Paragraph>
        <Paragraph>
          Some more test text
        </Paragraph>
      </GradientCard>

      { /* <HorizonGradient /> */}
    </div>
  )
}

export default MainPage
