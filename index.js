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

app.get('/fbPost/:postId', async(req, res) => {
  const url = `https://graph.facebook.com/v12.0/${req.params.postId}/insights/post_impressions_unique?fields=value&access_token=${process.env.ACCESS_TOKEN}`;
  
  console.log(url, '-- url 136 ---');
try {
  const response = await axios.get(url);
  console.log(response, '--- response 139 ----');
  const insights = response.data.data;

  let views = 0;
  insights.forEach((insight) => {
    views += insight.values[0].value;
  });
  console.log(views, '--- views 145 ----');

  console.log(`Views: ${views}`);

  // Fetch likes
  const reactionsUrl = `https://graph.facebook.com/v12.0/${req.params.postId}/reactions?summary=true&access_token=${process.env.ACCESS_TOKEN}`;
  const likesResponse = await axios.get(reactionsUrl);
  const likes = likesResponse.data.summary.total_count;

  console.log(`Likes: ${likes}`);
} catch (error) {
  console.error('Error fetching data:', error.response? error.response.data : error.message);
}
})

const extractPostIdFromUrl = (url) => {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
};

const postUrl = 'https://www.facebook.com/nparksbuzz/posts/881358010698524';
const postId = extractPostIdFromUrl(postUrl);
console.log(postId, ' ----- post id ----'); // This will print the extracted post ID

const dirPath = 'C:\\';
const options = {
  key: fs.readFileSync(`${dirPath}OpenSSL-Win64/myprivatekey.key`),
  cert: fs.readFileSync(`${dirPath}OpenSSL-Win64/mycertificate.crt`)
};

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});