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
const cors = require('cors');
const {
  verify
} = require('jsonwebtoken');
const {
  verifyToken
} = require('./helpers/jwt');

app.use(express.urlencoded({
  extended: false
}))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send("gassken")
})


app.use('/', userRouter)
app.use('/', friendRouter)
app.use('/', messageRouter)
app.use('/', conversationRouter)
app.use('/', profileRouter)

app.use(errorHandler)

// app.use(errorHandler)


// socket
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  },
});
const DB = {
  lastCount: 0,
  onlineUsers: [],
  message: [],
}

console.log(DB.onlineUsers, '<<<<<<');
io.on("connection", (socket) => {
  console.log(verifyToken(socket.handshake.auth.token));
  // console.log(socket.handshake.auth.token);
  // console.log(socket.handshake);
  let userName = verifyToken(socket.handshake.auth.token)
  if (socket.handshake.auth.token) {
    DB.onlineUsers.push({
      token : socket.handshake.auth.token,
      userName,
      id: socket.id
    })
  }

  io.emit('users:online', DB.onlineUsers);

  socket.on('message:send', (value) => {
    DB.message.push({
      message: value,
      sender: socket.handshake.auth.token
    })
  })

  io.emit("message:new", DB.message);

  socket.on("disconnect", () => {
    DB.onlineUsers = DB.onlineUsers.filter(
      (user) => user.token !== socket.handshake.auth.token
    )
    console.log(DB.onlineUsers, '< logoutttttt');
    socket.broadcast.emit("users:online", DB.onlineUsers)
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