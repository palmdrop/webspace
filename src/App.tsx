import React from "react";

import {
  Switch,
  Route,
  useHistory,
} from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./state/store/hooks";
import { ColorScheme, selectColorScheme, selectNextPageRoute, setColorScheme, setNextPageRoute } from "./state/slices/uiSlice";

import PageWrapper, { PageProps } from "./pages/PageWrapper";

import MainPage from './pages/main/mainPage';
import AboutPage from "./pages/about/AboutPage";
import PiecesPage from "./pages/pieces/PiecesPage";
import BlogPage from "./pages/blog/BlogPage";
import ContactPage from "./pages/contact/ContactPage";

import GradientBackground from "./components/ornamental/gradient/GradientBackground";
import NoiseBackground from "./components/ornamental/noise/NoiseBackground";

import './App.scss';

export enum PageRoute {
  root = '/',
  self = '/self',
  pieces = '/pieces',
  blog = '/blog',
  contact = '/contact',
}

export type Page = {
  name: string,
  route: PageRoute,
  colorScheme: ColorScheme,
  Component: React.FunctionComponent<PageProps>
}

export const pages : Page[] = [
  {
    name: 'About',
    route: PageRoute.self,
    colorScheme: ColorScheme.swamp,
    Component: AboutPage,
  },
  {
    name: 'Pieces',
    route: PageRoute.pieces,
    colorScheme: ColorScheme.swamp,
    Component: PiecesPage
  },
  {
    name: 'Blog',
    route: PageRoute.blog,
    colorScheme: ColorScheme.swamp,
    Component: BlogPage
  },
  {
    name: 'Contact',
    route: PageRoute.contact,
    colorScheme: ColorScheme.swamp,
    Component: ContactPage
  },
  {
    name: 'Root',
    route: PageRoute.root,
    colorScheme: ColorScheme.horizon,
    Component: MainPage
  }
];

// Also store the page data in a map for easy access using path
const routePageMap : Map<string, Page> = new Map(
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
      <Switch>
      { pages.map( page => (

        <Route 
          key={ page.route }
          path={ page.route }
        >
          <PageWrapper 
            route={ page.route }
            colorScheme={ page.colorScheme }
          >
            <page.Component 
              route={ page.route }
              fadeOut={ nextPageRoute !== null && page.route !== nextPageRoute }
            />
          </PageWrapper>
        </Route>

      ))}
      </Switch>
    </div>
  );
}

export default App;
