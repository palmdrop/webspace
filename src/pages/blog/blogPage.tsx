import React from 'react';
import { Suspense, useMemo, useState } from 'react';
import { Route, Switch } from 'react-router';
import Title from '../../components/title/Title';
import { PageProps } from '../PageWrapper';

import { postsData, images } from './posts/data';

import Button from '../../components/input/button/Button';
import { Link } from 'react-router-dom';

import { allPostsData, categories, formatDate, postDataByCategory } from './blog';
import { PostData, PostMetadata } from './components/post/Post';
import Paragraph from '../../components/paragraph/Paragraph';
import Bar from '../../components/ornamental/bars/Bar';
import InfoModal from './components/info-modal/InfoModal';
import { nameToPath } from '../../utils/general';

import { ReactComponent as Obstacle } from '../../assets/svg/obstacle7.svg';

import SimpleNavBar from '../../components/navigation/navbar/simple/SimpleNavBar';
import { createNavEntries } from '../../components/navigation/navbar/NavBar';
import { PageRoute, pages } from '../../App';

import Modal from '../../components/modal/Modal';
// import { useSelector } from 'react-redux';
// import { selectIsAdmin } from '../../state/slices/adminSlice';
// import { RootState } from '../../state/store/store';

import './blogPage.scss';

// eslint-disable-next-line react/prop-types
const BlogPage = ( { route } : PageProps ) : JSX.Element => {
  const [ activeCategory, setActiveCategory ] = useState<string | null>( null );

  const title = process.env.REACT_APP_BLOG_TITLE ?? 'blog';
  const underConstruction = false; // useSelector( ( state : RootState ) => !selectIsAdmin( state ) );

  const categoryButtons = useMemo( () => categories
    .map( ( category, index ) => (
      <Button
        key={ `category-${ index }` }
        additionalClasses={ 
          'blog-page__category-button' +
          ( category === activeCategory ? ' blog-page__category-button--pressed' : '' )
        }
        onClick={ () => setActiveCategory( category === activeCategory ? null : category ) }
      >
        { category }
      </Button>
    )
    ), [ activeCategory ] );

  const postRoutes = useMemo( () => postsData.map( ( 
    { metadata, Component } : { metadata : PostMetadata, Component : React.FunctionComponent }
  ) => (
    <Route
      key={ metadata.id }
      path={ `${ route }/${ nameToPath( metadata.title ) }` as string }
      exact
    >
      <Component />
    </Route>
  ) ), [ route ] );

  // TODO react virtualized/window in the future? 
  // This will also solve issue of lazy-loading images! unmounted dom nodes will not force image to load
  // TODO recalculate based on selected category
  const links = useMemo( () => {
    const createLink = ( { metadata, snippet } : PostData ) => {
      return <Link
        to={ `${ route }/${ nameToPath( metadata.title ) }` }
        className="blog-page__post-link"
      >
        <div className='link-content'>
          <Title
            text={ metadata.title }
            level={ 2 } 
          />
          <span>
            { formatDate( metadata.date ) }
          </span>
        </div>
        { metadata.image && (
          <img
            src={ images[ metadata.id ] }
            alt={ `Image - ${ metadata.title }` }
          />
        )}
        <Paragraph>
          { snippet.trim() }
        </Paragraph>
        <Bar
          direction="horizontal"
          variant="inset"
        />
      </Link>;
    };

    if( activeCategory ) {
      return postDataByCategory[ activeCategory ] ? postDataByCategory[ activeCategory ].map( createLink ) : [];
    }

    return allPostsData.map( createLink );
  }, [ route, activeCategory ] );

  const navEntries = useMemo( 
    () => createNavEntries( pages, PageRoute.blog ),
    [ pages ]
  );

  return (
    <div className='blog-page'>
      <Suspense fallback={ null }>
        { underConstruction && (
          <Modal 
            open
            closeOnEscape={ false }
            closeOnClickOutside={ false }
          >
            <Paragraph>
              This page is a work in progress.
            </Paragraph>
            <Link 
              to={ PageRoute.root }
            >
              <div className='link'>
                Go back
              </div>
            </Link>
          </Modal>
        ) }
        <Switch>
          { postRoutes }

          <Route 
            path={ route }
            exact
          >
            <header className="blog-page__header">
              <SimpleNavBar 
                entries={ navEntries }
              />
            </header>
            <main>
              <Obstacle className='obstacle' />
              <Title
                text={ title }
                level={ 1 }
              />
              <div className='blog-page__info'>
                <InfoModal />
              </div>
              <Bar
                direction="horizontal"
                variant="inset"
              />
              <div className="blog-page__categories">
                { categoryButtons }
              </div>
              <section
                className="blog-page__posts"
              >
                { links }
              </section>
            </main>
            <footer className="blog-page__footer">
              <SimpleNavBar 
                entries={ navEntries }
              />
            </footer>
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
};

export default BlogPage;
