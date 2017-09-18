'use strict'

const inspect = require('util').inspect
const serialErr = require('./serialErr')
const colors = require('colors')

/* eslint-disable no-console */

module.exports = printErr
function printErr(err) {

  // simply ignore undefined or null, usually forget `if`
  if (err === null || typeof err == 'undefined') return

  try {

    if (!(err instanceof Error)) {
      console.error('[Error] but not Error object'.red)
      console.error(inspect(err, {colors: true, depth: 5}))
      return
    }

    console.error('[Error] '.red + err.message.cyan)

    err = serialErr(err)
    let stack = err.stack.split('\n').filter(Boolean)
    stack.forEach(line=> console.error(line.magenta))

    delete err.message
    delete err.stack

    console.log(inspect(err, {colors: true, depth: 5}))

  }
  catch (er) {
    console.log('\n  ==>catch error while print error log...print something first'.red)
    console.error(er)
    console.log('----------------------'.gray)

    printErr(er)

    throw er
  }

}
