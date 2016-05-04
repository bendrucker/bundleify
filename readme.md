# bundleify [![Build Status](https://travis-ci.org/bendrucker/bundleify.svg?branch=master)](https://travis-ci.org/bendrucker/bundleify)

> Bundle your JS with browserify with preconfigured transforms


## Install

```
$ npm install --save bundleify
```


## Usage

```js
var bundleify = require('bundleify')

bundleify({
  entry: 'app.js',
  destination: 'build' 
}, function (err) {
  //=> wrote build to `./build`  
})
```

bundleify applies the following settings and transforms:

* source maps
* exposes your entry as `require('app')`
* flattens configuration and uses it to replace environment variables
* applies minification transforms when in compression mode:
  * [uglifyify](https://github.com/hughsk/uglifyify)
  * [bundle-collapser](https://www.npmjs.com/package/bundle-collapser)
  * [exorcist](https://www.npmjs.com/package/exorcist)
* applies 

## API

#### `bundleify(options, callback)` -> `undefined`

##### options

*Required*  
Type: `object`

###### entry

*Required*  
Type: `string`

The relative path to the entry file.

###### destination

*Required*  
Type: `string`

The relative path to the destination folder.

###### basedir

Type: `string`  
Default: `process.cwd()`

The base directory from which the entry and destination paths are resolved.

###### compress

Type: `boolean`  
Default: `false`

Toggles minification/compression transforms (see *Usage*).

###### config

Type: `object`  
Default: `{}`

Nested configuration to be transformed into environment variables that will be replaced in the bundle. Given the following config:

```js
{
  foo: {
    bar: 'baz'
  }
}
```

You can write the following code:

```js
console.log(process.env.FOO_BAR)
//=> baz
```

Any environment variables that are not explicit defined in the configuration will be set to `undefined`.

###### filename

Type: `string`  
Default: `bundle.js`

The destination filename.

##### callback

*Required*  
Type: `function`  
Arguments: `err`

A callback that will be called with a build error if applicable, otherwise `null`.


## License

MIT © [Ben Drucker](http://bendrucker.me)
