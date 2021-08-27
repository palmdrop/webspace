import React from "react";

import {
  Switch,
  Route,
} from "react-router-dom";

import MainPage from './pages/main/mainPage';
import AboutPage from "./pages/about/AboutPage";
import PiecesPage from "./pages/pieces/PiecesPage";
import BlogPage from "./pages/blog/BlogPage";
import ContactPage from "./pages/contact/ContactPage";

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
  Component: React.FunctionComponent,
}

export const pages : Page[] = [
  {
    name: 'About',
    route: Routes.self,
    Component: AboutPage
  },
  {
    name: 'Pieces',
    route: Routes.pieces,
    Component: PiecesPage
  },
  {
    name: 'Blog',
    route: Routes.blog,
    Component: BlogPage
  },
  {
    name: 'Contact',
    route: Routes.contact,
    Component: ContactPage
  },
  {
    name: 'Root',
    route: Routes.root,
    Component: MainPage
  }
]

const App = () => {
  return (
    <Switch>
    { pages.map( page => (

      <Route 
        key={ page.route }
        path={ page.route }
      >
        <page.Component />
      </Route>

    ))}
    </Switch>
  );
}

export default App;
