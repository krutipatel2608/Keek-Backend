const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const Router = express.Router()
const https = require('https');
const axios = require('axios');

const port = 2020
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

const response = require('./src/constants/response')
app.get('/oauth/authorize', async (req, res) => {
  try {
    const querystring = require('querystring');
   const redirectURI = querystring.escape(process.env.REDIRECT_URI)
    const authURL = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTA_APP_ID}&redirect_uri=${redirectURI}&scope=user_profile,user_media&response_type=code`;
    // res.redirect(authURL);
    return response(res, true, 200, 'Success', authURL)
  } catch (error) {
    console.log(error, ' -- error 418 ----');
    return response(res, false, 500, 'Something Went Wrong!')
  }
});

app.get('/instaCallback', async(req, res) => {
  try {
    const { code } = req.query;
    console.log(req.query, ' ---- code 66 ----');
    const tokenURL = "https://api.instagram.com/oauth/access_token";
    const client_id = process.env.INSTA_APP_ID;
    const client_secret = process.env.INSTA_APP_SECRET;
     
      const querystring = require('querystring')
      // const redirectUri = querystring.escape(process.env.REDIRECT_URI)
      const redirectUri = 'https://localhost:2020/instaCallback'
      

      axios.post(tokenURL, {
        client_id: process.env.INSTA_APP_ID,
        client_secret: process.env.INSTA_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: 'https://localhost:2020/instaCallback',
        code: req.query.code,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(resData => {
        return `Access Token: ${resData.data.access_token}`;
      })
      .catch(error => {
        console.log(error, '-- error 109 ----');
        return "Error fetching access token";
      })

  } catch (error) {
    console.log(error, ' ---- error 84 ---');
    return res.status(500).send('Something Went Wrong!');
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

// module.exports = app
