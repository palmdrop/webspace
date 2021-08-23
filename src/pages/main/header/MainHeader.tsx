import GlassCard from '../../../components/cards/glass/GlassCard';
import Bars from '../../../components/ornamental/bars/Bars';
import Title from '../../../components/title/Title';

import './MainHeader.scss';

type Props = {
  title: string, 
}

const MainHeader = ( { title } : Props ) => {
  return (
    <header className="main-header">

      <Bars amount={ 10 } />

      <GlassCard>
      </GlassCard>

      <Title 
        level={ 1 }
        text={ title }
      />

    </header>
  )
}

export default MainHeader;
