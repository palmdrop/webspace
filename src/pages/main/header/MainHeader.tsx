import GlassCard from '../../../components/cards/glass/GlassCard';
import Bars from '../../../components/ornamental/bars/Bars';
import Title from '../../../components/title/Title';

import './MainHeader.scss';

const MainHeader = () => {
  return (
    <header className="main-header">

      <Bars amount={ 10 } />

      <GlassCard>
      </GlassCard>

      <Title 
        level={1}
        text="PALMDROP"
      />

    </header>
  )
}

export default MainHeader;
