class ActionManager {
    pool = []
    #ipcRenderer = null;

    addAction(name) {
        this.pool.push(name)
    }

    addActions(names = []) {
        this.pool = [...this.pool, ...names]
    }

    instanciate(names = []) {
        this.pool = [...(new Set([...this.pool, ...names]))]
        this.pool.forEach(actionName => {
            this[actionName] = (args) => this.#ipcRenderer.send(actionName, args)
        })
    }

    on(message, callback) {
        this.#ipcRenderer.on(message, callback)
    }

    initFront(ipcRenderer) {
        this.#ipcRenderer = ipcRenderer;
        return this;
    }
}

const actionManager = new ActionManager()

module.exports = actionManager;