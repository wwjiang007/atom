'use strict'

const CSON = require('season')
const fs = require('fs')
const glob = require('glob')
const path = require('path')

const CONFIG = require('../config')

module.exports = function () {
  console.log(`Transpiling CSON paths in ${CONFIG.intermediateAppPath}`)
  for (let path of getPathsToTranspile()) {
    transpileCsonPath(path)
  }
}

function getPathsToTranspile () {
  let paths = []
  for (let packageName of Object.keys(CONFIG.appMetadata.packageDependencies)) {
    paths = paths.concat(glob.sync(
      path.join(CONFIG.intermediateAppPath, 'node_modules', packageName, '**', '*.cson'),
      {ignore: path.join(CONFIG.intermediateAppPath, 'node_modules', packageName, 'spec', '**', '*.cson')}
    ))
  }
  return paths
}

function transpileCsonPath (csonPath) {
  const jsonContent = CSON.readFileSync(csonPath)
  const jsonPath = csonPath.replace(/cson$/g, 'json')
  fs.writeFileSync(jsonPath, JSON.stringify(jsonContent))
  fs.unlinkSync(csonPath)
}