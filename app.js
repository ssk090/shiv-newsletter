const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const request = require("request");
const https = require("https");
require("dotenv").config();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/sign-up.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailId = req.body.emailId;
  console.log(firstName, lastName, emailId);

  var data = {
    members: [
      {
        email_address: emailId,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  var jsonData = JSON.stringify(data);

  const url = `https://us8.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`;
  const options = {
    method: "POST",
    auth: `imshiv:${process.env.API_KEY}`,
  };
  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      var parsedData = JSON.parse(data);
      if (response.statusCode === 200 && parsedData.error_count == 0) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });
  request.write(jsonData);
  request.end();
});

app.use(express.static(__dirname));

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/home", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
