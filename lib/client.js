const fs = require('fs');
const glob = require('glob');
const Client = require('ssh2').Client;
const {join, extname, parse} = require('path');

function Sftp(config) {
    this.config = config;
    this.options = {};
    this.conn = new Client();
    this.sftp = undefined;
}

Sftp.prototype.connect = function (callback) {
    let that = this;

    this.conn.on('ready', () => {
        this.conn.sftp(function (err, sftp) {
            if (err) {
                console.log('error sftp');
                throw err;
            }

            that.sftp = sftp;
            callback && callback();
        });
    }).connect(this.config);
};

Sftp.prototype.upload = function (options, callback) {
    let {source, localPath} = options,
        {file, dir} = this._resolve(source),
        that = this;

    this.options = options;

    if (!this.sftp) return;

    glob(localPath + '/**/' + (dir === '' ? '**' : dir) + '/**', (err, paths) => {
        if (err) return console.log('error:', err);

        let {dirAttr, fileObj} = that._stat(paths, file);

        // 先创建远程目录，然后再上传文件
        that._makeDirs(dirAttr)
            .then(() => {
                that._upload(fileObj, callback);
            })
            .catch((e) => {
                console.log(e)
            });
    });
};

// determine the directories and files that need to be manipulated according to the input path.
Sftp.prototype._resolve = function (source) {
    let paths = {
        dir: '',
        file: ''
    };

    if (!source) return paths;

    let {dir, base, ext} = parse(source);

    // source: directory, ex. static or static/test
    if (ext === '') {
        paths.file = '';
        paths.dir = source;
    } else if (dir) {
        // source: directory + file, ex. static/test.js
        paths.file = base;
        paths.dir = dir;
    } else {
        // source: file, ex. test.js
        paths.file = source;
        paths.dir = '';
    }

    return paths;
};

// 统计本地需要操作的文件夹和文件
Sftp.prototype._stat = function (paths, fileName) {
    let {remotePath, localPath} = this.options,
        oPath = {
            dirAttr: [],
            fileObj: {}
        };

    paths.forEach(function (file) {
        let dictPath = join(remotePath, file.replace(localPath, ''));

        if (extname(file) === '') {
            oPath.dirAttr.push(dictPath);
        } else {
            // ingore hash
            const thisFile = parse(file),
                thisFileName = thisFile.base.split('.')[0] + thisFile.ext;

            // upload files which named fileName if input fileName
            if (fileName && thisFileName !== fileName) return true;

            oPath.fileObj[file] = dictPath;
        }
    });

    return oPath;
};

// 创建目录
Sftp.prototype._makeDirs = function (paths) {

    let {remotePath, localPath} = this.options,
        that = this;

    return new Promise((resolve, reject) => {
        paths.map((path) => {
            let pathAttr = path.split('/'),
                dir = '';

            pathAttr.map((file) => {
                file && (dir += '/' + file);

                that.sftp.exists(dir, (isExist) => {
                    if (isExist) return;

                    // 判断是文件夹时，则创建目录（避免有时候文件被创建成文件夹格式）
                    var stat = fs.lstatSync(path.replace(remotePath, localPath));

                    stat.isDirectory() &&
                    that.sftp.mkdir(dir, function (err) {
                        if (err) return reject(err);
                    })
                })
            });
        });

        return resolve();
    })
};

// 上传文件
Sftp.prototype._upload = function (files, callback) {
    let len = 0;

    for (let i in files) {
        len++;
        this.sftp.fastPut(i, files[i], function (err) {
            if (err) {
                // 若上传失败 重试一次
                this.sftp.fastPut(i, files[i], function (err) {
                    if (err) return console.log('error:', err);

                    console.log(i, ' --> ', files[i]);
                    if (--len === 0) {
                        this.conn.end();
                        callback && callback();
                    }
                }.bind(this));
            } else {
                console.log(i, ' --> ', files[i]);
                if (--len === 0) {
                    this.conn.end();
                    callback && callback();
                }
            }
        }.bind(this));
    }
};

module.exports = Sftp;
