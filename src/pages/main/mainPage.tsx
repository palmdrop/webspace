import GlassCard from '../../components/cards/glass/GlassCard';
import Title from '../../components/title/Title';

import Bars from '../../components/ornamental/bars/Bars';

import './mainPage.scss';

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
    </div>
  )
}

export default MainPage
