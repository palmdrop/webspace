import { Suspense, useMemo, useState } from "react";
import { Route, Switch } from "react-router";
import HomeBar from "../../components/navigation/home/HomeBar";
import Title from "../../components/title/Title";
import { PageProps } from "../PageWrapper";

import { postsData } from './posts/data';

import Button from "../../components/input/button/Button";
import { Link } from "react-router-dom";

import './blogPage.scss';
import { allPostsMetadata, categories, postMetadataByCategory } from "./blog";
import { PostMetadata } from "./components/post/Post";
import Paragraph, { ParagraphType } from "../../components/paragraph/Paragraph";
import Bar from "../../components/ornamental/bars/Bar";
import SoftDisk from "../../components/ornamental/disk/soft/SoftDisk";
import Modal from "../../components/modal/Modal";
import InfoModal from "./components/info-modal/InfoModal";

const BlogPage = ( { route } : PageProps ) : JSX.Element => {
  const [ activeCategory, setActiveCategory ] = useState<string | null>( null );

  const categoryButtons = useMemo( () => categories
    .map( ( category, index ) => (
      <Button
        key={ `category-${ index }` }
        additionalClasses={ 
          "blog-page__category-button" +
          ( category === activeCategory ? " blog-page__category-button--pressed" : "" )
        }
        onClick={ () => setActiveCategory( category === activeCategory ? null : category ) }
      >
        { category }
      </Button>
    )
  ), [ activeCategory ]);

  const postRoutes = useMemo( () => postsData.map( ( { metadata, Component } ) => (
    <Route
      key={ metadata.id }
      path={ `${ route }/post${ metadata.id }` as string } 
      exact
    >
      <Component />
    </Route>
  )), [ route ] );

  // TODO react virtualized/window in the future? 
  // TODO recalculate based on selected category
  const links = useMemo( () => {
    const createLink = ( metadata : PostMetadata ) => (
      <Link
        to={ `${ route }/post${ metadata.id }` }
        className="blog-page__post-link"
      >
        { metadata.title }
      </Link>
    )

    if( activeCategory ) {
      return postMetadataByCategory[ activeCategory ] ? postMetadataByCategory[ activeCategory ].map( createLink ) : [];
    }

    return allPostsMetadata.map( createLink );
  }, [ route, activeCategory ])

  return (
    <div className='blog-page'>
      <Suspense fallback={ null }>
        <Switch>
          { postRoutes }

          <Route 
            path={ route }
            exact
          >
            <main>
              <Title
                text="mind fog"
                level={ 1 }
              />
              <div className="blog-page__info">
                <Paragraph>
                  a blog by palmdrop
                </Paragraph>
                <InfoModal />
              </div>
              <Bar
                direction="horizontal"
                variant="inset"
              />
              <div className="blog-page__categories">
                { categoryButtons }
              </div>
              <Bar
                direction="horizontal"
                variant="inset"
              />
              <section
                className="blog-page__posts"
              >
                { links }
              </section>
            </main>

            { /*
              add navbar on top, for back to page, pieces, contact, etc... 
              also add faded "questionmark" that user can press to see more info about blog in popup modal
              rename blog post 
            */ }
            <nav>

            </nav>

            <HomeBar 
              text={ "Home" }
            />
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
};

export default BlogPage;
