#!/usr/bin/env node

// Enables deep printing of objects.
process.env.DEBUG_DEPTH=null

const debug = require('debug')
const { name } = require('./package.json')

// Uncomment this line to print everything
debug.enable(name + ':*')

require('./dist/index').default()
