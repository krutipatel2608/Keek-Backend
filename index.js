const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const Router = express.Router()
const https = require('https');

const port = process.env.PORT || 2020
require('dotenv').config()
require('./src/db-config/connection')

app.use(bodyParser.json())
app.use(express.json({ extended: false}))


fs.readdirSync(path.join(__dirname,'/src/routes/')).forEach(function(fileName) {
    if(fileName === 'index.js' || fileName.substr(fileName.lastIndexOf('.')) !== 'js'){
        const name = fileName.substr(0,fileName.indexOf('.'))
        require('./src/routes/' + name)(app,Router)
    }
})

app.get('/',(req, res) => {
  return res.send('Welcome to keek project')
})

app.get('/authoauth2callbackAPI', async(req, res) => {
  try {
    const { code } = req.query;
    console.log(code, ' ---- code 66 ----');
    const tokenURL = "https://api.instagram.com/oauth/access_token";
   const redirect_uri = process.env.REDIRECT_URI;
  //  const redirect_uri = req.query.redirect_uri;
    const client_id = process.env.INSTA_APP_ID;
    const client_secret = process.env.INSTA_APP_SECRET;
      const axios = require('axios');
      // const redirect_uri = querystring.escape(redirectUri)
      
      axios.post(tokenURL, {
        client_id: process.env.INSTA_APP_ID,
        client_secret: process.env.INSTA_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: 'https://keek-backend.vercel.app/authoauth2callbackAPI',
        code: req.query.code,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        // const body = response.data;
        const data = JSON.parse(response.data)
        res.send(`Access Token: ${data.access_token}`);
        // Handle the response body
      })
      .catch(error => {
        console.log(error, ' --- error 109 ----');
        // Handle the error
        return res.send("Error fetching access token");
      });
  } catch (error) {
    return res.send(res, false, 500, 'Something Went Wrong!')
  }
})

// const dirPath = 'C:\\';

const options = {
  key: fs.readFileSync(path.join(__dirname,'/src/files/server.key')),
  cert: fs.readFileSync(path.join(__dirname,'/src/files/server.cert'))
};
https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});

module.exports = app