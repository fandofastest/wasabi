const express = require('express')
const app = express()
const AWS = require('aws-sdk')
require('dotenv').config()

const s3 = new AWS.S3({
  endpoint: 'http://s3.ap-northeast-1.wasabisys.com',
    accessKeyId: process.env.ACCESSKEY, // Your AWS Access Key ID
    secretAccessKey: process.env.SECRETKEY, // Your AWS Secret Access Key
    region: process.env.REGION, // Your AWS region
    signatureVersion: 'v4', // This is the default value
})




app.get('/d/:key', async (req, res) => {
  const params = {
    Bucket: process.env.MOVIEBUCKET, // Bucket name
    Key: req.params.key, // File name you want to save as in S3
    Expires: 15000, // 60 seconds is the default value, change if you want
  }
  const downloadURL = await s3.getSignedUrlPromise('getObject', params)
  console.log(req.query.dl);
  if (req.query.dl) {
    res.redirect(downloadURL);

  }
  else {
    res.send({downloadURL});
  }

})

// console.log(process.env.PORT);

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

