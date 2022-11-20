// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const actionManager = require('./core/actionManager')

const { remote, ipcRenderer } = require('electron');
window.ipcRenderer = require('electron').ipcRenderer;
window.action = actionManager.initFront(ipcRenderer)

