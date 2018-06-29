import { types } from 'mobx-state-tree';
import { Terminal as Xterm } from 'xterm';
import io from 'socket.io-client';
import * as fit from "xterm/lib/addons/fit/fit";
import { ViewStore } from "./ViewStore";

Xterm.applyAddon(fit);

export const Terminal = types.model('Terminal', {
  id: types.identifier(),
  name: types.string,
}).volatile(self => ({
  terminal: {},
  socket: null
})).actions(self => {
  let terminal = null;
  let socket = null;

  function afterCreate() {
    terminal = new Xterm({
      fontSize: 12
    });
    socket = io('http://localhost:16999');
    self.terminal = terminal;
    self.socket = socket;

    socket.emit('term.open', {id: 1, cols: terminal.cols, rows: terminal.rows});
    terminal.on('key', (key, ev) => {
      socket.emit('term.input', {id: 1, input: key});
    })
    socket.on('term.output', function(data) {
      terminal.write(data.output)
    });
    terminal.on('resize', ({cols, rows}) => {
      socket.emit('term.resize', {cols: cols, rows: rows})
    })
  }

  function beforeDestroy() {
    socket.close();
  }

  return {
    afterCreate,
    beforeDestroy
  }
});

export const Store = types
  .model('Store', {
    terminals: types.array(Terminal),
    view: types.optional(ViewStore, {})
  }).actions(self => {
    function createTerminal() {

      let term = {
        id: new Date().getTime() + '',
        name: 'Terminal',
      };
      self.terminals.push(term);
      self.view.terminalIndex = self.terminals.length - 1;
    }

    function removeTerminal(term) {
      console.log(term, arguments);
      let idx = self.terminals.findIndex((item) => item == term);console.log(idx)
      if (idx <= self.view.terminalIndex) {
        self.view.terminalIndex--;
      }
      console.log(self.view.terminalIndex)
      self.terminals.remove(term);
    }

    return {
      createTerminal,
      removeTerminal
    }
  });