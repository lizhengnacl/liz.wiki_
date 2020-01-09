const path = require('path');
const aliConfig = require('./ali.config');
const Uploader = require('./upload');

// upload .next/static
let uploadToStatic = new Uploader({
  ...aliConfig.oss,
  prefixPath: path.resolve(__dirname, '.next/static') + '/',
});

uploadToStatic.uploadDir({
  dirPath: path.resolve(__dirname, '.next/static') + '/',
  prefix: '_next/static/',
}).then(res => {
  console.log('========== upload static success ==========');
});

// upload public
let uploadToPublic = new Uploader({
  ...aliConfig.oss,
  prefixPath: path.resolve(__dirname, 'public') + '/',
});

uploadToPublic.uploadDir({
  dirPath: path.resolve(__dirname, 'public') + '/',
  prefix: 'public/',
}).then(res => {
  console.log('========== upload public success ==========');
});
