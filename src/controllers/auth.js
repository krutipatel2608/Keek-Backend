const bcrypt = require("bcrypt");
const sendGridMail = require("@sendgrid/mail");
// const twilio = require("twilio");
const fs = require("fs");
// const client = new twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

const userModel = require("../models/user");
const { default: axios } = require("axios");
const response = require("../constants/response");
require("dotenv").config();

exports.signUp = async (req, res) => {
  try {
    console.log(req.body, " ----- log 10 ----");
    req.body.email = req.body.email ? req.body.email : null;
    // req.body.phone = req.body.phone? req.body.phone: null;
    let checkUser = await userModel.findOne({
      // $or: {
      email: req.body.email,
      // 'phone': req.body.phone
      // }
    });
    if (checkUser) {
      return res.send({
        status: false,
        statusCode: 402,
        message: "User Already Exist!",
      });
    }
    // if(req.body.confirm_password !== req.body.password){
    //   return res.send({
    //     status: false,
    //     statuscode: 422,
    //     message: 'Wrong Password!'
    //   })
    // }else{
    req.body.password
      ? (req.body.password = bcrypt.hashSync(req.body.password, 10))
      : "";
    // req.body.confrim_password = req.body.password;
    // }
    await userModel
      .create(req.body)
      .then(async () => {
        sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: req.body.email, // Change to your recipient
          from: "krutikakamli@gmail.com", // Change to your verified sender
          subject: "Email verification with otp",
          text: generateNumber(4),
          html: "<strong>and easy to do anywhere, even with Node.js</strong>",
        };
        await sendGridMail
          .send(msg)
          .then((data) => {
            console.log(data, " --- data log 117 ---");
          })
          .catch((error) => {
            console.log(error);
          });
        return res.send({
          status: true,
          statusCode: 201,
          message:
            "OTP as been sent to your resgistered email, Please Confirm your Registration.",
        });
      })
      .catch((err) => {
        return res.send({
          status: true,
          statusCode: 422,
          message: "Something Went Wrong!",
        });
      });
  } catch (error) {
    return res.send({
      status: true,
      statuscode: 500,
      message: "Something Went Wrong!",
    });
  }
};

exports.login = async (req, res) => {
  try {
    let user = await userModel.findOne({
      email: req.body.email,
    });
    // let user = await userModel.findOne({
    //   $or: {
    //     'email' : req.body.email,
    //     'phone': req.body.phone
    //     }
    //     })
    if (!user) {
      return res.send({
        status: false,
        statusCode: 401,
        message: "Invalid Credentials!",
      });
    } else {
      let comparePass = bcrypt.compareSync(req.body.password, user.password);
      if (comparePass) {
        return res.send({
          status: true,
          statusCode: 201,
          message: "Login Successfully.",
        });
      } else {
        return res.send({
          status: false,
          statusCode: 401,
          message: "Invalid Credentials!",
        });
      }
    }
  } catch (err) {
    console.log(err, "error:");

    res.send({
      status: false,
      statusCode: 500,
      message: "Something Went Wrong!",
    });
  }
};

// exports.sendOTP = async(req, res) => {
//   try {
//     sendGridMail.setApiKey(process.env.SENDGRID_API_KEY)
//     const msg = {
//       to: req.body.email, // Change to your recipient
//       from: 'krutikakamli@gmail.com', // Change to your verified sender
//       subject: 'Email verification with otp',
//       text: generateNumber(4),
//       html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//     }
//     sendGridMail
//       .send(msg)
//       .then((data) => {
//         console.log(data, ' --- data log 117 ---');
//         return res.send({
//           status: true,
//           statuscode: 201,
//           message: 'OTP sent successfully'
//         })
//         console.log('Email sent successfully.')
//       })
//       .catch((error) => {
//         console.error(error)
//       })
//   } catch (error) {
//     console.log(error, ' --- error log 122 ---');
//     return res.send({
//       status: true,
//       statuscode: 500,
//       message: 'Something Went Wrong!'
//   })
//   }
// }

const generateNumber = (length) => {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

// exports.sendOTP = async (req, res) => {
//   try {
//     // console.log(req.body, '--- body ----');
//     const sendOtp = client.messages.create({
//       body: `Your OTP for Keek is ${generateNumber(4)}`,
//       to: `+91${req.body.mobile}`, // Text this number
//       from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
//     });
//     if (sendOtp) {
//       return res.send({
//         status: true,
//         statuscode: 201,
//         message: "OTP sent successfully",
//       });
//     } else {
//       return res.send({
//         status: false,
//         statuscode: 422,
//         message: "Something went wrong!",
//       });
//     }
//   } catch (error) {
//     console.log(error, "---- error 194 ---");
//     return res.send({
//       status: false,
//       statuscode: 500,
//       message: "Something went wrong!",
//     });
//   }
// };

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findOne({ email });
    req.body.password
      ? (req.body.password = bcrypt.hashSync(req.body.password, 10))
      : "";
    if (user) {
      return res.send({
        status: false,
        statuscode: 402,
        message: "User email already exists!",
      });
    }
    const addUser = await userModel.create(req.body);
    if (addUser) {
      return res.send({
        status: true,
        statuscode: 201,
        message: "User registered successfully.",
        data: addUser,
      });
    } else {
      return res.send({
        status: false,
        statuscode: 422,
        message: "Something went wrong!",
      });
    }
  } catch (error) {
    console.log(error, "---- log 227 ----");
    return res.send({
      status: false,
      statuscode: 500,
      message: "Something went wrong!",
    });
  }
};

