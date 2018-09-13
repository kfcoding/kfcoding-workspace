import {getParent, types} from 'mobx-state-tree';
import {Terminal as Xterm} from 'xterm';
import io from 'socket.io-client';
import * as fit from "xterm/lib/addons/fit/fit";
import {ViewStore} from "./ViewStore";
import {File, FileStore} from "./FileStore";
import {getWork, keepWorkSpace, startWorkSpace} from "../services/workspace";
import {Work} from "./Work";
import {UploadStore} from "./UploadStore"

Xterm.applyAddon(fit);

const WORKSPACE_DIR = '/workspace';

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

    function exc(path) {
      // var excInput = 'g++ main.cpp -o main && ./main\n'
      var excInput;
      var array = path.split('.');
      if (array[array.length - 1] === 'cpp') {
        excInput = 'g++ ' + path + ' -o /tmp/out.o && /tmp/out.o\n';
      } else if (array[array.length - 1] === 'py') {
        excInput = 'python ' + path + '\n';
      } else {
        alert("不是合法文件");
      }
      socket.emit('term.input', {id: self.id, input: excInput})
    }

    return {
      exc,
      afterCreate,
      beforeDestroy
    }
  });

export const Store = types
  .model('Store', {
    view: types.optional(ViewStore, {}),
    terminals: types.array(Terminal),
    upload: types.optional(UploadStore, {}),
    fileStore: types.optional(FileStore, {
      files: []
    }),
    repo: '',
    openedFiles: types.array(types.reference(File)),
    workspace_id: types.string,
    workId: types.string,
    work: types.optional(Work, {
      name: '',
      description: ''
    })
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

    function setWorkId(id) {
      self.workId = id;
    }

    function setWork(work) {
      self.work = work;
    }

    function afterCreate() {
      const url = document.location.toString().split("//")[1];
      const id = url.split("/")[1];
      startWorkSpace(id).then(r => {
        const containerName = r.data.result.workspace.containerName;

        const repo = r.data.result.workspace.gitUrl;

        if (r.data.result.submission && r.data.result.submission.workId) {
          self.setWorkId(r.data.result.submission.workId);
          getWork(r.data.result.submission.workId).then(res => {
            console.log(res);
            if (res.data.code === 200) {
              self.setWork(res.data.result.work)
            }
          })
        }

        self.view.setLoadingMsg('Connecting server...');
        /** connect socket **/
          // let socket = io('http://localhost:16999');
        let socket = io(r.data.result.workspace.wsaddr.workspace);

        let uploadAddr = r.data.result.workspace.wsaddr.workspace;
        // let uploadAddr = 'http://localhost:16999';
        self.upload.setUploadUrl(uploadAddr + '/upload');

        self.setSocket(socket);
        // self.socket = socket;

        socket.on('term.output', function (data) {
          self.terminals.find(t => t.id === data.id).terminal.write(data.output)
        });
        /** fetch files **/
        socket.on('connect', () => {

          self.view.setLoadingMsg('Preparing workspace...');
          socket.emit('workspace.init', {
            repo: repo,
          }, (res) => {
            console.log(res);
            if (!res.error) {
              if (self.openedFiles.length === 0) {
                self.fileStore.root.loadChildren(() => {
                  self.view.setLoadingMsg('Completed! Happy coding~');
                  setTimeout(() => {
                    self.view.setLoading(false);
                  }, 1000)
                })
              }
            } else {
              alert(res.error);
            }

          })
        });

        socket.on('fs.reload', (data) => {
          window.location.reload();
        });

        socket.on('fs.changed', (data) => {
          if (data.option === 'remove') {

          }
        });

        setInterval(() => {
          keepWorkSpace(containerName)
        }, 1000 * 60 * 1)

      })

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
      self.view.editorIndex = self.openedFiles.length - 1;
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
        self.socket.emit('fs.writefile', {path: f.path, content: f.content}, (data) => {
          if (data.error) alert(data.error)
        });
        f.setDirty(false)
      })
    }

    function hideBottom() {
      self.view.setBottomHeight(30);
    }

    function pushOpenedFile(file) {
      self.openedFiles.push(file)
    }

    function removeOpenedFile(file) {
      self.openedFiles.remove(file)
    }

    // var submitWork = flow(function* () {return;
    //   if (!window.confirm('确定要提交吗？')) {
    //     return;
    //   }
    //   try {
    //     const result = yield submitMyWork(self.workspace_id);
    //
    //   } catch (err) {
    //     console.log(err);
    //   }
    // })

    return {
      setSocket,
      setRepo,
      setWorkId,
      afterCreate,
      createTerminal,
      removeTerminal,
      openFile,
      closeFile,
      saveFiles,
      hideBottom,
      pushOpenedFile,
      removeOpenedFile
    }
  });