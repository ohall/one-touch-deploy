#!/usr/bin/env node
'use strict';

const touch = require('./touch');
const deploy = require('./deploy');
const config = require('../config');

const odt = function odt (error, params, callback) {
  if(!params) { params = config; }
  touch(error, params, () => {
    if( params.ooDoDeploy ) {
      deploy(error, params, () => { callback('DONE') });
    } else {
      callback('DONE')
    }
  });
};

module.exports = odt;