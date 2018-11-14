'use strict'

const pipe = require('value-pipe')
const partialRight = require('ap').partialRight
const flatten = require('flat')
const mapKeys = require('map-keys')
const extend = require('xtend')

module.exports = pipe(
  partialRight(flatten, { delimiter: '_' }),
  partialRight(mapKeys, uppercase),
  partialRight(extend, { _: 'purge' })
)

function uppercase (string) {
  return string.toUpperCase()
}
