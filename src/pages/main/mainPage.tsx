import { Routes, pages } from '../../App';

import NavBar from '../../components/navigation/navbar/NavBar';
import MainHeader from './header/MainHeader';

import SoftDisk from '../../components/ornamental/disk/soft/SoftDisk';
import HorizonGradient from '../../components/ornamental/gradient/HorizonGradient';
import SharpDisk from '../../components/ornamental/disk/sharp/SharpDisk';

import './mainPage.scss';

const MainPage = () : JSX.Element => {
  return (
    <div className="main-page">
      <MainHeader title="PALMDROP" />

      <div className="main-page__soft-disks">
        <SoftDisk />
        <SoftDisk />
      </div>

      <div className="main-page__sharp-disks">
        <SharpDisk />
        <SharpDisk />
        <SharpDisk />
      </div>

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

      <HorizonGradient />
    </div>
  )
}

export default MainPage
