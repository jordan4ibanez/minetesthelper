#! /usr/bin/env node
const fs = require("fs")
// We want the user to be able to CTRL+C out.
const prompt = require('prompt-sync')({sigint: true});
const path = require("path")
const print = console.log;
const error = console.error;
const dir = process.cwd()
const files = fs.readdirSync(dir)
// const args = process.argv.slice(2);

// game.conf check.
const isGameRoot = files.includes("game.conf")
if (!isGameRoot) {
  error("No game.conf detected! Please CD to the game root directory!")
  return
}

// mods folder check.
const hasModsFolder = files.includes("mods")
if (!hasModsFolder) {
  error("No mods folder! Please CD to game root directory OR create a mods folder!")
  return
}

// Okay everything went well, now we can do the actual thing.

const modsPath = path.join(dir, "mods")
const mods = fs.readdirSync(modsPath)

// Create mod name.
let modToBeMade
while (true) {
  modToBeMade = prompt("Name: ")

  // Do not overwrite mods.
  if (mods.includes(modToBeMade)) {
    error(`${modToBeMade} already exists!`)
    continue
  }
  break
}

// Create mod namespace.
let modNamespace
while (true) {
  modNamespace = prompt("Namespace: ")
  if (modNamespace === "") {
    error("Mod namespace cannot be blank!")
    continue
  }
  break
}

// Create description.
const modDescription = prompt("Description: ")

// Create depends.
const modDepends = prompt("Dependencies (separate by comma): ")

// Create optional depends.
const optionalModDepends = prompt("Optional dependencies (separate by comma): ")

// We have all the information we need, create a base mod.
const currentModPath = path.join(modsPath, modToBeMade)
fs.mkdirSync(currentModPath)
print(`Created folder for ${modToBeMade}.`)

// init.ts
const initStream = fs.createWriteStream(path.join(currentModPath, "init.ts"))
initStream.write(
`namespace ${modNamespace} {

}`)
initStream.end()
print("Wrote init.ts")

// mod.conf
const descriptionStream = fs.createWriteStream(path.join(currentModPath, "mod.conf"))
let dependsFinalized
if (modDepends === "") {
  dependsFinalized = "enums"
} else {
  dependsFinalized = `enums,${modDepends}`
}
descriptionStream.write(
`name = ${modToBeMade}
description = ${modDescription}
depends = ${dependsFinalized}
optional_depends = ${optionalModDepends}
`)
descriptionStream.end()
print("wrote mod.conf")