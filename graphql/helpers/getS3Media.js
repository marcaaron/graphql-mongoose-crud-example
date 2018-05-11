require('dotenv').config();
const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;
const sTHREE = new aws.S3();
aws.config.region = 'us-west-2';

module.exports = () => {
  return new Promise((resolve, reject)=>{
    sTHREE.listObjects({
      Bucket: S3_BUCKET
    }, (err, data) => {
      if (err) reject(err);
      if (data) {
        const arr = data.Contents;
        result = arr.map(file=>{
          const obj = {
            key: file.Key,
            lastModified: file.LastModified.toISOString(),
            urlString: `https://kahukuorgdata.s3.amazonaws.com/${file.Key}`
          }
          return obj;
        });
        resolve(result);
      };
    });
  });
};
