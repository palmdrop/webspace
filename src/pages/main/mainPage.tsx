import Card from '../../components/cards/Card';
import GlassCard from '../../components/cards/glass/GlassCard';
import Paragraph from '../../components/paragraph/Paragraph';
import Title from '../../components/title/Title';

import './mainPage.scss';

const MainPage = () : JSX.Element => {
  return (
    <div className="main-page">
      <Title 
        level={1}
        text="OBSCURED"
      />

      <GlassCard>
        <Paragraph>
          Occluded and Bright
        </Paragraph>
      </GlassCard>

    </div>
  )
}

export default MainPage
