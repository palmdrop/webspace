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

import { ImageData, introduction, sections, links } from './content';

import 'react-lazy-load-image-component/src/effects/opacity.css';
import './aboutPage.scss';
import HomeBar from '../../components/navigation/home/HomeBar';
import ExternalLink from '../../components/link/ExternalLink';
import Bar from '../../components/ornamental/bars/Bar';


const AboutPage = ( { route, scrollPosition } : PageProps & { scrollPosition : ScrollPosition } ) : JSX.Element => {
  const createLazyImage = ( { src, alt, width, height, link } : ImageData ) : JSX.Element => {
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
          width={ width }
          height={ height }
          scrollPosition={ scrollPosition }
          placeholder={
            <span>Loading...</span>
          }
        />
        <label>
          { alt }
        </label>
      </div>
    );
  }

  const createMainContent = () : JSX.Element[] => {
    return sections.map( ( section, sectionIndex ) => (
      <section 
        key={ `section-${ sectionIndex }` }
        className="about-page__section"
      >
        { section.title && (
          <Header 
            mainTitle={ section.title }
            mainLevel={ 4 }
          />
        )}
        { section.content.map( ( contentPiece, contentPieceIndex ) => (
          typeof contentPiece === 'string' ? (
            <Paragraph key={ `paragraph-${ contentPieceIndex }` }>
              { contentPiece }
            </Paragraph>
          ) : (
            createLazyImage( contentPiece )
          )
        ))}
      </section>
    ))
  }

  const createLinkSection = () : JSX.Element => {
    return (
      <section
        className="about-page__link-section"
      >
        <Bar 
          direction="horizontal"
          variant="inset"
        />
        <div>
          <SoftDisk />
          <SoftDisk />
          { links.map( ( { text, path }, index ) => (
            <ExternalLink link={ path }>
              { text }
            </ExternalLink>
          ))
          }
        </div>
        <Bar 
          direction="horizontal"
          variant="inset"
        />
      </section>
    )
  }

  const [ mainContent ] = useState( () => createMainContent() );
  const [ linkSection ] = useState( () => createLinkSection() );

  return (
    <div className={ `about-page` }>
      { /* Headers */ }
      <Header 
        mainTitle="OBSCURED"
        firstSubtitle="by Anton Hildingsson"
        mainLevel={ 3 }
        subLevel={ 5 }
        linkTo={ PageRoute.root }
      />

      <main className="about-page__main">
        <FadedHeader 
          title="ABOUT"
        >
          <Obstacle className="faded-header__obstacle" />
        </FadedHeader>

        { /* Page introduction */ }
        <section className="about-page__intro">

          <Paragraph type={ ParagraphType.bold }>
            { introduction }
          </Paragraph>

        </section>

        { /* Main page content */ }
        { mainContent }

        { linkSection }
      </main>
      

      <aside className="about-page__aside" >
        <HomeBar />
      </aside>
    </div>
  )
}

export default React.memo( trackWindowScroll( AboutPage ) );
