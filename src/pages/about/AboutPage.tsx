import React from 'react'
import { ReactComponent as Obstacle } from '../../assets/svg/obstacle3.svg';
import { PageRoute } from '../../App';
import FadedHeader from '../../components/header/faded/FadedHeader';
import Header from '../../components/header/Header';
import Paragraph from '../../components/paragraph/Paragraph';
import { PageProps } from '../PageWrapper';

import './AboutPage.scss';

const AboutPage = ( { fadeOut } : PageProps ) : JSX.Element => {
  return (
    <div className={ `about-page ${ fadeOut ? 'about-page--fade-out' : '' }` }>
      <Header 
        mainTitle="OBSCURED"
        firstSubtitle="by Anton Hildingsson"
        mainLevel={ 3 }
        subLevel={ 5 }
        linkTo={ PageRoute.root }
      />
      <FadedHeader 
        title="ABOUT"
      >
        <Obstacle className="faded-header__obstacle" />
      </FadedHeader>
      <div className="about-page__main">
        <Paragraph>
          Here is some text
        </Paragraph>
      </div>
    </div>
  )
}

export default AboutPage;
