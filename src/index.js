import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "mobx-react"
import { types, onSnapshot } from "mobx-state-tree"

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Store} from "./store";

const store = Store.create(
  {
    terminals: [],
    files: [{
      name: 'aaa',
      path: '/aaa',
      size: 123,
      isDir: false,
      type: 'text',
      children: []
    }],
    openedFiles: []
  }
);

onSnapshot(store, (snapshot) => {
  console.dir(snapshot)
})

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
