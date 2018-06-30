import { types, getParent } from 'mobx-state-tree';

export const ViewStore = types
  .model({
    terminalIndex: -1,
    editorIndex: -1
  }).actions(self => ({
    setTerminalIndex(idx) {
      self.terminalIndex = idx;
    },
    setEditorIndex(idx) {
      self.editorIndex = idx;
    }
  }));