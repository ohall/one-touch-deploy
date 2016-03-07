# one-touch-deploy
Touch components and deploy an environment in OneOps

## Usage
`one-touch-deploy` can be used either as a node dependency or a command line tool.

### Node module
Install into your project.

```sh
npm i --save one-touch-deploy
```
Require in your project and pass in and error callback and the configuration object as parameters.

```js
  
  const deploy = require('one-touch-deploy');

  deploy(errorcallback, {
    ooHost : "<host>",
    ooAPIToken : "<token>",
    ooOrganization : "<org>",
    ooAssembly : "<assembly>",
    ooEnvironment : "<env>",
    ooPlatform : "<platform(s)-to-deploy>"
    ooComponents : "<components-to-touch>"
    ooDoDeploy : "<do-deployment-bool>"
  });
  
```


### CLI
Install globally (or however you like to do it).

```sh
$ npm i one-touch-deploy -g
```

Call from the command line with the proper flags.

```sh
$ one-touch-deploy -h <host> -t <token> -o <org> -a <assembly> -e <env> -p <platform>
                   -c <components-to-touch> -d <do-deployment-bool>
```

### config.js
For convenience, you can add commonly used parameters to the `config.js` file.
Any values there will be __overridden__ by values passed in as parameters to the modules, or on the command line.
  