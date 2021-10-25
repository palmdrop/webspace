import React, { Suspense } from "react";

import {
  Switch,
  Route,
  useHistory,
  BrowserRouter as Router,
  Redirect
} from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./state/store/hooks";
import { ColorTheme, selectColorTheme, selectNextPageRoute, setColorTheme, setNextPageRoute } from "./state/slices/uiSlice";

import PageWrapper, { PageProps } from "./pages/PageWrapper";

import GradientBackground from "./components/ornamental/gradient/GradientBackground";
import NoiseBackground from "./components/ornamental/noise/NoiseBackground";

import { PageDidNotLoadErrorBoundry } from "./components/error/boundaries/PageDidNotLoadErrorBoundry";
import NotFoundPage from "./pages/notFound/notFoundPage";
import PageDidNotLoadPage from "./pages/pageDidNotLoad/pageDidNotLoadPage";

import './App.scss';

// Use lazy loading to load most pages
const MainPage    = React.lazy( () => import( "./pages/main/mainPage" ) );
const AboutPage   = React.lazy( () => import( "./pages/about/aboutPage" ) );
const PiecesPage  = React.lazy( () => import( "./pages/pieces/piecesPage" ) );
const BlogPage    = React.lazy( () => import( "./pages/blog/blogPage" ) );
const ContactPage = React.lazy( () => import( "./pages/contact/contactPage" ) );

export enum PageRoute {
  root = '/',
  self = '/self',
  pieces = '/pieces',
  blog = '/blog',
  contact = '/contact',
  notFound = '/404',
}

export type Page = {
  name : string,
  route : PageRoute,
  exactRoute : boolean,
  colorTheme : ColorTheme,
  scroll : boolean,
  Component : React.FunctionComponent<PageProps>,
}

export const pages : Page[] = [
  {
    name: 'About',
    route: PageRoute.self,
    exactRoute: true,
    colorTheme: ColorTheme.swamp,
    scroll: true,
    Component: AboutPage,
  },
  {
    name: 'Pieces',
    route: PageRoute.pieces,
    exactRoute: false,
    colorTheme: ColorTheme.dirty,
    scroll: false,
    Component: PiecesPage
  },
  {
    name: 'Blog',
    route: PageRoute.blog,
    exactRoute: false,
    colorTheme: ColorTheme.haze,
    scroll: false,
    Component: BlogPage
  },
  {
    name: 'Contact',
    route: PageRoute.contact,
    exactRoute: true,
    colorTheme: ColorTheme.vapor,
    scroll: true,
    Component: ContactPage
  },
  {
    name: 'Root',
    route: PageRoute.root,
    exactRoute: true,
    colorTheme: ColorTheme.horizon,
    scroll: false,
    Component: MainPage
  }
];

// Also store the page data in a map for easy access using path
export const routePageMap : Map<string, Page> = new Map(
  pages.map( page => [ page.route, page ] )
);

// Delay (for animation) before navigating to another page
export const REDIRECTION_DELAY = 500;

// Navigation hook that encapsulates the actions required to smoothly transition to another page
// The purpose of this hook is to make it easy for any element to trigger a smooth page transition
export const useNavigation = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const navigateTo = ( route : PageRoute ) => {
    const page = routePageMap.get( route );
    page && dispatch( setColorTheme( page.colorTheme ));

    dispatch( setNextPageRoute( route ) );
    setTimeout( () => {
      history.push( route );
    }, REDIRECTION_DELAY );
  };

  return navigateTo;
};

export const RedirectNotFound = () => <Redirect to={ PageRoute.notFound } />;

const App = () => {
  const colorTheme = useAppSelector( selectColorTheme );
  const nextPageRoute = useAppSelector( selectNextPageRoute );

  return (
    <div className={ `app app--${ colorTheme }` }>
      <GradientBackground colorTheme={ colorTheme } />
      <NoiseBackground opacity={ 0.4 } />

      <PageDidNotLoadErrorBoundry
        fallback={ PageDidNotLoadPage } 
      >

        { /* No fallback, just display background while loading */ }
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
                  fadeOut={ nextPageRoute !== null && page.route !== nextPageRoute }
                  scroll={ page.scroll }
                >
                  <page.Component route={ page.route } />
                </PageWrapper>
              </Route>
            ))}

              { /* 404 */ }
              <Route path={ PageRoute.notFound }>
                <NotFoundPage />
              </Route>
              <RedirectNotFound />
            </Switch>
          </Router>
        </Suspense>

      </PageDidNotLoadErrorBoundry>
    </div>
  );
}

export default App;
