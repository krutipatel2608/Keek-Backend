const mongoose = require('mongoose')

require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('connected to database successfully!');
})
.catch((error) => {
    console.log(error);
    console.log('error while connecting to database');
})













