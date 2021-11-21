import { Suspense } from "react";
import { Route, Switch } from "react-router";
import ExternalLink from "../../components/link/ExternalLink";
import HomeBar from "../../components/navigation/home/HomeBar";
import Paragraph from "../../components/paragraph/Paragraph";
import Title from "../../components/title/Title";
import { PageProps } from "../PageWrapper";

import { postsData } from "./posts/data";

import './blogPage.scss';

const BlogPage = ( { route } : PageProps ) : JSX.Element => {
  return (
    <div className='blog-page'>
      <Suspense fallback={ null }>
        <Switch>
          { postsData.map( ( { metadata, Component } ) => (

            <Route
              key={ metadata.id }
              path={ `${ route }/post${ metadata.id }` as string } 
              exact
            >
              <Component />
            </Route>
          ))}

          <Route
            path={ `${ route }/testing` }
          >
            Blog testing
          </Route>

          <Route 
            path={ route }
            exact
          >
            <div>
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
                  { " palmdrop.github.io " }
                </ExternalLink>
              </Paragraph>
            </div>

            <HomeBar />
          </Route>
        </Switch>
      </Suspense>
    </div>
  )
}

export default BlogPage;
