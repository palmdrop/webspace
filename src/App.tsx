import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import MainPage from './pages/main/MainPage';

import './App.scss';

export enum Routes {
  root = '/',
  self = '/self',
  pieces = '/pieces',
  blog = '/blog',
  contact = '/contact',
}

const App = () => {
  return (
    <Router>

      <Switch>

        { /* Self Page */ }
        <Route path={Routes.self}>
          self
        </Route>

        { /* Pieces Page */ }
        <Route path={Routes.pieces}>
          pieces
        </Route>

        { /* Blog Page */ }
        <Route path={Routes.blog}>
          blog
        </Route>

        { /* Contact Page */ }
        <Route path={Routes.contact}>
          contact
        </Route>

        { /* Main Page */ }
        <Route path={Routes.root}>
          <MainPage />
        </Route>

      </Switch>

    </Router>
  );
}

export default App;
