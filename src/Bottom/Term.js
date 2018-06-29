import React from 'react';
import { measure } from '@pinyin/measure';
import 'xterm/dist/xterm.css';

const Div = measure('div');

class Term extends React.Component {
  constructor(props) {
    super(props);

    this.dom = React.createRef();
  }

  componentDidMount() {

    this.props.terminal.terminal.open(this.dom);
    this.props.terminal.terminal.fit();

  }

  resize = () => {
    if (this.props.terminal.terminal)
      this.props.terminal.terminal.fit()
  }

  render() {
    return (
      <Div
        style={{width: '100%', height: '100%'}}
        onWidthChange={this.resize}
      >
        <div ref={dom => this.dom = dom} style={{width: '100%', height: '100%'}}></div>

      </Div>
    )
  }
}

export default Term;