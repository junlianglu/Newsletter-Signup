require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us18.api.mailchimp.com/3.0/lists/" + process.env.LIST_IDEA;
  const options = {
    method: "POST",
    auth: "lu:" + process.env.API_KEY
  }
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) res.sendFile(__dirname + "/success.html");
    else res.sendFile(__dirname + "/failure.html");
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000.");
});

/*{
  "name": "$event_name",
  "contact": $footer_contact_info,
  "permission_reminder": "permission_reminder",
  "email_type_option": true,
  "campaign_defaults": $campaign_defaults
}*/
