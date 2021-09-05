import React, { useState } from 'react'

import { ScrollPosition, trackWindowScroll } from 'react-lazy-load-image-component';
import LazyImage from '../../components/media/image/LazyImage';

import { PageRoute, routePageMap } from '../../App';
import { PageProps } from '../PageWrapper';

import NavButton from '../../components/navigation/navbar/navbutton/NavButton';
import { createNavEntry } from '../../components/navigation/navbar/NavBar';

import FadedHeader from '../../components/header/faded/FadedHeader';
import Header from '../../components/header/Header';
import Paragraph, { ParagraphType } from '../../components/paragraph/Paragraph';
import SoftDisk from '../../components/ornamental/disk/soft/SoftDisk';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle3.svg';

import { images, introduction, paragraphs } from './content';

import 'react-lazy-load-image-component/src/effects/opacity.css';
import './aboutPage.scss';


// TODO text with link on top of each image? link to project piece, if existing

const AboutPage = ( { route, fadeOut, scrollPosition } : PageProps & { scrollPosition : ScrollPosition } ) : JSX.Element => {
  const [ rootNavEntry ] = useState( () => {
    const page = routePageMap.get( PageRoute.root );
    if( !page ) return null;
    return createNavEntry( page, "Go back" );
  });

  const createLazyImage = ( src : string, alt : string, height : number ) : JSX.Element => {
    let left : string | undefined;
    let right : string | undefined;

    const getOffset = () : string => {
      return `${ Math.random() * 20 }%`;
    }

    if( Math.random() < 0.5 ) {
      left = getOffset();
    } else {
      right = getOffset();
    }

    return (
      <div 
        key={ src }
        className="about-page__lazy-image-container"
        style={ {
          //left: left,
          //right: right,
          //height: height,
        }}
      >
        <LazyImage 
          src={ src }
          alt={ alt }
          height={ height }
          scrollPosition={ scrollPosition }
          placeholder={
            <span>Loading...</span>
          }
        />
      </div>
    );
  }

  const createMainContent = () : JSX.Element[] => {
    const paragraphsPerImage = Math.ceil( paragraphs.length / images.length );

    const content : JSX.Element[] = [];

    let imageIndex = 0;
    for( let i = 0; i < paragraphs.length; i++ ) {

      if( i % paragraphsPerImage === 0 ) {
        content.push(
          createLazyImage( images[ imageIndex ], "image", 350 )
        );

        imageIndex++;
      }

      content.push(
        <Paragraph key={ `paragraph-${ i }` }>
          { paragraphs[ i ] }
        </Paragraph>
      )
    }

    return content;
  }

  const [ mainContent ] = useState( () => createMainContent() );

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
          { introduction }
        </Paragraph>

      </div>

      { /* Main page content */ }
      <main className="about-page__main">
        { mainContent }
      </main>

      { rootNavEntry ? 

        <aside className="about-page__aside">
          <div>
            <SoftDisk />
            <nav>
              <NavButton 
                navEntry={ rootNavEntry }
                index={ 0 }
              />
            </nav>
          </div>
        </aside>

        : null
      }
    </div>
  )
}

export default React.memo( trackWindowScroll( AboutPage ) );
