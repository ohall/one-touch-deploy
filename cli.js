#!/usr/bin/env node
'use strict';

const cli = require('cli');
const odt = require('./lib/otd');

const error = function error(e) {
  if(e) { console.log( e ); }
  process.exit();
};

cli.main((args, options) => { odt(); });