const client_id = process.env.INSTA_APP_ID;
const client_secret = process.env.INSTA_APP_SECRET;
const redirect_uri = "https://127.0.0.1:8000/oauth2callback";
const encodeRedirectUrl = querystring.escape(redirect_uri)
const querystring = require('querystring')
const https = require('https');

 app.get( '/login',async (req, res) => {
  try {
    const authURL = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTA_APP_ID}&redirect_uri=${encodeRedirectUrl}&scope=user_profile,user_media&response_type=code`;
    // res.redirect(authURL);
    return response(res, true, 200, 'Success', authURL)
  } catch (error) {
    return response(res, false, 500, 'Something Went Wrong!')
  }
})

const querystring = require('querystring')
app.get('/oauth2callback', async (req, res) => {
  try {
    const { code } = req.query;
    console.log(code, ' ---- code 66 ----');
    const tokenURL = "https://api.instagram.com/oauth/access_token";
    // const redirect_uri = "https://localhost:2020/oauth2callback/";
   const redirect_uri = 'https://127.0.0.1:8000/oauth2callback';
    const client_id = process.env.INSTA_APP_ID;
    const client_secret = process.env.INSTA_APP_SECRET;
      const axios = require('axios');
      const encodeRedirectUrl = querystring.escape(redirect_uri)
      axios.post(tokenURL, {
        client_id,
        client_secret,
        grant_type: "authorization_code",
        encodeRedirectUrl,
        code,
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
});

const dirPath = 'C:\\';
const options = {
    key: fs.readFileSync(`${dirPath}OpenSSL-Win64/myprivatekey.key`),
    cert: fs.readFileSync(`${dirPath}OpenSSL-Win64/mycertificate.crt`)
  };
  
  https.createServer(options, app).listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
  });