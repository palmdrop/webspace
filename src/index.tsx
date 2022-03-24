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
  document.getElementById( 'root' )
);

console.log( '//  Obscured - A personal webspace' );
console.log( '//  by palmdrop' );
console.log( '// ' );
console.log( '//  This site does not track any of your personal data.' );
console.log( '//  There are no cookies, no fingerprinting.' );
console.log( '//  Inspect the complete source code at https://github.com/palmdrop/webspace' );
