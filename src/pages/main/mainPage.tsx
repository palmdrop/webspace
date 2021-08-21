import Card from '../../components/cards/Card';
import GlassCard from '../../components/cards/glass/GlassCard';
import Bar from '../../components/ornamental/bars/Bar';
import Bars from '../../components/ornamental/bars/Bars';
import Paragraph from '../../components/paragraph/Paragraph';
import Title from '../../components/title/Title';

import './mainPage.scss';

const MainPage = () : JSX.Element => {
  return (
    <div className="main-page">

      <Bars amount={ 10 } />

      <Title 
        level={1}
        text="OBSCURED"
      />

      <GlassCard>
      </GlassCard>


    </div>
  )
}

export default MainPage
