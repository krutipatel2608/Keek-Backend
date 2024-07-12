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

const dirPath = 'C:\\';
const options = {
  key: fs.readFileSync(`${dirPath}OpenSSL-Win64/myprivatekey.key`),
  cert: fs.readFileSync(`${dirPath}OpenSSL-Win64/mycertificate.crt`)
};

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});