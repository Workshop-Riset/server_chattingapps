if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
  }
  
  
  
  const express = require('express')
  const router = express.Router()
  const app = express()
  const port = process.env.PORT || 3000
  const userRouter = require('./routes/user')
  const errorHandler = require('./helpers/errorHandle')
  const cors = require('cors')
  
  app.use(express.urlencoded({extended: false}))
  app.use(express.json())
  app.use(cors())
  
  app.get('/', (req, res) => {
    res.send("yoooo")
  })
  
  app.use(router)
  
  router.use('/users', userRouter)
  
  
  
  app.use(errorHandler)
  app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  
    module.exports = (router, app)