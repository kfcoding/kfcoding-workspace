import React from 'react';
import * as monaco from 'monaco-editor';
import { measure } from '@pinyin/measure'

const Div = measure('div');

class MonacoEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dom = React.createRef();
    this.editor = null;
  }

  editorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor);
    editor.focus();
  }
  onChange = (newValue, e) => {
    console.log('onChange', newValue, e);
    this.setState({code: newValue})
  }

  componentDidMount() {
    this.editor = monaco.editor.create(this.dom, {
      value: this.props.value,
      language: 'javascript',
      theme: 'vs-dark'
    });
  }

  handleResize = () => {
    if (this.editor) {
      this.editor.layout();
    }
  }

  render() {

    return (
      <Div
        style={{width: '100%', height: '100%'}}
        onWidthChange={this.handleResize}
      >
        <div ref={dom => this.dom = dom} style={{width: '100%', height: '100%'}}></div>
      </Div>
    );
  }
}

export default MonacoEditor;