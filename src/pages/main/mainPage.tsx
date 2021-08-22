import GlassCard from '../../components/cards/glass/GlassCard';
import Title from '../../components/title/Title';

import Bars from '../../components/ornamental/bars/Bars';

import './mainPage.scss';
import { Routes } from '../../App';

import NavBar from '../../components/navigation/navbar/NavBar';
import { SoftDisk } from '../../components/ornamental/disk/soft/SoftDisk';

const MainPage = () : JSX.Element => {
  return (
    <div className="main-page">
      <header className="main-page__header">

        <Bars amount={ 10 } />

        <GlassCard>
        </GlassCard>

        <Title 
          level={1}
          text="OBSCURED"
        />

      </header>

      <SoftDisk />
      <SoftDisk />

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
    </div>
  )
}

export default MainPage
