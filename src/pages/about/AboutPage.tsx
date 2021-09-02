import React from 'react'
import { ReactComponent as Obstacle } from '../../assets/svg/obstacle3.svg';
import { PageRoute } from '../../App';
import FadedHeader from '../../components/header/faded/FadedHeader';
import Header from '../../components/header/Header';
import Paragraph, { ParagraphType } from '../../components/paragraph/Paragraph';
import { PageProps } from '../PageWrapper';

import './AboutPage.scss';

const AboutPage = ( { fadeOut } : PageProps ) : JSX.Element => {
  return (
    <div className={ `about-page ${ fadeOut ? 'about-page--fade-out' : '' }` }>
      { /* Headers */ }
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

      { /* Page introduction */ }
      <div className="about-page__intro">

        <Paragraph type={ ParagraphType.bold }>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
        </Paragraph>

      </div>

      { /* Main page content */ }
      <main className="about-page__main">

        <Paragraph type={ ParagraphType.normal }>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Paragraph>
        <Paragraph type={ ParagraphType.normal }>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Paragraph>
        <Paragraph type={ ParagraphType.normal }>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Paragraph>
        <Paragraph type={ ParagraphType.normal }>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Paragraph>
        <Paragraph type={ ParagraphType.normal }>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Paragraph>
        <Paragraph type={ ParagraphType.normal }>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Paragraph>

      </main>
    </div>
  )
}

export default AboutPage;
