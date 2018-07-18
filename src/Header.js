import React from 'react';
import styled from 'styled-components';
import logo from './assets/logo-min.png';
import IconSave from 'react-icons/lib/fa/floppy-o';
import IconCommit from 'react-icons/lib/fa/upload';
import IconInfo from 'react-icons/lib/fa/info';
import IconRun from 'react-icons/lib/fa/play-circle'
import { inject, observer } from "mobx-react/index";
import Modal from 'react-responsive-modal';

const styles = props =>
  `
  display: flex !important;
  transition: 0.3s ease all;
  flex-direction: row;
  align-items: center;
  vertical-align: middle;
  font-size: .875rem;
  line-height: 1;
  height: 100%;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  box-sizing: inherit;
  z-index: 1;
  padding-left: 10px;
  padding-right: 10px;
  
  &:hover {
    color: rgba(255,255,255, 1);
    background: #444;
  }
  
`;

const Container = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  background-color: #222;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  height: 3rem;
  font-weight: 400;
  flex: 0 0 40px;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #444;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

export const Left = styled.div`
  display: flex;
  height: 100%;
`;

export const LogoContainer = styled.a`
  display: flex;
  position: relative;
  align-items: center;
  color: #fff;
  vertical-align: middle;
  height: 3rem;
  margin-right: 1rem;

  padding: 0 calc(1rem + 1px);

  box-sizing: border-box;

  overflow: hidden;
  text-decoration: none;
`;

export const Title = styled.span`
  font-size: 1rem;
  font-weight: 400;
  margin: 0;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
`;

export const Action = styled.div`
  ${styles};
`;

const Header = inject('store')(
  observer(({store}) => {
    const handleRunClick = () => {
      if (store.view.editorIndex === -1)
        return;
      const file = store.openedFiles[store.view.editorIndex];
      store.fileStore.writefile(file.path, file.content);
      // 创建terminal
      if (store.view.terminalIndex === -1){
        store.createTerminal();
      }
      store.terminals[store.view.terminalIndex].exc(file.path);
    }

    return(
      <Container>
        <Left>
          <LogoContainer>
            <a target='_blank' href='http://kfcoding.com' style={{height: '100%'}}>
              <img src={logo} style={{height: '100%'}}/>
            </a>
            <Title>KFCoding Workspace</Title>
          </LogoContainer>
          <Action title='保存' onClick={store.saveFiles}><IconSave/></Action>
          {/*<Action title='提交' onClick={store.submitWork}><IconCommit/></Action>*/}
          <Action title='运行' onClick={handleRunClick}><IconRun/></Action>
          {store.workId &&
          <Action title='查看作业' onClick={store.view.showWork}><IconInfo/></Action>}
        </Left>

        <Modal open={store.view.workOpen} onClose={store.view.hideWork} center>
          <div style={{width: '400px', minHeight: '250px'}}>
          <h3>{store.work.name}</h3>
          <p>{store.work.description}</p>
          </div>
        </Modal>
      </Container>)
  })
)

export default Header;