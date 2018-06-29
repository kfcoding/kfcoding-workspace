import React from 'react';
import Term from "./Term";
import {values} from 'mobx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { observer, inject } from "mobx-react"
import IconClose from 'react-icons/lib/md/close';
import IconPlus from 'react-icons/lib/fa/plus-square';

const Bottom = inject('store')(
  observer(({store}) => (
    <div style={{background: '#364040', height: '100%', width: '100%', color: '#fff'}}>
      <Tabs selectedIndex={store.view.terminalIndex} onSelect={tabIndex => store.view.setTerminalIndex(tabIndex)} style={{height: '100%'}}>
        <TabList>
          {store.terminals.map(t => <Tab key={t}>{t.name} <IconClose style={{marginLeft: '10px'}} onClick={(e) => {store.removeTerminal(t);e.stopPropagation()}}/></Tab>)}
          <IconPlus onClick={store.createTerminal} style={{marginLeft: 10, cursor: 'pointer'}}/>
        </TabList>
        {store.terminals.map(t => <TabPanel key={t} style={{height: 'calc(100% - 50px)'}}><Term terminal={t}/></TabPanel>)}
      </Tabs>
    </div>
  ))
);

export default Bottom;