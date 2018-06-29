import React, {Component} from 'react';
import SortableTree, {toggleExpandedForAll} from 'react-sortable-tree';
import * as FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import folder from '../asset/fold/folder.png'
import folderopen from '../asset/fold/folderopen.png'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import file from '../asset/fold/file.png'
import './index.css';

function handleClick(e, data) {
  console.log(data.foo);
}


class FileTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      displayMenu: false,
      treeData: [
        {
          title: 'src',
          isDirectory: true,
          expanded: true,
          children: [
            {title: 'styles.css'},
            {title: 'index.js'},
            {title: 'reducers.js'},
            {title: 'actions.js'},
            {title: 'utils.js'},
          ],
        },
        {
          title: 'tmp',
          isDirectory: true,
          children: [
            {title: '12214124-log'},
            {title: 'drag-disabled-file', dragDisabled: true},
          ],
        },
        {
          title: 'build',
          isDirectory: true,
          children: [{title: 'react-sortable-tree.js'}],
        },
        {
          title: 'public',
          isDirectory: true,
        },
        {
          title: 'node_modules',
          isDirectory: true,
        },
        {title: '.gitignore'},
        {title: 'package.json'},
      ],
    };

    this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
  }

  updateTreeData(treeData) {
    this.setState({treeData});
  }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded,
      }),
    });
  }

  expandAll() {
    this.expand(true);
  }

  collapseAll() {
    this.expand(false);
  }

  render() {
    const {
      visible,
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount,
    } = this.state;

    const alertNodeInfo = ({node, path, treeIndex}) => {
      const objectString = Object.keys(node)
        .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
        .join(',\n   ');
      global.alert("show")
    };

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1,
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0,
      });

    const foldImg = (expanded) => {
      if (expanded){
        return (<img style={{width: '25px', height: '25px', borderColor: '#fff', paddingRight: '10px'}} src={folderopen}/>)
      } else {
        return(<img style={{width: '25px', height: '25px', borderColor: '#fff', paddingRight: '10px'}} src={folder}/>);
      }
    }


    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          background: '#364040',
          height: '100%',
          color: '#fff'
        }}
      >
        {/*<div style={{flex: '0 0 auto', padding: '0 15px', borderBottom: '1px solid #aaa'}}>*/}
          {/*{foldAll({isExpendAll})}*/}
          {/*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*/}
        {/*</div>*/}

        <div style={{flex: '1 0 50%', padding: '0 0 0 15px'}}>
          <SortableTree
            theme={FileExplorerTheme}
            treeData={treeData}
            onChange={this.updateTreeData}
            searchQuery={searchString}
            searchFocusOffset={searchFocusIndex}
            searchFinishCallback={matches =>
              this.setState({
                searchFoundCount: matches.length,
                searchFocusIndex:
                  matches.length > 0 ? searchFocusIndex % matches.length : 0,
              })}
            canDrag={({node}) => !node.dragDisabled}
            canDrop={({nextParent}) => !nextParent || nextParent.isDirectory}
            generateNodeProps={rowInfo => ({
              icons: rowInfo.node.isDirectory
                ? [
                  foldImg(rowInfo.node.expanded)
                ]
                : [
                  <img
                    style={{
                      textAlign: 'center',
                      marginRight: 10,
                      width: '25px',
                      height: '25px',
                    }}
                    src={file}
                  >
                  </img>,
                ],
              buttons: [
                  <button
                    style={{
                      padding: 0,
                      borderRadius: '100%',
                      backgroundColor: 'gray',
                      color: 'white',
                      width: 16,
                      height: 16,
                      border: 0,
                      fontWeight: 100,
                    }}
                    // onClick={() => alertNodeInfo(rowInfo)}
                  >
                    <ContextMenuTrigger id="some_unique_identifier">
                      <div className="well">Right click to see the menu</div>
                    </ContextMenuTrigger>
                  </button>
                ,
              ],
            })}
          />
          <ContextMenu id="some_unique_identifier">
            <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
              ContextMenu Item 1
            </MenuItem>
            <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
              ContextMenu Item 2
            </MenuItem>
            <MenuItem divider />
            <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
              ContextMenu Item 3
            </MenuItem>
          </ContextMenu>
        </div>
      </div>
    );
  }
}


export default FileTree;