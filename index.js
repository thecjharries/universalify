'use strict'

exports.Promise = global.Promise

exports.fromCallback = function (fn) {
  return Object.defineProperty(function () {
    if (typeof arguments[arguments.length - 1] === 'function') fn.apply(this, arguments)
    else {
      return new exports.Promise((resolve, reject) => {
        arguments[arguments.length] = (err, res) => {
          if (err) return reject(err)
          resolve(res)
        }
        arguments.length++
        fn.apply(this, arguments)
      })
    }
  }, 'name', { value: fn.name })
}

exports.fromPromise = function (fn) {
  return Object.defineProperty(function () {
    const cb = arguments[arguments.length - 1]
    if (typeof cb !== 'function') return fn.apply(this, arguments)
    else {
      new exports.Promise((resolve, reject) => {
        fn.apply(this, arguments).then(resolve).catch(e => reject(e))
      }).then(r => cb(null, r)).catch(cb)
    }
  }, 'name', { value: fn.name })
}
