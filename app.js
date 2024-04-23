if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
  }
  
  
  
  const express = require('express')
  const router = express.Router()
  const app = express()
  const port = process.env.PORT || 3000
  const userRouter = require('./routes/user')
  const friendRouter = require('./routes/friend')
  const messageRouter = require('./routes/message')
  const conversationRouter = require('./routes/conversation')
  const profileRouter = require('./routes/profile')
  const errorHandler = require('./helpers/errorHandle')
  const cors = require('cors')
  
  app.use(express.urlencoded({extended: false}))
  app.use(express.json())
  app.use(cors())
  
  app.get('/', (req, res) => {
    res.send("gassken")
  })
  
  app.use(router)
  
  router.use('/', userRouter)
  router.use('/', friendRouter)
  router.use('/', messageRouter)
  router.use('/', conversationRouter)
  router.use('/', profileRouter)
  
  app.use(errorHandler)
  
  // app.use(errorHandler)
  app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  
    module.exports = (router, app)