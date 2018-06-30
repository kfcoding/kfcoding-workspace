import React from 'react';
import * as monaco from 'monaco-editor';
import { measure } from '@pinyin/measure'

const Div = measure('div');

class MonacoEditor extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: props.value || '// insert your code'
    }

    this.dom = React.createRef();
    this.editor = null;
  }

  editorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor);
    editor.focus();
  }

  onChange = (newValue, e) => {
    console.log('onChange', newValue, e);
    this.setState({code: newValue});
  }

  componentWillReceiveProps(next) {
    if (next.value) {
      this.setState({code: next.value});
      this.editor.setValue(next.value);
    }
  }

  componentDidMount() {
    this.editor = monaco.editor.create(this.dom, {
      value: this.state.code,
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