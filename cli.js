#!/usr/bin/env node
'use strict';

const cli = require('cli');
const otd = require('./lib/otd');

const error = function error(e) {
  if(e) { console.error( e ); }
  process.exit();
};

cli.parse({
  ooHost: [ 'h', 'Hostname', 'string' ],
  ooAPIToken: [ 't', 'OneOps API token', 'string' ],
  ooOrganization: [ 'o', 'OneOps organization', 'string' ],
  ooAssembly: [ 'a', 'OneOps Assembly Name', 'string' ],
  ooEnvironment: [ 'e', 'OneOps Environment Name', 'string' ],
  ooPlatform: [ 'p', 'OneOps Platform Name', 'string' ],
  ooComponents: [ 'c', 'Comma separated list of components', 'string' ],
  ooDoDeploy: [ 'd', 'Do deployment after touching?', 'string' ]
});

cli.main((args, options) => {
  otd(error, {
    ooHost : options.ooHost,
    ooAPIToken : options.ooAPIToken,
    ooOrganization : options.ooOrganization,
    ooAssembly : options.ooAssembly,
    ooEnvironment : options.ooEnvironment,
    ooPlatform : options.ooPlatform,
    ooComponents : options.ooComponents?options.ooComponents.split(','):null,
    ooDoDeploy : (options.ooDoDeploy === 'true')
  },(result) => { console.log( result ); });
});