const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://abhishekkakade35:AtlasProject2885@foundit.pelbl53.mongodb.net/?retryWrites=true&w=majority"

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