import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './index.scss';

import App from './App';
import { Provider } from 'react-redux';
import { store } from './state/store/store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store= { store }>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
