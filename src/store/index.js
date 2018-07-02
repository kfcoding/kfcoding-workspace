import { types, getParent, applyAction } from 'mobx-state-tree';
import { Terminal as Xterm } from 'xterm';
import io from 'socket.io-client';
import * as fit from "xterm/lib/addons/fit/fit";
import { ViewStore } from "./ViewStore";
import { File, FileStore } from "./FileStore";
import { getQueryString } from '../utils/common'
import { getWorkSpace } from "../services/workspace";

Xterm.applyAddon(fit);

const WORKSPACE_DIR = '/tmp/workspace';

export const Terminal = types
  .model('Terminal', {
    id: types.identifier(),
    name: types.string,
  }).volatile(self => ({
    terminal: {}
  })).views(self => ({
    get store() {
      return getParent(self, 2)
    }
  })).actions(self => {
    let terminal = null;
    let socket = self.store.socket;

    function afterCreate() {
      terminal = new Xterm({
        fontSize: 12
      });
      self.terminal = terminal;

      socket.emit('term.open', {id: self.id, cols: terminal.cols, rows: terminal.rows, cwd: WORKSPACE_DIR});
      terminal.on('key', (key, ev) => {
        socket.emit('term.input', {id: self.id, input: key});
      });
      terminal.on('resize', ({cols, rows}) => {
        socket.emit('term.resize', {id: self.id, cols: cols, rows: rows})
      })
    }

    function beforeDestroy() {
      socket.emit('term.close', {id: self.id})
    }

    return {
      afterCreate,
      beforeDestroy
    }
  });

export const Store = types
  .model('Store', {
    view: types.optional(ViewStore, {}),
    terminals: types.array(Terminal),
    fileStore: types.optional(FileStore, {
      files: []
    }),
    repo: '',
    openedFiles: types.array(types.reference(File))
  }).volatile(self => ({
    socket: null
  })).views(self => ({
    get files() {
      return self.fileStore.files;
    }
  })).actions(self => {
    function setRepo(repo) {
      self.repo = repo;
    }

    function setSocket(socket) {
      self.socket = socket;
    }

    function afterCreate() {
      const id = getQueryString('id');
      //getWorkSpace(id).then(res => {
      fetch('http://localhost:3000/workspace', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'content-type': 'application/json'
        }
      }).then(res => res.json())
        .then(res => {
          console.log(res);
          const gitUrl = 'https://gitee.com/gdtongji/mobx-state-tree.git';//res.data.result.workspace.gitUrl;
          self.setRepo(gitUrl);


          self.view.setLoadingMsg('Connecting server...');
          /** connect socket **/
          let socket = io('http://' + res.name + '.workspace.cloudwarehub.com');

          self.setSocket(socket);
          // self.socket = socket;

          socket.on('term.output', function(data) {
            self.terminals.find(t => t.id === data.id).terminal.write(data.output)
          });
          /** fetch files **/
          socket.on('connect', () => {

            self.view.setLoadingMsg('Preparing workspace...');

            socket.emit('workspace.init', {
              repo: self.repo,
            }, () => {
              self.fileStore.loadFiles('/tmp/workspace', () => {
                self.view.setLoadingMsg('Completed! Happy coding~');
                setTimeout(() => {
                  self.view.setLoading(false);
                }, 2500)
              })
            })
          });
        })

      //})

    }

    function createTerminal() {
      let term = {
        id: new Date().getTime() + '',
        name: 'Terminal',
      };
      self.terminals.push(term);
      self.view.terminalIndex = self.terminals.length - 1;
      self.view.bottomHeight = 220;
    }

    function removeTerminal(term) {
      console.log(term, arguments);
      let idx = self.terminals.findIndex((item) => item === term);
      if (idx <= self.view.terminalIndex) {
        self.view.terminalIndex--;
      }
      self.terminals.remove(term);
    }

    function openFile(file) {
      self.fileStore.readfile(file, () => {
      });
      self.openedFiles.push(file);
      self.view.editorIndex = self.openedFiles.length -1;
      self.view.setCurrentFilePath(file.path);
    }

    function closeFile(file) {
      let idx = self.openedFiles.findIndex(item => item === file);
      if (idx <= self.view.editorIndex) {
        self.view.editorIndex--;
      }

      self.openedFiles.remove(file);
    }

    function saveFiles(e) {
      e.preventDefault();
      self.openedFiles.map(f => {
        self.socket.emit('fs.writefile', {path: f.path, content: f.content});
        f.setDirty(false)
      })
    }

    function hideBottom() {
      self.view.setBottomHeight(30);
    }

    return {
      setSocket,
      setRepo,
      afterCreate,
      createTerminal,
      removeTerminal,
      openFile,
      closeFile,
      saveFiles,
      hideBottom
    }
  });