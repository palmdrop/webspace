import React from "react";

import {
  Switch,
  Route,
} from "react-router-dom";

import { useAppSelector } from "./state/store/hooks";
import { ColorScheme, selectColorScheme, selectNextPageRoute } from "./state/slices/uiSlice";

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
