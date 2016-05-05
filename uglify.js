'use strict'

const uglify = require('uglify-js')
const map = require('convert-source-map')
const through = require('through2')
const path = require('path')
const fs = require('fs')

module.exports = uglifyStream

function uglifyStream (options) {
  const buffers = []
  function transform (buffer, enc, callback) {
    buffers.push(buffer)
    callback(null)
  }

  function flush (callback) {
    const code = String(Buffer.concat(buffers))
    const result = uglify.minify(code, {
      fromString: true,
      compress: true,
      mangle: true,
      inSourceMap: map.fromSource(code).toObject(),
      outSourceMap: options.filename + '.map'
    })
    this.push(result.code)
    fs.writeFile(path.resolve(options.destination, options.filename + '.map'), result.map, callback)
  }

  return through(transform, flush)
}

