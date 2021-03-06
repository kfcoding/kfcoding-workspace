import React from 'react';
import Term from "./Term";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { observer, inject } from "mobx-react"
import IconClose from 'react-icons/lib/md/close';
import IconPlus from 'react-icons/lib/fa/plus-square';
import IconTerminal from 'react-icons/lib/go/terminal';
import IconDown from 'react-icons/lib/fa/angle-down';

const Bottom = inject('store')(
  observer(({store}) => (
    <div style={{background: '#222', height: '100%', width: '100%', color: '#fff'}}>
      <Tabs selectedIndex={store.view.terminalIndex} onSelect={tabIndex => store.view.setTerminalIndex(tabIndex)} style={{height: '100%'}}>
        <TabList>
          {store.terminals.map(t => <Tab key={t}>{t.name} <IconClose style={{marginLeft: '10px'}} onClick={(e) => {store.removeTerminal(t);e.stopPropagation()}}/></Tab>)}
          <IconTerminal onClick={store.createTerminal} style={{marginLeft: 10, cursor: 'pointer', color: '#fff'}}/>
          <IconDown onClick={store.hideBottom} style={{float: 'right', margin: 6, cursor: 'pointer'}}/>
        </TabList>
        {store.terminals.map(t => <TabPanel key={t} style={{height: 'calc(100% - 25px)', background: '#000'}}><Term terminal={t}/></TabPanel>)}
      </Tabs>
    </div>
  ))
);

export default Bottom;