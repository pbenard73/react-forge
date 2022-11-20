const Controller = require("../core/Controller");

const message = (e, args) => {
    console.log('Salut mon gros jsuis dans mon message')
}

const hello = (e, args) => {
    console.log(`Hello ${args || 'World'}`)
}

const random = (e) => {
    e.reply('random', Math.random())
}

const mainController = new Controller({message, hello, random})

module.exports = mainController