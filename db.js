const mongoose = require('mongoose');
require('dotenv').config()

const mongoURI = process.env.MONGO_URL;

const connectToMongo = async () =>{
    const it = await mongoose.connect(mongoURI)
}

module.exports = connectToMongo;

// Steps for installatin:
// npm init
// npm i express
// npm i mongoose
// npm i -D nodemon
// npm install express-validator
// npm i bcryptjs
// npm install jsonwebtoken
// npm install dotenv --save
// npm install cors

//for sending mails
// npm i nodemailer
