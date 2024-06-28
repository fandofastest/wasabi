const express = require('express')
const app = express()
const AWS = require('aws-sdk')
require('dotenv').config()


// import { FullStaticSearch } from 'full-static-search'
const FullStaticSearch = require('full-static-search').FullStaticSearch;
const MiniSearch = require('minisearch')


const s3 = new AWS.S3({
  endpoint: 'http://s3.ap-northeast-1.wasabisys.com',
    accessKeyId: process.env.ACCESSKEY, // Your AWS Access Key ID
    secretAccessKey: process.env.SECRETKEY, // Your AWS Secret Access Key
    region: process.env.REGION, // Your AWS region
    signatureVersion: 'v4', // This is the default value
})




app.get('/d/', async (req, res) => {
  const params = {
    Bucket: process.env.MOVIEBUCKET, // Bucket name
    Key: req.query.key, // File name you want to save as in S3
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


app.get('/all/', async (req, res) => {
  var bucketParams = {
    Bucket : 'movie1111',
    MaxKeys:5000,
};

// Call S3 to obtain a list of the objects in the bucket
s3.listObjects(bucketParams, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
        res.send({data});
    }
});

})


app.get('/search/', async (req, res) => {
  var bucketParams = {
    Bucket : 'movie1111',
    MaxKeys:6000,
};

// Call S3 to obtain a list of the objects in the bucket
s3.listObjects(bucketParams, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        // console.log("Success", data);
        // var containstext = data.Contents.filter(word => word.Key.toLowerCase().includes(req.query.q.toLowerCase()));
       
        // search.filter(req.query.q.toLowerCase())

        var mykey=[]
        var index=0;
        data.Contents.forEach(element => {
          mykey.push({'id':index++,
            'title' :element.Key})
        });

        let miniSearch = new MiniSearch({
          fields: ['title'], // fields to index for full-text search
          storeFields: ['title'] 
        })

        console.log(mykey);

        miniSearch.addAll(mykey)

        let results = miniSearch.search(req.query.q)


        console.log(results);

        // console.log(data.Contents)
        
        // results.forEach( function (result) {
        //   console.log(result.entry);
        // });

        res.send(results);
    }
});

})



// console.log(process.env.PORT);

app.listen(process.env.PORT, () => {
    console.log('Server is running on port '+process.env.PORT)
})

