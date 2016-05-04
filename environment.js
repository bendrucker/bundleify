'use strict'

const partialRight = require('ap').partialRight
const flatten = require('flat')
const mapKeys = require('map-keys')
const extend = require('xtend')

module.exports = pipe(
  partialRight(flatten, {delimeter: '_'}),
  partialRight(mapKeys, uppercase),
  partialRight(extend, {_: 'purge'})
)
