const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql');
const schema = require('./graphql/schema');
const mongoose = require('./mongoose/server');
const db = mongoose();
const cors = require('cors')
const aws = require('aws-sdk');
const path = require('path');

app.use(cors());


// build path
// app.use('/', express.static(`${__dirname}/client/build`));

// import PageModel for testing mongo queries before
const PageModel = require('./models/page');

// Sets up a graphql endpoint and graphiql query zone
app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}));

// Bucket config
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-west-2';

// Set up endpoint for signing AWS uploads
app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

// Start Server...
app.listen(4000, ()=>console.log('Running GraphQL Server...'));
