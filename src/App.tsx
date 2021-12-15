import React, { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect
} from 'react-router-dom';

import { useAppSelector } from './state/store/hooks';
import { ColorTheme, selectColorTheme } from './state/slices/uiSlice';

import PageWrapper, { PageProps } from './pages/PageWrapper';

import NotFoundPage from './pages/notFound/notFoundPage';
import PageDidNotLoadPage from './pages/pageDidNotLoad/pageDidNotLoadPage';

import GradientBackground from './components/ornamental/gradient/GradientBackground';

import './App.scss';

// Use lazy loading to load most pages
const MainPage = React.lazy( () => import( './pages/main/mainPage' ) );
const AboutPage = React.lazy( () => import( './pages/about/aboutPage' ) );
const PiecesPage = React.lazy( () => import( './pages/pieces/piecesPage' ) );
const BlogPage = React.lazy( () => import( './pages/blog/blogPage' ) );
const LinksPage = React.lazy( () => import( './pages/links/linksPage' ) );
const ContactPage = React.lazy( () => import( './pages/contact/contactPage' ) );

export enum PageRoute {
  root = '/',
  self = '/self',
  pieces = '/pieces',
  blog = '/blog',
  links = '/links',
  contact = '/contact',
  notFound = '/404',
}

export type Page = {
  name : string,
  route : PageRoute,
  exactRoute : boolean,
  colorTheme : ColorTheme,
  Component : React.FunctionComponent<PageProps>,
}

export const pages : Page[] = [
  {
    name: 'About',
    route: PageRoute.self,
    exactRoute: true,
    colorTheme: ColorTheme.swamp,
    Component: AboutPage,
  },
  {
    name: 'Pieces',
    route: PageRoute.pieces,
    exactRoute: false,
    colorTheme: ColorTheme.dirty,
    Component: PiecesPage
  },
  {
    name: 'Blog',
    route: PageRoute.blog,
    exactRoute: false,
    colorTheme: ColorTheme.haze,
    Component: BlogPage
  },
  {
    name: 'Links',
    route: PageRoute.links,
    exactRoute: false,
    colorTheme: ColorTheme.digital,
    Component: LinksPage
  },
  {
    name: 'Contact',
    route: PageRoute.contact,
    exactRoute: true,
    colorTheme: ColorTheme.vapor,
    Component: ContactPage
  },
  {
    name: 'Root',
    route: PageRoute.root,
    exactRoute: true,
    colorTheme: ColorTheme.horizon,
    Component: MainPage
  }
];

// Also store the page data in a map for easy access using path
export const routePageMap : Map<string, Page> = new Map(
  pages.map( page => [ page.route, page ] )
);

export const RedirectNotFound = () => <Redirect to={ PageRoute.notFound } />;

const App = () => {
  const colorTheme = useAppSelector( selectColorTheme );
  
  return (
    <div className={ `app app--${ colorTheme }` }>
      <GradientBackground colorTheme={ colorTheme } />

      <ErrorBoundary
        FallbackComponent={ PageDidNotLoadPage }
      >
        <Suspense fallback={ null }>
          <Router>
            <Switch>
              { pages.map( page => (
                <Route 
                  key={ page.route }
                  path={ page.route }
                  exact={ page.exactRoute }
                >
                  <PageWrapper 
                    route={ page.route }
                    colorTheme={ page.colorTheme }
                  >
                    <page.Component route={ page.route } />
                  </PageWrapper>
                </Route>
              ) )}

              <Route path={ PageRoute.notFound }>
                <NotFoundPage />
              </Route>
              <RedirectNotFound />
            </Switch>
          </Router>
        </Suspense>

      </ErrorBoundary>
    </div>
  );
};

export default App;
