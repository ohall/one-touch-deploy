'use strict';
const touch = require('./touch');
const deploy = require('./deploy');

module.exports = function odt () {
  console.log( 'odt' );
  touch();
  deploy();
};