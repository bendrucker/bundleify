'use strict'

const assert = require('assert')

module.exports = bundleify

const defaults = {
  basedir: process.cwd(),
  filename: 'bundle.js',
  config: {}
}

function bundleify (options, callback) {
  assert.equal(typeof options, 'object', 'options are required')
  assert.equal(typeof callback, 'function', 'callback is required')
  assert.equal(typeof options.entry, 'string', 'entry point is required')
  assert.equal(typeof options.destination, 'string', 'destination is required')

  options = extend(defaults, options)
  const entry = path.resolve(options.basedir, options.entry)
  const compress = Compressor(options)

  browserify({
    debug: true
  })
  .add(entry)
  .require(entry, {expose: 'app'})
  .transform(pipe(environment, envify)(options.config))
  .transform(compressor(uglifyify), {
    global: true
  })
  .plugin(options.compress ? collapser : noop)
  .bundle()
  .pipe(pipe(Exorcise, compressor)(options)())
  .pipe(WriteStream(options))
  .on('finish', done)

  function done () {
    callback(null)
  }
}

function Compressor (options) {
  return function compress (fn) {
    return options.compress ? fn : Stream.PassThrough
  }
}

function Exorcise (options) {
  return function exorcise () {
    return exorcist(
      path.resolve(options.destination, options.filename + '.map'), // destination
      null, // uri
      null, // root
      options.basedir // base
    )
  }
}

function WriteStream (options) {
  return fs.createWriteStream(path.resolve(options.destination, options.filename))
}
