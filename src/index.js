const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const ObjectID = require('mongodb').ObjectID;
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dj06w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get("/", (req, res) => {
  res.send("hello form feature crud server");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const features = client.db(process.env.DB_NAME).collection("features");

  app.post("/addFeature", (req, res) => {
    const { publish, useremail, username, title, description, requestDate } = req.body;

    features.insertOne({publish, useremail, username, title, description, requestDate }).then((result) => {
      res.status(200).send(result.acknowledged);
    });
  });

  app.get('/features', (req, res) => {
    features.find({})
    .toArray((err, documents) => {
      res.status(200).send(documents)
    })
  })

  app.patch('/updateFeature/:id', (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;

    features.updateOne({_id: ObjectID(id)},{
      $set: {title, description }
    })
    .then( result => {
      res.status(200).send( result.modifiedCount > 0)
    })
    .catch(err => console.log(err))
  })

  app.patch('/updatePublishStatus/:id', (req, res) => {
    const {publish} = req.body;
    const id =  req.params.id;

    features.updateOne({ _id: ObjectID(id) }, {
      $set: { publish }
    })
    .then(result => {
      res.status(200).send( result.modifiedCount > 0)
    })
    .catch(err => console.log(err))

  })

  app.delete('/deleteFeature/:id', (req, res) => {
    const id = req.params.id;

    features.deleteOne({_id: ObjectID(id)})
    .then(result => {
      res.status(200).send(result.deletedCount > 0 )
    })
    .catch(err => console.log(err))
  })

  console.log("connected to mongo instance..");
});

app.listen(port, () => {
  console.log(`server is ready on port ${port} `);
});
