let OSS = require('ali-oss');
const path = require('path');
const fs = require('fs');

function _walkSync(dir, fileList) {
  let files = fs.readdirSync(dir);
  fileList = fileList || [];
  files.forEach(function(file) {
    let sf = path.resolve(dir, file);
    if (fs.statSync(sf).isDirectory()) {
      fileList = _walkSync(sf, fileList);
    } else {
      fileList.push(sf);
    }
  });
  return fileList;
}

class Uploader {
  constructor(props) {
    this.config = {
      accessKeyId: props.accessKeyId,
      accessKeySecret: props.accessKeySecret,
      bucket: props.bucket,
      region: props.region,

      prefixPath: props.prefixPath,
    };

    this.uploadClient = new OSS({
      accessKeyId: this.config.accessKeyId,
      accessKeySecret: this.config.accessKeySecret,
      bucket: this.config.bucket,
      region: this.config.region,
    });
  }

  _resolveKey(filePath) {
    return filePath.replace(this.config.prefixPath, '');
  }

  uploadFile({key, filePath}) {
    return this.uploadClient.put(key, filePath);
  }

  uploadDir({dirPath, prefix = ''}) {
    let filePaths = _walkSync(dirPath);
    let arr = [];
    filePaths.forEach(filePath => {
      arr.push(this.uploadFile(
        {filePath, key: prefix + this._resolveKey(filePath)}));
    });
    return Promise.all(arr);
  }
}

module.exports = Uploader;
