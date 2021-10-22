import React from 'react';
import ReactDOM from 'react-dom';

import HttpsRedirect from 'react-https-redirect';
import { Provider } from 'react-redux';
import { store } from './state/store/store';

import App from './App';

import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <HttpsRedirect>
      <Provider store={ store }>
        <App />
      </Provider>
    </HttpsRedirect>
  </React.StrictMode>,
  document.getElementById('root')
);
