# ssh2-sftp
SFTP client for node.js.

## Requirements

* [node.js](https://nodejs.org/en/) -- v0.8.0 or newer

## Dependencies

* [glob](https://github.com/isaacs/node-glob) -- v7.1.2
* [ssh2](https://github.com/mscdex/ssh2) -- v0.5.5

## Installation
```
npm install ssh2-sftp
```

## Usage

### Initialization

To create an instance of the wrapper use the following code:

```javascript
var sftpClient = require('ssh2-sftp'),
    client = new sftpClient(config);
```

`config` containers the sftp server configuration:

* **host** - string - Hostname or IP address of the server.**Default:** `'localhost'`
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

* **upload**(< Object > options,< Function > callback) - expand the `options.source` paths using the glob module,upload all found files and directories to the specified `options.remotePath`,and passing the callback which should be executed after the client has be uploaded. `options` can have the following properties:
    * **source** - string - the `source` which should to be uploaded.
    * **localPath** - string - the local directory which should to be uploaded.
    * **remotePath** - string - the remote sftp directory which should to be received.





