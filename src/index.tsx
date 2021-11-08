import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { store } from './state/store/store';

import './index.scss';
import App from './App';


ReactDOM.render(
  <React.StrictMode>
      <Provider store={ store }>
        <App />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

console.log("##################")
console.log("#### OBSCURED ####")
console.log("##################")
console.log("#### palmdrop ####")
console.log("##################")