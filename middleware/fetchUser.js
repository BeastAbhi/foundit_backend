const jwt = require('jsonwebtoken');
require('dotenv').config()


secreate = process.env.JWT_SECRET;
const fetchuser = (req, res, next) =>{
    // Get the user form the jwt token and add id to req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Please Login first"})
    }
    try {
        const data = jwt.verify(token, secreate)
        req.user = data.user;
        //The next function means it will go back to the auth.js file and execute the rout: 3 from where the fetchuser is called
        next();

    } catch (error) {
        success = false
        res.status(500).send({success, error: "Oops some thing went wrong!!"})
    }

}

module.exports = fetchuser;
