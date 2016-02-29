#!/usr/bin/env node
'use strict';

const touch = require('./touch');
const commit = require('./commit');
const deploy = require('./deploy');
const config = require('../config');

const odt = function odt (error, params, callback) {
  if(!params) { 
    params = config; 
  } else {
    for (let key in params) {
      if(!params[key]) { params[key] = config[key] }
    }
  }
  touch(error, params, (touch_res) => {
    if( params.ooDoDeploy ) {
      commit(error, params, () => {
        deploy(error, params, (deploy_res) => {
          callback(deploy_res);
        });
      });
    } else {
      callback(touch_res);
    }
  });
};

module.exports = odt;