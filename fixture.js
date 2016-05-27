module.exports = {
  env: process.env.FOO,
  undefinedEnv: process.env.EMPTY,
  value: 123
}

const foo = `${module.exports.value}`.split('').map(n => n + 1).join('')
foo.toString()
