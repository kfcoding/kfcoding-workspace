import React from 'react';
import SplitPane from 'react-split-pane';

import './App.css';
import Header from './Header';
import MonacoEditor from './MonacoEditor';
import FileTree from './FileTree';
import Bottom from './Bottom';
import { inject, observer } from "mobx-react/index";

const editorOptions = {
  selectOnLineNumbers: true
};

const App = inject('store')(
  observer(() => (
    <div className="App">
      <Header/>
      <div style={{height: 'calc(100% - 40px'}}>
        <SplitPane
          split='horizontal'
          defaultSize={200}
          style={{position: 'relative'}}
          primary="second"
          onDragFinished={this.onDragFinished}
        >
          <SplitPane
            defaultSize={256}
            onDragStarted={this.onDragStarted}
            pane2Style={{overflow: 'hidden'}}
          >
            <FileTree/>
            <MonacoEditor value="// coding" options={editorOptions}/>
          </SplitPane>
          <Bottom/>
        </SplitPane>
      </div>
    </div>
  ))
);

export default App;
