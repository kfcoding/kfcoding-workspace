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
    files: [],
    openedFiles: [],
    workspace_id: '',
    workId: ''
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
