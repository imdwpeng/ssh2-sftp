# ssh2-sftp
SFTP client for node.js. 

Support download or upload specified directories or files.

[![NPM version](https://img.shields.io/npm/v/ssh2-sftp.svg?style=flat)](https://www.npmjs.com/package/ssh2-sftp)

## Requirements

* [node.js](https://nodejs.org/en/) -- v0.8.0 or newer

## Dependencies

* [glob](https://github.com/isaacs/node-glob) -- v7.1.2
* [ssh2](https://github.com/mscdex/ssh2) -- v0.5.5

## Installation
```
npm install ssh2-sftp
```

## Client Examples

ex. dirs:

```
node-sftp
|- /build
   |- index.html
   |- page.html
   |- /static
      |- /js
         |- index.js
         |- page.js
      |- /css
         |- index.css
         |- page.css
|- /down
```

### connect

```js
const Sftp = require('ssh2-sftp');

 var client = new Sftp({
    "host": "192.168.1.1",
    "port": 22,
    "user": "root",
    "password": "root",
    "privateKey": fs.readFileSync('/.ssh/id_rsa')   // password or privateKey
});

 client.connect(callback);
```

### upload 

Upload from local dirs: `static` in `./build` to remote SFTP: `/node-sftp/build`.

```js
client.connect(() => {
    let options = {
        source: 'static',   // ex. static  js  static/js  static/js/index.js
        localPath: './build',
        remotePath: '/node-sftp/build'
    };

    client.download(options, callback);
});

/* Remote SFTP dirs output:
 * node-sftp
 * |- /build
 *    |- /static
 *       |- /js
 *          |- index.js
 *          |- page.js
 *       |- /css
 *          |- index.css
 *          |- page.css
 */
```

### download

Download from romate SFTP: `static` in `/node-sftp/build` to local: `./down`.

```js
client.connect(() => {
    let options = {
        source: 'static',   // ex. static  static/js  static/js/index.js
        localPath: './down',
        remotePath: '/node-sftp/build'
    };

    client.download(options, callback);
});

/* Local dirs output:
 * node-sftp
 * |- /build
 *    |- ...
 * |- /down
 *    |- /static
 *       |- /js
 *          |- index.js
 *          |- page.js
 *       |- /css
 *          |- index.css
 *          |- page.css
 */
```

## Client Usage

### Initialization

To create an instance of the wrapper use the following code:

```javascript
var sftpClient = require('ssh2-sftp'),
    client = new sftpClient(config);
```

`config` containers the sftp server configuration:

* **host** - string - Hostname or IP address of the server. **Default:** `'localhost'`
* **port** - integer - Port number of the server. **Default:** `'localhost'`
* **user** - string - Username for authentication.
* **password** - string - Password for password-based user authentication. 
* **privateKey** - mixed - Buffer or string that contains a private key for either key-based or hostbased user authentication (OpenSSH format). 


### Connecting

After creating the new object you have to manually connect to the server bt using the `connect` method:

```javascript
client.connect(callback);
```

And passing the callback which should be executed when the client is ready.

### Methods

* **upload**(< Object > options,< Function > callback) - expand the `options.source` paths using the glob module, upload all found files and directories to the specified `options.remotePath`, and passing the callback which should be executed after the client uploaded successfully. 
`options` can have the following properties:
    
    * **source** - string - The `source` which should to be uploaded, if not set `source` , upload all of files and directories. Supports files and directories. **Default:** `''`
    * **localPath** - string - The local directory which should to be uploaded.
    * **remotePath** - string - The remote sftp directory which should to be received.

* **download**(< Object > options,< Function > callback) - downloads the contents of `options.remotePath` to `options.localPath` if both exist, and  passing the callback which should be executed after the client downloaded successfully.
`options` can have the following properties:

    * **source** - string - The `source` which should to be downloaded. Supports files and directories. If not set `source` , download all of files and directories. **Default:** `''` (**notice：`Source` path is based on `remotePath`.**)
    * **localPath** - string - The local directory which should to be received.
    * **remotePath** - string - The remote sftp directory which should to be downloaded.




