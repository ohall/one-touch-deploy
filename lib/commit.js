#!/usr/bin/env node
'use strict';

const https = require('https');
const PARAMS_ERR = new Error('OneOps Parameters must be specified in config or CLI options');
const config = require('../config');


const createPath = function createPath(error, params) {
  return [
    params.ooOrganization || config.ooOrganization || error(PARAMS_ERR),
    'assemblies', params.ooAssembly || config.ooAssembly || error(PARAMS_ERR),
    'transition', 'environments', params.ooEnvironment || config.ooEnvironment || error(PARAMS_ERR),
    '/commit'
  ].join('/');
};


const commit = function commit (error, params, callback) {

  let querystring = 'exclude_platforms=&desc=';

  const options = {
    hostname: params.ooHost || config.ooHost || error(PARAMS_ERR),
    path: '/' + createPath(error, params),
    port: 443,
    method: 'POST',
    auth: params.ooAPIToken || config.ooAPIToken || error(PARAMS_ERR),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }
  };

  let req = https.request(options, (response) => {
    var body = '';
    response.on('data', (d) => { body += d; });
    response.on('end', () => { callback('DONE'); });
    response.on('error', (e) => { if(error) { error(e); } });
  });

  console.log( 'Committing' );
  req.write(querystring, () => { req.end(); });
};

module.exports = commit;