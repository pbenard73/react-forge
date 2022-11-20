const { ipcMain } = require('electron');
const actionManager = require('./actionManager')

class Controller {
    #poolEvent = {}

    constructor(poolEvent = {}) {
        this.#poolEvent = poolEvent;
        this.init();
    }

    init() {
        Object.keys(this.#poolEvent).forEach(actionName => {
            actionManager.addAction(actionName);
            ipcMain.on(actionName, this.#poolEvent[actionName])
        })
    }
}

module.exports = Controller;