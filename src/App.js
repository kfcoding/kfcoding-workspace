import React from 'react';
import SplitPane from 'react-split-pane';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import IconClose from 'react-icons/lib/md/close';

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
  observer(({store}) => (
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
            <Tabs style={{height: '100%'}}>
              <TabList>
                {store.openedFiles.map(t => <Tab key={t}>{t.name} <IconClose style={{marginLeft: '10px'}} onClick={(e) => {store.removeTerminal(t);e.stopPropagation()}}/></Tab>)}
                <button onClick={() => {store.openFile(store.fileStore.files[12])}}>open</button>
              </TabList>
              {store.openedFiles.map(t => <TabPanel key={t} style={{height: 'calc(100% - 25px)', background: '#000'}}><MonacoEditor value={t.content} options={editorOptions}/></TabPanel>)}
            </Tabs>
          </SplitPane>
          <Bottom/>
        </SplitPane>
      </div>
    </div>
  ))
);

export default App;
