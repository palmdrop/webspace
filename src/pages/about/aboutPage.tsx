import React, { useState } from 'react'

import { ScrollPosition, trackWindowScroll } from 'react-lazy-load-image-component';
import LazyImage from '../../components/media/image/LazyImage';

import { PageRoute } from '../../App';
import { PageProps } from '../PageWrapper';

import FadedHeader from '../../components/header/faded/FadedHeader';
import Header from '../../components/header/Header';
import Paragraph, { ParagraphType } from '../../components/paragraph/Paragraph';
import SoftDisk from '../../components/ornamental/disk/soft/SoftDisk';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle3.svg';

import HomeBar from '../../components/navigation/home/HomeBar';
import ExternalLink from '../../components/link/ExternalLink';

import { ImageData, introduction, sections, links } from './content';

import 'react-lazy-load-image-component/src/effects/opacity.css';
import './aboutPage.scss';
import GlassCard from '../../components/cards/glass/GlassCard';


const AboutPage = ( { route, scrollPosition } : PageProps & { scrollPosition : ScrollPosition } ) : JSX.Element => {
  const createLazyImage = ( { src, alt, width, height, link } : ImageData ) : JSX.Element => {
    return (
      <div 
        key={ src }
        className="about-page__lazy-image-container"
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
        <GlassCard>
          <SoftDisk />
          <SoftDisk />
          <>
            { links.map( ( { text, path }, index ) => (
              <ExternalLink 
                key={ `${ path }-${ index }` }
                link={ path }
              >
                { text }
              </ExternalLink>
            ))
            }
          </>
        </GlassCard>
      </section>
    )
  }

  const [ mainContent ] = useState( () => createMainContent() );
  const [ linkSection ] = useState( () => createLinkSection() );

  return (
    <div className="about-page">
      { /* Headers */ }
      <Header 
        mainTitle="OBSCURED"
        firstSubtitle="About the site"
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

        { /* Links */ }
        { linkSection }
      </main>
      

      <aside className="about-page__aside" >
        <HomeBar />
      </aside>
    </div>
  )
}

export default React.memo( trackWindowScroll( AboutPage ) );
