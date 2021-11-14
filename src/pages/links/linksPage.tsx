import React, { useCallback, useMemo, useState } from 'react'
import { PageRoute } from '../../App';
import FadedHeader from '../../components/header/faded/FadedHeader';
import Header from '../../components/header/Header';
import { PageProps } from '../PageWrapper';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle6.svg';

import Paragraph, { ParagraphType } from '../../components/paragraph/Paragraph';
import { categories, Category, Link, links } from './content';
import GlassCard from '../../components/cards/glass/GlassCard';
import Button from '../../components/input/button/Button';
import ExternalLink from '../../components/link/ExternalLink';
import { some } from 'lodash';
import HomeBar from '../../components/navigation/home/HomeBar';

import './linksPage.scss';

const LinksPage = ( { route } : PageProps ) => {
  const [ activeCategories, setActiveCategories ] = useState<Set<Category>>( new Set() );
  const [ activeLinks, setActiveLinks ] = useState<Set<Link>>( new Set() );

  // const getFirstActiveLink = () => activeLinks.size > 0 ? Array.from( activeLinks )[ 0 ] : { url : '', text : 'Default' };

  const categorizedLinksToSections = useCallback( ( categorizedLinks : { [ title : string ] : Link[] } ) => {
    const cleanURL = ( url: string ) => {
      return url
        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '') // Remove https and www from link
        .replace(/\/$/, '') // Remove trailing slash
      // Can be done as one regex sure but I do not know regex
    }

    const handleHover = ( link : Link ) => {
      const newActiveLinks = new Set( activeLinks );
      newActiveLinks.add( link );
      setActiveLinks( newActiveLinks );
    }

    const handleLeave = ( link : Link ) => {
      const newActiveLinks = new Set( activeLinks );
      newActiveLinks.delete( link );
      setActiveLinks( newActiveLinks );
    }

    return Object.entries( categorizedLinks ).map( ( [ title, links ], index ) => (
      <section 
        key={ `links-section-${ index }` }
        className="links-page__links-section"
      >
        <Header
          mainTitle={ title }
          mainLevel={ 3 }
        />
        { links.map( ( link, linkIndex ) => (
            <ExternalLink
              key={ `link-${ index }.${ linkIndex }`}
              link={ link.url }
              onHover={ () => handleHover( link ) }
              onLeave={ () => handleLeave( link ) }
            >
              { link.text }
              <div>
                { cleanURL( link.url ) }
              </div>
            </ExternalLink>
        ))}
      </section>
    ));
  }, [ activeLinks ] );

  const linkSections = useMemo( () => {
    const categorizedLinks : { [ title : string ] : Link[] } = {};

    if( activeCategories.size === 0 ) {
      // No filter applied
      links.forEach( link => {
        const categoryLinks = categorizedLinks[ link.category ] || [];
        categoryLinks.push( link );
        categorizedLinks[ link.category ] = categoryLinks;
      });

    } else {
      // Filter applied
      const filteredTitle = Array.from( activeCategories ).join( ', ' );

      const filteredLinks = links.filter( link => 
        activeCategories.has( link.category ) || 
        ( link.additionalCategories && some( link.additionalCategories, category => activeCategories.has( category ) )
      ));

      categorizedLinks[ filteredTitle ] = filteredLinks;
    }

    return categorizedLinksToSections( categorizedLinks );
  }, [ activeCategories, categorizedLinksToSections ] );


  const handleToggleCategory = ( category : Category ) => {
    const newActiveCategories = new Set( activeCategories );

    newActiveCategories.has( category ) 
      ? newActiveCategories.delete( category )
      : newActiveCategories.add( category );

    setActiveCategories( newActiveCategories );
  }

  return (
    <div className="links-page">
      <Header 
        mainTitle="OBSCURED"
        firstSubtitle="Other webspaces"
        mainLevel={ 3 }
        subLevel={ 5 }
        linkTo={ PageRoute.root }
      />

      <div className="links-page__container">
        <section className="links-page__intro">
          <div>
            <FadedHeader 
              title="Links"
            >
              <Obstacle className="faded-header__obstacle" />
            </FadedHeader>

            { /* Page introduction */ }
            <Paragraph type={ ParagraphType.normal }>
              This is my personal set of curated links.
              The Internet was built on the idea of the hyperlink: a portal that transfer you to some relevant or related location. 
              This process would be recursive: each webspace you visit in turn provides you with another set of hyperlinks. However,
              the range of most of these links has decreased: we're now only sent to different areas of the same corporate platforms. 
              But there's more. <ExternalLink link="https://memex.marginalia.nu/log/19-website-discoverability-crisis.gmi"> The author of the Marginalia blog put it well.</ExternalLink>
            </Paragraph>
          </div>

          <GlassCard>
            { categories.map( ( category, index ) => (
              <Button
                key={ `button-${ index }` }
                isPressed={ activeCategories.has( category )}
                onClick={ () => handleToggleCategory( category ) }
              >
                { category }
              </Button>
            ))}
          </GlassCard>
        </section>

        <section className="links-page__links">
          { linkSections }
        </section>
      </div>

      <HomeBar />
    </div>
  )
}

export default LinksPage;