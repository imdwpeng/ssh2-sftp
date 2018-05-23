/**
 * Created by Eric on 2018/5/19.
 */
const deployConfig = require('./deploy-conf.json');
const Sftp = require('../lib/client');

// =================================================================

var processArg = process.argv.splice(2),
    arguments = processArg[0],
    version = deployConfig.version, // 版本号
    source = processArg[1] || '',
    clientResource,
    clientViews;

if (arguments == 'debug') {
    var options = {};

    options.source = source;
    options.localPath = deployConfig.localPath;
    options.remotePath = deployConfig.debug.remotePath;

    var aa = new Sftp(deployConfig.debug.server);
    aa.connect(() => {
        console.log('======= start =======');
        aa.upload(options, () => {
            console.log('======= end =======');
        });
    });
}