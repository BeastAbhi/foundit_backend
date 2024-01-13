const connectToMongo = require('./db')
const express = require('express')
connectToMongo();

const app = express()
const port = 5000

//If we have to use body of an request this line is nessosory
app.use(express.json())

//Available Routes
//This is the authintication rout
app.use('/api/auth', require('./routes/auth'))
//This is the post rout 
app.use('/api/posts', require('./routes/posts'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
