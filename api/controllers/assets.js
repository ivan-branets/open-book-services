import uuid from 'uuid';
import path from 'path';
import AWS from 'aws-sdk';

const BUCKET_NAME = 'ivan-bucket-1';
const IAM_USER_KEY = 'AKIAI4O55RYUPK7FQOOA';
const IAM_USER_SECRET = 'fBV5tjPlr//8IoDKXmxn1KCiLmZ7WGqTRX0r0ej_';

function uploadToS3(filename, buffer, callback) {
    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME
    });

    s3bucket.createBucket(() => {
        const params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: buffer
        };

        s3bucket.upload(params, callback);
    });
}

export function putAsset(req, res) {
    const file = req.swagger.params.file.value;
    const filename = uuid.v1();

    uploadToS3(filename + path.extname(file.originalname), file.buffer, error => {
        if (!error) {
            res.status(201).json({
                message: {
                    assetId: filename
                }
            });
        } else {
            res.status(500).json({
                message: 'server error'
            });
        }
    });
}
