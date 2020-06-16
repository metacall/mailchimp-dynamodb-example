"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

// Dynamo put object
// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/webhook", (req, res) => {
  res.send("ok");
});

app.post("/webhook", (req, res) => {
  // For a better security in this webhook,
  // mailchimp recommends to use a secret sent in the url

  if (req.body && req.body.type === "subscribe" && req.body.data) {
    try {
      const email = req.body.data.email;

      console.log("New email registered! ", email);

      var params = {
        TableName: "newsletter-subscriptions",
        Item: {
          email: { S: email },
        },
      };

      // Call DynamoDB to add the item to the table
      ddb.putItem(params, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
          res.send("ok");
        }
      });
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.status(400).send("req needs body with type and data");
  }
});

app.listen(8080, () => console.log(`Express Listening ...`));
