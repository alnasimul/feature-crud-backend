const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
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
    const { useremail, username, title, description, requestDate } = req.body;

    features.insertOne({ useremail, username, title, description, requestDate }).then((result) => {
      res.status(200).send(result.acknowledged);
    });
  });

  console.log("connected to mongo instance..");
});

app.listen(port, () => {
  console.log(`server is ready on port ${port} `);
});
