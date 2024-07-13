const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const Router = express.Router()
// const https = require('https');
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
  //  const redirectURI = querystring.escape(process.env.REDIRECT_URI)
    const authURL = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTA_APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    // res.redirect(authURL);
    return response(res, true, 200, 'Success', authURL)
  } catch (error) {
    console.log(error, ' -- error 418 ----');
    return response(res, false, 500, 'Something Went Wrong!')
  }
});

// app.get('/instaCallback', async(req, res) => {
//   try {
//     const { code } = req.query;
//     console.log(process.env.REDIRECT_URI);
//     console.log(req.query, ' ---- code 66 ----');
//     const tokenURL = "https://api.instagram.com/oauth/access_token";
//     const client_id = process.env.INSTA_APP_ID;
//     const client_secret = process.env.INSTA_APP_SECRET;
     
//       const querystring = require('querystring')
//       // const redirectUri = querystring.escape(process.env.REDIRECT_URI)
//       const redirectUri = 'https://localhost:2020/instaCallback'
      

//       axios.post(tokenURL, {
//         client_id: process.env.INSTA_APP_ID,
//         client_secret: process.env.INSTA_APP_SECRET,
//         grant_type: "authorization_code",
//         redirect_uri: process.env.REDIRECT_URI,
//         code: req.query.code,
//       }, {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         }
//       })
//       .then(resData => {
//         return `Access Token: ${resData.data.access_token}`;
//       })
//       .catch(error => {
//         console.log(error, '-- error 109 ----');
//         return "Error fetching access token";
//       })

//   } catch (error) {
//     console.log(error, ' ---- error 84 ---');
//     return res.status(500).send('Something Went Wrong!');
//   }
// })

// const dirPath = 'C:\\';



app.get('/instaCallback',async (req, res) => {
  const { code } = req.query;

  const tokenUrl = 'https://api.instagram.com/oauth/access_token';
  const client_id = process.env.INSTA_APP_ID;
  const client_secret = process.env.INSTA_APP_SECRET;
  const grant_type = "authorization_code";
  const redirect_uri = process.env.REDIRECT_URI;

  const formData = new FormData();
  formData.append("client_id", client_id);
  formData.append("client_secret", client_secret);
  formData.append("grant_type", grant_type);
  formData.append("redirect_uri", redirect_uri);
  formData.append("code", code);
  let shortLivedToken;
  let token;
    const response = await axios.post(tokenUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    shortLivedToken = response.data.access_token;
  if (shortLivedToken) {

      const client_secret = process.env.INSTA_APP_SECRET;
      const longLivedTokenUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${client_secret}&access_token=${shortLivedToken}`;
      const response = await axios.get(longLivedTokenUrl);
      token = response.data
  }
  const userData = await axios.get(`https://graph.instagram.com/me?fields=id,username,media_count,account_type&access_token=${token?.access_token}`);
  // token.user_id = userData?.data?.id
  // const tokenData = await tables.PluginWatchAndShopUserToken.findOne({where:{user_id:user_id,store_id:restaurant_id,type:"INSTAGRAM"}})
  // if(tokenData){
  //   await tokenData.update({token: token});
  // }else{
  //     await tables.PluginWatchAndShopUserToken.create({user_id:user_id,store_id:restaurant_id,token: token, type:"INSTAGRAM"});
  // }
  return res.send({
    status:"Success",
    status_code:200,
    message:"token saved successfully",
    data: userData
  })
});


const options = {
  key: fs.readFileSync(path.join(__dirname,'/src/files/server.key')),
  cert: fs.readFileSync(path.join(__dirname,'/src/files/server.cert'))
};
// http.createServer(options, app).listen(port, () => {
//   console.log(`Server is running on https://localhost:${port}`);
// });

app.listen( port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})

// module.exports = app
