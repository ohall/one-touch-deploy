#!/usr/bin/env node
var cli = require('cli'),
  ips = require('./index');

var error = function error(e) {
  if(e) { console.log( e ); }
  process.exit();
};
