const connectToMongo = require('./db')
const express = require('express')
connectToMongo();
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()
const port = 5000

//If we have to use body of an request this line is nessosory
app.use(express.json())
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));
app.use(cors())

//Available Routes
//This is the authintication rout
app.use('/api/auth', require('./routes/auth'))
//This is the post rout 
app.use('/api/posts', require('./routes/posts'))

app.listen(port, () => {
  console.log(`Foundit backend app listening on port ${port}`)
})
