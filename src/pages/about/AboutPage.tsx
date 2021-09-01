import React from 'react'
import Header from '../../components/header/Header';

import './AboutPage.scss';

const AboutPage = () : JSX.Element => {
  return (
    <div className="about-page">
      <Header 
        mainTitle="About"
        firstSubtitle="by Anton Hildingsson"
        mainLevel={ 2 }
      />
    </div>
  )
}

export default AboutPage;
