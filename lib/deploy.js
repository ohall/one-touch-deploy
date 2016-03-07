#!/usr/bin/env node
'use strict';

const https = require('https');
const PARAMS_ERR = new Error('OneOps Parameters must be specified in config or CLI options');
const querystring = require('querystring');
const config = require('../config');

const responseError = function responseError(err, res) {
  err( 'Errors: ' + JSON.parse(res).errors.join('\n') );
};

const createPath = function createPath(error, params, endpoint) {
  return [
    params.ooOrganization || config.ooOrganization || error(PARAMS_ERR),
    'assemblies', params.ooAssembly || config.ooAssembly || error(PARAMS_ERR),
    'transition', 'environments', params.ooEnvironment || config.ooEnvironment || error(PARAMS_ERR),
    endpoint
  ].join('/');
};


const newDeploy = function newDeploy (error, params, callback) {
  console.log( 'Creating New Deployment' );
  let options = {
    hostname: params.ooHost || config.ooHost || error(PARAMS_ERR),
    path: '/' + createPath(error, params, '/deployments/new'),
    port: 443,
    auth: params.ooAPIToken || config.ooAPIToken || error(PARAMS_ERR)
  };

  https.get(options, (response) => {
    let body = '';
    response.on('data', (d) => { body += d; });
    response.on('end', () => { compileStatus(error, params, callback); });
    response.on('error', (e) => { if(error) { error(e); } });
  });

};

const compileStatus = function compileStatus (error, params, callback) {
  console.log( 'Compiling Status' );
  let options = {
    hostname: params.ooHost || config.ooHost || error(PARAMS_ERR),
    path: '/' + createPath(error, params, 'deployments/compile_status'),
    port: 443,
    auth: params.ooAPIToken || config.ooAPIToken || error(PARAMS_ERR)
  };

  https.get(options, (response) => {
    let body = '';
    response.on('data', (d) => { body += d; });
    response.on('end', () => { getLatestRelease(error, params, callback); });
    response.on('error', (e) => { if(error) { error(e); } });
  });
};

const getLatestRelease = function getLatestRelease (error, params, callback) {
  console.log( 'Getting Latest Release ID' );
  let options = {
    hostname: params.ooHost || config.ooHost || error(PARAMS_ERR),
    path: '/' + createPath(error, params, 'releases/bom'),
    port: 443,
    auth: params.ooAPIToken || config.ooAPIToken || error(PARAMS_ERR)
  };

  https.get(options, (response) => {
    let body = '';
    response.on('data', (d) => { body += d; });
    response.on('end', () => {
      if( JSON.parse(body).errors ){
        setTimeout(() => { getLatestRelease(error, params, callback); }, 2000);
        return;
      }
      let releaseID = JSON.parse(body).releaseId;

      doDeployment(error, params, releaseID, callback);
    });
    response.on('error', (e) => { if(error) { error(e); } });
  });
};


const doDeployment = function doDeployment (error, params, releaseID, callback) {
  console.log( 'Deploying Release ID ' + releaseID );

  let querystring = 'cms_deployment%5BreleaseId%5D='+ releaseID +
    '&cms_deployment%5B' + 'nsPath%5D=%2F' + params.ooOrganization +
    '%2F' + params.ooAssembly + '%2F' + params.ooEnvironment + '%2Fbom&' +
    'cms_deployment%5Bcomments%5D=&deploy=';

  const options = {
    hostname: params.ooHost || config.ooHost || error(PARAMS_ERR),
    path: '/' + createPath(error, params, 'deployments.json'),
    port: 443,
    method: 'POST',
    auth: params.ooAPIToken || config.ooAPIToken || error(PARAMS_ERR)
  };

  let req = https.request(options, (response) => {
    let body = '';
    response.on('data', (d) => {  body += d;  });
    response.on('end', () => {
      if( JSON.parse(body).errors ){
        responseError(error, body);
        return;
      }
      const deploymentId = JSON.parse(body).deploymentId;
      console.log( 'Getting Status of deployment ' + deploymentId );
      getStatus(error, params, deploymentId, callback);
    });
    response.on('error', (e) => { if(error) { error(e); } });
  });

  req.write(querystring, () => { req.end(); });
};

const getStatus = function getStatus (error, params, deploymentId, callback) {
  let options = {
    hostname: params.ooHost || config.ooHost || error(PARAMS_ERR),
    path: '/' + createPath(error, params, 'deployments/' + deploymentId + '/status.json'),
    port: 443,
    auth: params.ooAPIToken || config.ooAPIToken || error(PARAMS_ERR)
  };

  https.get(options, (response) => {
    let body = '';
    response.on('data', (d) => { body += d; });
    response.on('end', () => {
      let deploymentState = JSON.parse(body).deploymentState;
      console.log('Deployment State: ' + deploymentState);
      if (deploymentState === 'active') {
        setTimeout(() => { getStatus(error, params, deploymentId, callback); }, 2000);
      } else if (deploymentState === 'complete') {
        callback('Deployment Complete.');
      } else {
        error('Deployment Problem.');
      }
    });
    response.on('error', (e) => { if(error) { error(e); } });
  });
};

const deploy = function deploy (error, params, callback) {
  newDeploy(error, params, callback);
};

module.exports = deploy;