module.exports = {
  putAsset: putAsset
};

const uuid = require('uuid');
const path = require('path')
const AWS = require('aws-sdk');

const BUCKET_NAME = 'ivan-bucket-1';
const IAM_USER_KEY = 'AKIAI4O55RYUPK7FQOOA';
const IAM_USER_SECRET = 'fBV5tjPlr//8IoDKXmxn1KCiLmZ7WGqTRX0r0ej_';

function putAsset(req, res) {
  const file = req.swagger.params.file.value;
  const filename = uuid.v1();

  uploadToS3(filename + path.extname(file.originalname), file.buffer, (error, data) => {
    res.status(201).json({
      message: {
        assetId: filename
      }
    });
  });
}

function uploadToS3(filename, buffer, callback) {
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME,
  });

  s3bucket.createBucket(() => {
    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
    };

    s3bucket.upload(params, callback);
  });
}
