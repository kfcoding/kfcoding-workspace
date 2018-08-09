import { types, getParent } from 'mobx-state-tree';
import { File } from "./FileStore";

export const ViewStore = types
  .model({
    terminalIndex: -1,
    editorIndex: -1,
    loading: true,
    loadingMsg: 'Loading...',
    bottomHeight: 30,
    currentFilePath: '',
    workOpen: false
  }).actions(self => ({
    setTerminalIndex(idx) {
      self.terminalIndex = idx;
    },
    setEditorIndex(idx) {
      self.editorIndex = idx;
    },
    setLoading(loading) {
      self.loading = loading;
    },
    setLoadingMsg(msg) {
      self.loadingMsg = msg;
    },
    setBottomHeight(height) {
      self.bottomHeight = height;
    },
    setCurrentFilePath(path) {
      self.currentFilePath = path;
    },
    showWork() {
      self.workOpen = true;
    },
    hideWork() {
      self.workOpen = false;
    }
  }));