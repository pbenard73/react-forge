import React, { useEffect } from 'react';

const { ipcRenderer } = window

const useAction = (message, callback) => {

  useEffect(() => {
    ipcRenderer.on(message, callback);

    return () => ipcRenderer.removeListener(message, callback)
  }, [])

  return null
}

export default useAction