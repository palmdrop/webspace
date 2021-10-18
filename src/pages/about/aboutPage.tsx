import React, { useState } from 'react'

import { ScrollPosition, trackWindowScroll } from 'react-lazy-load-image-component';
import LazyImage from '../../components/media/image/LazyImage';

import { PageRoute } from '../../App';
import { PageProps } from '../PageWrapper';

import FadedHeader from '../../components/header/faded/FadedHeader';
import Header from '../../components/header/Header';
import Paragraph, { ParagraphType } from '../../components/paragraph/Paragraph';
import SoftDisk from '../../components/ornamental/disk/soft/SoftDisk';
import GlassCard from '../../components/cards/glass/GlassCard';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle3.svg';

import HomeBar from '../../components/navigation/home/HomeBar';
import ExternalLink from '../../components/link/ExternalLink';

import { ImageData, introduction, sections, links, creditsSections, CreditsSection } from './content';

import 'react-lazy-load-image-component/src/effects/opacity.css';
import './aboutPage.scss';
import Title from '../../components/title/Title';
import Bar from '../../components/ornamental/bars/Bar';

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
        >
          <label>
            { alt }
          </label>
        </LazyImage>

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

  const createLinks = () : JSX.Element => {
    return (
      <div
        className="about-page__link-section"
      >
        <FadedHeader 
          title="More of me"
        />
        <SoftDisk />
        <GlassCard>
          <div>
            { links.map( ( { text, path }, index ) => (
              <ExternalLink 
                key={ `${ path }-${ index }` }
                link={ path }
              >
                { text }
              </ExternalLink>
            ))
            }
          </div>
        </GlassCard>
      </div>
    )
  }

  const createCredits = () : JSX.Element => {
    const createCreditsSection = ( creditsSection : CreditsSection, sectionIndex : number ) => {
      return (
        <div 
          className="about-page__credits-section"
          key={ `credits-section-${ sectionIndex }`}
        >
          <Title
            text={ creditsSection.title }
            level={ 5 }
          />
          <div>
            { creditsSection.entries.map( ( entry, entryIndex ) => (
              <ExternalLink
                link={ entry.path }
                key={ `entry-${ sectionIndex }.${ entryIndex }` }
              >
                { entry.text }
              </ExternalLink>    
            ))}
          </div>
        </div>
      )
    } 

    return (
      <div className="about-page__credits">
        <FadedHeader 
          title="Credits"
        />
        <SoftDisk />
        <GlassCard>
          { creditsSections.map( ( creditsSection, index ) => (
            <>
              { createCreditsSection( creditsSection, index ) }
              { index !== ( creditsSections.length - 1 ) && ( 
                <Bar
                  direction="horizontal"
                  variant="inset"
                />
              )}
            </>
          ))}
        </GlassCard>
      </div>
    )
  }

  const [ mainContent ] = useState( () => createMainContent() );
  const [ linkSection ] = useState( () => createLinks() );
  const [ creditsSection ] = useState( () => createCredits() );

  return (
    <div className="about-page">
      { /* Headers */ }
      <Header 
        mainTitle="OBSCURED"
        firstSubtitle="About this place"
        mainLevel={ 3 }
        subLevel={ 5 }
        linkTo={ PageRoute.root }
      />

      <div className="about-page__content">
        <main>
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

        </main>

        <footer>
          { /* Links */ }
          { linkSection }

          { creditsSection }
        </footer>
      </div>

      <aside className="about-page__aside" >
        <HomeBar />
      </aside>
    </div>
  )
}

export default React.memo( trackWindowScroll( AboutPage ) );
