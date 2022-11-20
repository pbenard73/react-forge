#!/usr/bin/env node

const path= require('path')
const fs = require('fs')
const program = require('commander').program

const spawn = require("child_process").spawn

let options = {}

function getCommand() {
    return new Promise((resolve, reject) => {
        program
            .name('genize')
            .version('0.0.13')
            .argument("name")
            .parse(process.argv)

        resolve(program)
    })
}

function runSpawn(name, args, cwd) {
    const log = text => {
        console.log(text.toString("utf8"))
    }

    return new Promise((resolve, reject) => {
        const exec = spawn(name, args, { stdio: "inherit", cwd : cwd || options.tmpFolder })

        exec.on("data", line => log(line))

        exec.on("error", gerror => {
            console.log(gerror)
        })

        exec.on("close", code => {
            return code === 0 ? resolve() : reject()
        })
    })
}

function createFolders() {
  fs.mkdirSync(options.tmpFolder)
  
  options.forgePath = path.join('.', options.tmpFolder, "forge")
  options.reactPath = path.join('.', options.tmpFolder, "reactapp")
}

function mergePackages() {
  const forgePackagePath = path.join(options.forgePath, 'package.json')
  const reactPackagePath = path.join(options.reactPath, 'package.json')
  const forgePackageBrut = fs.readFileSync(forgePackagePath, 'utf8')
  const reactPackageBrut = fs.readFileSync(reactPackagePath, 'utf8')

  const forgePackage = JSON.parse(forgePackageBrut)
  const reactPackage = JSON.parse(reactPackageBrut)
  forgePackage.name = options.name;
  forgePackage.productName = options.name;
  forgePackage.scripts = {
    ...forgePackage.scripts,
    makewin: "electron-forge make -- --platform win32",
    "react-start": "react-app-rewired start",
    "react-build": "BUILD_PATH='./src/dist' react-app-rewired build",
    "react-test": "react-app-rewired test"
  }

  forgePackage.homepage = "./";

  forgePackage.dependencies = {
    ...forgePackage.dependencies,
    ...reactPackage.dependencies
  }

  forgePackage.devDependencies = {
    ...forgePackage.devDependencies,
    ...reactPackage.devDependencies
  }

  forgePackage.eslintConfig = reactPackage.eslintConfig;
  forgePackage.browserslist = reactPackage.browserslist;

  fs.writeFileSync(forgePackagePath, JSON.stringify(forgePackage, null, 4))
}

async function run() {
  try {
    const command = await getCommand()
    options.name = command.args[0]
    options.tmpFolder = `tmp${(new Date()).getTime()}`

    createFolders(); 

    await Promise.all([
      runSpawn("npx", ["create-react-app@latest", "reactapp"]),
      runSpawn("npm", ["init", "electron-app@latest", "forge"])
    ])
    
    mergePackages()

    fs.copyFileSync(path.join(__dirname, 'files/config-overrides.js'), path.join(options.forgePath, 'config-overrides.js'));
    await runSpawn("npm", ["i"], options.forgePath)
    
    fs.cpSync(path.join(options.reactPath, 'public'), path.join(options.forgePath, 'public'), {recursive: true})
    fs.cpSync(path.join(options.reactPath, 'src'), path.join(options.forgePath, 'src/app'), {recursive: true})
    
    fs.cpSync(path.join(options.reactPath, 'src'), path.join(options.forgePath, 'src/app'), {recursive: true})
    fs.cpSync(path.join(__dirname, 'files/appcore'), path.join(options.forgePath, 'src/app/core'), {recursive: true})
    fs.cpSync(path.join(__dirname, 'files/App.js'), path.join(options.forgePath, 'src/app/App.js'), {force:true, recursive: true})
    fs.cpSync(path.join(__dirname, 'files/appIndex.js'), path.join(options.forgePath, 'src/app/index.js'), {force:true, recursive: true})
    fs.cpSync(path.join(__dirname, 'files/core'), path.join(options.forgePath, 'src/core'), {recursive: true})
    fs.cpSync(path.join(__dirname, 'files/controllers'), path.join(options.forgePath, 'src/controllers'), {recursive: true})
    
    fs.cpSync(path.join(__dirname, 'files/index.js'), path.join(options.forgePath, 'src/index.js'), {force:true, recursive: true})
    fs.cpSync(path.join(__dirname, 'files/preload.js'), path.join(options.forgePath, 'src/preload.js'), {force:true, recursive: true})

    fs.cpSync(options.forgePath, path.join('.', options.name), {recursive: true})
  
    await runSpawn("npm", ["install", "--save-dev", "react-app-rewired"], path.join('.', options.name))

    fs.rmdirSync(options.tmpFolder, {recursive: true})

    console.log("That's all folk ! 🐼")
  } catch(e) {
    console.error(e)
  }
}

run()