exports.verifyMobileOTP = async (req, res) => {
  try {
  } catch (error) {
    return res.send({
      status: false,
      statuscode: 500,
      message: "Something went wrong!",
    });
  }
};

exports.fetchUserData = async (req, res) => {
  try {
    console.log(req.params.username, " ---- log 251 req ----");
    const axios = require("axios");
    axios.get(
      `https://www.instagram.com/${req.params.username}/?__a=1`,
      (err, response, html) => {
        if (!err) {
          console.log(response, " ----- log response 255 ----");
          const json = JSON.parse(html)?.graphql?.user;
          console.log(json, " ---- json log 254-----");
        } else {
          console.log(err, "------log err 259 ----");
        }
      }
    );
    return;
  } catch (error) {
    console.log(error, " --- log error ----");
    return res.send({
      status: false,
      statuscode: 500,
      message: "Something went wrong!",
    });
  }

  // try {
  //   // needs insta acct public
  //    await axios.get(`https://graph.instagram.com/me/media?fields=media_type,permalink,media_url&access_token=${process.env.INSTA_APP_SECRET}`)
  //    .then((response) => {
  //       console.log(response.data, ' ----- data log 277 ----');
  //    })
  //    .catch((err) => {
  //     console.log(err, ' ---- error log 280 ----');
  //    })
  //   // {
  //     // params: {
  //     //   fields: "followers_count, media_count, likes_count, media_url",
  //     //   access_token: process.env.APP_SECRET,
  //     // },
  //     // headers: {
  //     //   host: "graph.instagram.com",
  //     // },
  //   // });
  //   console.log(fetchData.data, ' ---- fetchData log 282 -----');
  //   return response(res, true, 201, 'success.')
  // } catch (error) {
  //   // console.log(error, ' ---- log 286 error -----');
  //   return res.send({
  //         status: false,
  //         statuscode: 500,
  //         message: 'Something went wrong!'
  //        })
  // }
};
//
exports.youtubeData = async (req, res) => {
  const { google } = require("googleapis");
  const readline = require("readline");
  const openurl = require("openurl");
  const express = require("express");
  const router = express.Router();
  try {
    fs.readFile("./src/json/yt-credentials.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      // console.log(JSON.parse(content), ' ---- log content 312 ----');
      authorize(JSON.parse(content), startServer);
    });

    const SCOPES = ["https://www.googleapis.com/auth/yt-analytics.readonly"];
    const TOKEN_PATH = "./src/json/yt-credentials.json";

    function authorize(credentials, callback) {
      console.log(credentials, " ---- credentials.installed log 318");
      const { client_secret, client_id, redirect_uris } = credentials.web;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );
      console.log(" ---- log 1 ----");

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        console.log(" ---- log 2 ----");
        if (err) return getAccessToken(oAuth2Client, callback);
        console.log(" ---- log 331 ----");
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
        console.log(" ---- log 334 ----");
      });
    }
    console.log(oAuth2Client, " ---- log 3 ----");
    function getAccessToken(oAuth2Client, callback) {
      console.log(" --- log 4 --- ");
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
      });
      console.log("Authorize this app by visiting this url:", authUrl);
      openurl.open(authUrl);

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      console.log(" ---- log 5 ----");
      rl.question("Enter the code from that page here: ", (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error("Error retrieving access token", err);
          oAuth2Client.setCredentials(token);
          console.log(" ---- log 6 ----");
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log("Token stored to", TOKEN_PATH);
          });
          console.log(" ---- log 7 ----");
          callback(oAuth2Client);
        });
      });
    }

    function startServer(auth) {
      const youtubeAnalytics = google.youtubeAnalytics({ version: "v2", auth });

      router.get("http://localhost:2020/channel-reports", async (req, res) => {
        try {
          const response = await youtubeAnalytics.reports.query({
            ids: "channel==MINE",
            startDate: "2024-07-01",
            endDate: "2024-07-31",
            metrics: "views,likes,dislikes",
            dimensions: "day",
            sort: "day",
          });
          return response(res, true, 200, "Success", response.data);
        } catch (error) {
          console.error(
            "Error fetching data from YouTube Analytics API:",
            error
          );
          return response(res, false, 500, "Error");
          // res.status(500).send('Error fetching data');
        }
      });
    }
  } catch (error) {
    return response(res, false, 500, "Something Went Wrong!");
  }
};


// const encodeRedirectUrl = querystring.escape(redirect_uri)

exports.instaLogin = async (req, res) => {
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
};

// C:\Program Files (x86)\Microsoft\Edge\Application

exports.instaAuth = async (req, res) => {
  const querystring = require('querystring')
  console.log(process.env.REDIRECT_URI, ' --- REDIRECT_URI log 27 ----');
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
        client_id,
        client_secret,
        grant_type: "authorization_code",
        redirect_uri: process.env.REDIRECT_URI,
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
};
