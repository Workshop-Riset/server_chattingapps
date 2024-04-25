if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

// socketio
const {
  createServer
} = require('http')
const {
  Server
} = require("socket.io");


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

app.use(express.urlencoded({
  extended: false
}))
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


// socket
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  },
});
  const DB = {
    lastCount : 0,
    onlineUsers : [],
    message : [],
  }
io.on("connection", (socket) => {
    if(socket.handshake.auth.access_token) {
      DB.onlineUsers.push({
        access_token : socket.handshake.auth.access_token,
        id : socket.id
      })
    }

    io.emit('users:online', DB.onlineUsers);

    socket.on('message:send', (value) => {
      DB.message.push({
        message : value,
        sender : socket.handshake.auth.username
      })
    })

    io.emit("message:new", DB.message);

    socket.on("disconnect", () => {
      DB.onlineUsers = DB.onlineUsers.filter(
        (user) => user.username !== socket.handshake.auth.username
      )

      socket.broadcast.emit("user:online", DB.onlineUsers)
    })

    socket.emit("count:last", DB.lastCount)

    socket.on("count:add", (value) => {
      DB.lastCount = value


      socket.broadcast.emit("count:update", value)
    })
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = (router, app)