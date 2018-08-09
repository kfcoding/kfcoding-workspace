import React from 'react';
import SplitPane from 'react-split-pane';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import IconClose from 'react-icons/lib/md/close';
import LoadingScreen from 'react-loading-screen';
import {HotKeys} from 'react-hotkeys';

import './App.css';
import Header from './Header';
import MonacoEditor from './MonacoEditor';
import FileTree from './FileTree';
import Bottom from './Bottom';
import { inject, observer } from "mobx-react/index";
import { mimeToType } from "./utils/language";
import icons from "file-icons-js";
import 'file-icons-js/css/style.css';

const map = {
  saveFiles: ['command+s', 'ctrl+s']
};

const editorOptions = {
  selectOnLineNumbers: true
};

const App = inject('store')(
  observer(({store}) => {
    const handlers = {
      saveFiles: store.saveFiles
    };

    return (
      <LoadingScreen
        loading={store.view.loading}
        bgColor='#444'
        spinnerColor='#9ee5f8'
        textColor='#fff'
        logoSrc='http://kfcoding.com/static/media/pic.83e638f3.png'
        text={store.view.loadingMsg}
      >
        <HotKeys keyMap={map} handlers={handlers} className="App">
          <Header/>
          <div style={{height: 'calc(100% - 48px'}}>
            <SplitPane
              split='horizontal'
              defaultSize={30}
              minSize={30}
              size={store.view.bottomHeight}
              style={{position: 'relative'}}
              primary="second"
              onChange={(size) => {store.view.setBottomHeight(size)}}
            >
              <SplitPane
                defaultSize={256}
                onDragStarted={this.onDragStarted}
                pane2Style={{overflow: 'hidden'}}
              >
                <FileTree/>
                {/*<div style={{background: '#24282A', color: '#e0e0e0', height: '100%'}}>*/}
                  {/*{store.files.map(f => <div onClick={() => {store.openFile(f)}}>{f.name}</div>)}*/}
                {/*</div>*/}
                <Tabs selectedIndex={store.view.editorIndex} onSelect={tabIndex => store.view.setEditorIndex(tabIndex)} style={{background: '#1c2022', color: '#e0e0e0', height: '100%'}}>
                  <TabList>
                    {store.openedFiles.map(t => <Tab key={t}><i style={{fontStyle: 'normal'}} className={icons.getClassWithColor(t.name)}></i> {t.dirty ? <b style={{color: 'red'}}>{t.name}</b> : t.name} <IconClose style={{marginLeft: '10px'}} onClick={(e) => {store.closeFile(t);e.stopPropagation()}}/></Tab>)}
                  </TabList>
                  {store.openedFiles.map(t => <TabPanel key={t} style={{height: 'calc(100% - 25px)', background: '#000'}}><MonacoEditor language={mimeToType(t.type)} value={t.content} options={editorOptions} file={t}/></TabPanel>)}
                </Tabs>
              </SplitPane>
              <Bottom/>
            </SplitPane>
          </div>
        </HotKeys>
      </LoadingScreen>
    );
  })
);

export default App;
