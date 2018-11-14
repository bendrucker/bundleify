'use strict'

const test = require('tape')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const vm = require('vm')
const bundleify = require('./')
const environment = require('./environment')

test('compressed', function (t) {
  t.plan(6)

  rimraf.sync('compressed')
  fs.mkdirSync('compressed')

  bundleify({
    entry: 'fixture.js',
    compress: true,
    destination: 'compressed',
    config: {
      foo: 'env-value'
    }
  }, function (err) {
    if (err) return t.end(err)

    const code = fs.readFileSync(path.resolve(__dirname, 'compressed/bundle.js'))
    const map = fs.readFileSync(path.resolve(__dirname, 'compressed/bundle.js.map'))

    const sourceMap = JSON.parse(map)
    t.ok(sourceMap.sourcesContent, 'includes sourcesContent (code) in source map')
    t.ok(sourceMap.sourcesContent.every(content => typeof content === 'string'), 'has defined sourcesContent')

    const context = {}
    vm.runInNewContext(code, context)
    const bundleRequire = context.require

    const app = bundleRequire('app')

    t.deepEqual(app, {
      env: 'env-value',
      undefinedEnv: undefined,
      value: 123
    }, 'exports entry as "app"')

    t.ok(String(code).includes('env:"env-value"'), 'compresses module code')
    t.ok(String(code).includes('undefinedEnv:void 0'), 'strips undefined env vars')
    t.ok(String(code).includes('//# sourceMappingURL=bundle.js.map'), 'includes source map url in comment')

    rimraf.sync('compressed')
  })
})

test('uncompressed', function (t) {
  t.plan(7)

  rimraf.sync('uncompressed')
  fs.mkdirSync('uncompressed')

  bundleify({
    entry: 'fixture.js',
    compress: false,
    destination: 'uncompressed',
    config: {
      foo: 'env-value'
    }
  }, function (err) {
    if (err) return t.end(err)

    const code = fs.readFileSync(path.resolve(__dirname, 'uncompressed/bundle.js'))

    const context = {}
    vm.runInNewContext(code, context)
    const bundleRequire = context.require

    const app = bundleRequire('app')

    t.deepEqual(app, {
      env: 'env-value',
      undefinedEnv: undefined,
      value: 123
    }, 'exports entry as "app"')

    t.notOk(String(code).includes('=>'), 'compiles arrow functions')
    t.notOk(String(code).includes('`', 'compiles template strings'))
    t.notOk(String(code).includes('const', 'compiles const'))
    t.ok(String(code).includes('sourceMappingURL=data:application/json'), 'preserves inline source map')
    t.ok(String(code).includes('env: "env-value"'), 'does not compress module code')
    t.ok(String(code).includes('undefinedEnv: undefined'), 'strips undefined env vars')

    rimraf.sync('uncompressed')
  })
})

test('plugins', function (t) {
  t.plan(4)

  rimraf.sync('plugins')
  fs.mkdirSync('plugins')

  bundleify({
    entry: 'fixture.js',
    compress: false,
    destination: 'plugins',
    plugins: [
      function pluginA (browserify, options) {
        t.equal(typeof browserify.bundle, 'function', 'receives browserify instance')
        t.equal(typeof options, 'object', 'receives default options')
      },
      [
        function pluginB (browserify, options) {
          t.equal(typeof browserify.bundle, 'function', 'receives browserify instance')
          t.equal(options.foo, 'bar', 'receives custom options')
        },
        {
          foo: 'bar'
        }
      ]
    ]
  }, function (err) {
    if (err) t.end(err)
    rimraf.sync('plugins')
  })
})

test('environment', function (t) {
  t.deepEqual(environment({ foo: { bar: 'baz' } }), { FOO_BAR: 'baz', _: 'purge' }, 'transforms nested data into ENV_STYLE')
  t.end()
})
