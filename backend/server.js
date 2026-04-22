const express = require('express')
const cors = require('cors')
require('dotenv').config()

const studentRoutes = require('./routes/studentRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.get("/",(req,res) => {
      res.status(200).json({message : "Welcome"})
})

app.use('/api/students', studentRoutes)

app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
})