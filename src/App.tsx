import React from "react";

import {
  Switch,
  Route,
} from "react-router-dom";

import { useAppSelector } from "./state/store/hooks";
import { ColorScheme, selectColorScheme } from "./state/slices/uiSlice";

import PageWrapper from "./pages/Page";

import MainPage from './pages/main/mainPage';
import AboutPage from "./pages/about/AboutPage";
import PiecesPage from "./pages/pieces/PiecesPage";
import BlogPage from "./pages/blog/BlogPage";
import ContactPage from "./pages/contact/ContactPage";

import GradientBackground from "./components/ornamental/gradient/GradientBackground";
import NoiseBackground from "./components/ornamental/noise/NoiseBackground";

import './App.scss';

export enum Routes {
  root = '/',
  self = '/self',
  pieces = '/pieces',
  blog = '/blog',
  contact = '/contact',
}

type Page = {
  name: string,
  route: Routes,
  colorScheme: ColorScheme,
  Component: React.FunctionComponent,
}

export const pages : Page[] = [
  {
    name: 'About',
    route: Routes.self,
    colorScheme: ColorScheme.swamp,
    Component: AboutPage,
  },
  {
    name: 'Pieces',
    route: Routes.pieces,
    colorScheme: ColorScheme.swamp,
    Component: PiecesPage
  },
  {
    name: 'Blog',
    route: Routes.blog,
    colorScheme: ColorScheme.swamp,
    Component: BlogPage
  },
  {
    name: 'Contact',
    route: Routes.contact,
    colorScheme: ColorScheme.swamp,
    Component: ContactPage
  },
  {
    name: 'Root',
    route: Routes.root,
    colorScheme: ColorScheme.horizon,
    Component: MainPage
  }
]

const App = () => {
  const colorScheme = useAppSelector( selectColorScheme );

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
          <PageWrapper colorScheme={ page.colorScheme }>
            <page.Component />
          </PageWrapper>
        </Route>

      ))}
      </Switch>
    </div>
  );
}

export default App;
