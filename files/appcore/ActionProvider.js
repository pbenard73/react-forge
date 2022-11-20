import React, { useEffect } from 'react';

const { ipcRenderer, action } = window

const ActionProvider = ({children}) => {

  useEffect(() => {
    ipcRenderer.send('init')
    ipcRenderer.on('init', (e, actionNames) => {
      action.instanciate(actionNames)
    })
  }, [])

  return children;
}

export default ActionProvider