import GlassCard from '../../components/cards/glass/GlassCard';
import Title from '../../components/title/Title';

import Bars from '../../components/ornamental/bars/Bars';

import './mainPage.scss';
import { Routes } from '../../App';

import NavBar from '../../components/navigation/navbar/NavBar';
import { SoftDisk } from '../../components/ornamental/disk/soft/SoftDisk';
import HorizonGradient from '../../components/ornamental/gradient/HorizonGradient';
import SharpDisk from '../../components/ornamental/disk/sharp/SharpDisk';
import MainHeader from './header/MainHeader';

const MainPage = () : JSX.Element => {
  return (
    <div className="main-page">
      <MainHeader />

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
        entries={[
          {
            path: Routes.self,
            text: 'About'
          },
          {
            path: Routes.blog,
            text: 'Blog'
          },
          {
            path: Routes.pieces,
            text: 'Pieces'
          },
          {
            path: Routes.contact,
            text: 'Contact'
          }
        ]} 
      />

      <HorizonGradient />
    </div>
  )
}

export default MainPage
