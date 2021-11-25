import { Suspense, useMemo } from 'react';
import { Route, Switch } from 'react-router';
import ExternalLink from '../../components/link/ExternalLink';
import HomeBar from '../../components/navigation/home/HomeBar';
import Paragraph from '../../components/paragraph/Paragraph';
import Title from '../../components/title/Title';
import { PageProps } from '../PageWrapper';

import { postsData } from './posts/data';

import './blogPage.scss';
import Button from "../../components/input/button/Button";
import { Link } from "react-router-dom";

const BlogPage = ( { route } : PageProps ) : JSX.Element => {
  const categories = useMemo( () => postsData.map( ( { metadata }, index ) => (
    <Button
      additionalClasses={ "blog-page__category-button" }
      key={ index }
    >
      { metadata.keywords[0] }
    </Button>
  )), [])

  const postRoutes = useMemo( () => postsData.map( ( { metadata, Component } ) => (
    <Route
      key={ metadata.id }
      path={ `${ route }/post${ metadata.id }` as string } 
      exact
    >
      <Component />
    </Route>
  )), [ route ] );

  const links = useMemo( () => postsData.map( ( { metadata }, index ) => (
    <Link
      to={ `${ route }/post${ metadata.id }` }
      className="blog-page__post-link"
      key={ index }
    >
      { metadata.title }
    </Link>
  )), [ route ])

  return (
    <div className='blog-page'>
      <Suspense fallback={ null }>
        <Switch>
          { postRoutes }

          <Route 
            path={ route }
            exact
          >
            <div>
              { /* 
              <Title
                text="Work In Progress"
                level={ 3 }
              />
              <Paragraph>
                For this project, I do not intend to display a finished product -- I don't want to create a product at all. 
                This place will grow organically as my skills and interests grow and shift. 
              </Paragraph>
              <Paragraph>
                I have yet to build the blog section of this site. Please refer to my old (and unfortunately very inactive) blog: 
                <ExternalLink link="https://palmdrop.github.io/">
                  { ' palmdrop.github.io ' }
                </ExternalLink>
              </Paragraph>
              */ }

              <Title
                text="Mind Fog"
                level={ 1 }
              />
              <div className="blog-page__categories">
                { categories }
              </div>
              <section
                className="blog-page__posts"
              >
                { links }
              </section>
            </div>

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
