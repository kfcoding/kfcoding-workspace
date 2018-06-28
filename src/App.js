import React, { Component } from 'react';
import SplitPane from 'react-split-pane';

import './App.css';
import Header from './Header';
import MonacoEditor from './MonacoEditor';
import FileTree from './FileTree';
import Bottom from './Bottom';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
    }
  }

  onDragStarted = () => {
      console.log(arguments)
  }


  render() {
    const options = {
      selectOnLineNumbers: true
    };

    return (
      <div className="App">
        <Header/>
        <div style={{height: 'calc(100% - 40px'}}>
        <SplitPane
          split='horizontal'
          defaultSize={600}
          style={{position: 'relative'}}
        >
          <SplitPane
            defaultSize={256}
            onDragStarted={this.onDragStarted}
            pane2Style={{overflow: 'hidden'}}
          >
            <FileTree/>
            <MonacoEditor value={this.state.code} options={options}/>
          </SplitPane>
          <Bottom/>
        </SplitPane>
        </div>
      </div>
    );
  }
}

export default App;
