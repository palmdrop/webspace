import {
  Switch,
  Route,
} from "react-router-dom";

import MainPage from './pages/main/mainPage';

import './App.scss';
import React from "react";
import ContactPage from "./pages/contact/ContactPage";
import PiecesPage from "./pages/pieces/PiecesPage";
import BlogPage from "./pages/blog/BlogPage";
import AboutPage from "./pages/about/AboutPage";

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
    name: 'AbouT',
    route: Routes.self,
    Component: AboutPage
  },
  {
    name: 'PieceS',
    route: Routes.pieces,
    Component: PiecesPage
  },
  {
    name: 'BloG',
    route: Routes.blog,
    Component: BlogPage
  },
  {
    name: 'ContacT',
    route: Routes.contact,
    Component: ContactPage
  },
  {
    name: 'RooT',
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
