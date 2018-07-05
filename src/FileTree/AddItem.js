import React from 'react';
import styled from 'styled-components';
import {inject, observer} from "mobx-react/index";
import IconFolder from 'react-icons/lib/fa/folder';
import IconFile from 'react-icons/lib/fa/file';

const Container = styled.div`
  
`;

const FileContainer = styled.div`
  padding: 0.4rem 3rem 0.4rem calc(1rem - 2px);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  color: #ccc;
  background: ${props => props.active ? 'rgba(139,191,228,0.2)' : 'inherit'};
  padding-left: ${props => 20 + props.depth * 20 + 'px'};
  border-left: 2px solid ${props => props.active ? '#fff' : 'inherit'};
  &:hover {
    background: rgba(108,174,221,0.1);
  }
`;

// const ContextMenu = styled.div`
//   color: #ccc;
//     background-color: #333;
//     border-color: #3a3a3a;
//     opacity: 0.95;
//     position: absolute;
//     z-index: 501;
//     box-shadow: 0 4px 20px 1px rgba(0,0,0,0.3);
//     border-radius: 4px;
//     border: 1px solid transparent;
//     padding: 4px 0;
// `

// class FileItem1 extends React.Component {
//   render() {
//     let {file} = this.props;
//     return (
//       <Container active={false}>
//         <FileContainer onClick={file.loadChildren}><FileIcon size={16} extension="file" {...defaultStyles.txt} /> {this.props.file.name}</FileContainer>
//         {file.children.map(f => <FileItem key={f} file={f}/>)}
//       </Container>
//     )
//   }
// }


const AddItem = inject('store')(
  observer(({file, store}) => {
    const handleChange = (event) => {
      file.setAddName(event.target.value)
    }

    const handleOnBlue = (event) => {
      if (event.target.value !== '') {
        file.mkdir(file.path+event.target.value);
      }
      file.setAdd('');
    }

    const show = () => {
      if (file.add === 'fold'){
        // ReactDOM.findDOMNode(this.refs.input).focus();
        return (
          <FileContainer depth={file.depth} >
            <IconFolder style={{marginRight : '5px'}} /><input onblur={handleOnBlue} ref='foldInput' className='add-item-input' type='text' value={file.addName} onChange={handleChange}/>
          </FileContainer>
        )
      } else if (file.add === 'file'){
        return (
          <FileContainer depth={file.depth}>
            <IconFile style={{marginRight : '5px'}} /><input ref='fileInput' className='add-item-input' type='text' value={file.addName} onChange={handleChange}/>
          </FileContainer>)
      }
    }
    return (
      <div>
        <Container active={false}>
          {show()}
        </Container>
      </div>
    )
  })
)

export default AddItem;