import React, { Suspense } from "react";

import {
  Switch,
  Route,
  useHistory,
  BrowserRouter as Router,
} from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./state/store/hooks";
import { ColorThemes, selectColorScheme, selectNextPageRoute, setColorScheme, setNextPageRoute } from "./state/slices/uiSlice";

import PageWrapper, { PageProps } from "./pages/PageWrapper";

import GradientBackground from "./components/ornamental/gradient/GradientBackground";
import NoiseBackground from "./components/ornamental/noise/NoiseBackground";

import './App.scss';

// Use lazy loading to load each page
const MainPage = React.lazy( () => import("./pages/main/mainPage") );
const AboutPage = React.lazy( () => import("./pages/about/aboutPage") );
const PiecesPage = React.lazy( () => import("./pages/pieces/piecesPage") );
const BlogPage = React.lazy( () => import("./pages/blog/blogPage") );
const ContactPage = React.lazy( () => import("./pages/contact/contactPage") );

export enum PageRoute {
  root = '/',
  self = '/self',
  pieces = '/pieces',
  blog = '/blog',
  contact = '/contact',
  test = '/test',
}

export type Page = {
  name : string,
  route : PageRoute,
  colorScheme : ColorThemes,
  scroll : boolean,
  Component : React.FunctionComponent<PageProps>
}

export const pages : Page[] = [
  {
    name: 'About',
    route: PageRoute.self,
    colorScheme: ColorThemes.swamp,
    scroll: true,
    Component: AboutPage,
  },
  {
    name: 'Pieces',
    route: PageRoute.pieces,
    colorScheme: ColorThemes.dirty,
    scroll: false,
    Component: PiecesPage
  },
  {
    name: 'Blog',
    route: PageRoute.blog,
    colorScheme: ColorThemes.swamp,
    scroll: true,
    Component: BlogPage
  },
  {
    name: 'Contact',
    route: PageRoute.contact,
    colorScheme: ColorThemes.swamp,
    scroll: false,
    Component: ContactPage
  },
  /*{
    name: 'Test',
    route: PageRoute.test,
    colorScheme: ColorScheme.horizon,
    scroll: false,
    Component: () => (<div className="test-page">
      <AnimationCanvas renderSceneConstructor={ MainRenderScene }/>
    </div>)
  },*/
  {
    name: 'Root',
    route: PageRoute.root,
    colorScheme: ColorThemes.horizon,
    scroll: false,
    Component: MainPage
  }
];

// Also store the page data in a map for easy access using path
export const routePageMap : Map<string, Page> = new Map(
  pages.map( page => [ page.route, page ])
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
    page && dispatch( setColorScheme( page.colorScheme ));

    dispatch( setNextPageRoute( route ) );
    setTimeout( () => {
      history.push( route );
    }, REDIRECTION_DELAY );
  };

  return navigateTo;
};

const App = () => {
  const colorScheme = useAppSelector( selectColorScheme );
  const nextPageRoute = useAppSelector( selectNextPageRoute );

  return (
    <div className={ `app app--${ colorScheme }` }>
      <GradientBackground />
      <NoiseBackground opacity={ 0.4 } />

      <Suspense fallback={ null }>
        <Router>
          <Switch>
          { pages.map( page => (
            <Route 
              key={ page.route }
              path={ page.route }
            >
              <PageWrapper 
                route={ page.route }
                colorScheme={ page.colorScheme }
                scroll={ page.scroll }
              >
                <page.Component 
                  route={ page.route }
                  fadeOut={ nextPageRoute !== null && page.route !== nextPageRoute }
                />
              </PageWrapper>
            </Route>
          ))}
          </Switch>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
