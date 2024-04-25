if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const {Conversation} = require('./models/')

const express = require("express");
const router = express.Router();
const app = express();
const port = process.env.PORT || 3000;
const userRouter = require("./routes/user");
const friendRouter = require("./routes/friend");
const messageRouter = require("./routes/message");
const conversationRouter = require("./routes/conversation");
const profileRouter = require("./routes/profile");
const errorHandler = require("./helpers/errorHandle");
const cors = require("cors");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// - socket nyah - //
const { createServer } = require("http");
const { Server } = require("socket.io");
const { verifyToken } = require("./helpers/jwt");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// - socket nyah - //

app.get("/", (req, res) => {
  res.send("gassken");
});

app.use(router);

router.use("/", userRouter);
router.use("/", friendRouter);
router.use("/", messageRouter);
router.use("/", conversationRouter);
router.use("/", profileRouter);

app.use(errorHandler);

// io.on("connection", (socket) => {
//   console.log(socket.id,`di server sudah oke`);

//   io.emit("startConversation")

//   socket.on("goConversation", async (token) => {

//     let {id} = verifyToken(token)
//     console.log(id,`<< id dari token`);

//     try {
//       const conv = await Conversation.findOne({
//         where : {
//           senderId:id
//         }
//       })

//       let dynamic1 = {
//         conversationId: conv.id,
//         senderId: conv.senderId,
//         receiverId: conv.receiverId
//       }

//       io.emit("runConversation", dynamic1 )
//       console.log(dynamic1, 11111111111);
//     } catch (error) {
//       console.log(error, `Di bagian goConversation`);
//     }

//   })
  
//   socket.on("newMessage", async (token)=>{

//     let {id} = verifyToken(token)
//     console.log(verifyToken(token),  9999);

//     try {
//       const conv = await Conversation.findOne({
//         where : {
//           senderId:id
//         }
//       })

//       let dynamic = {
//         conversationId: conv.id,
//         senderId: conv.senderId,
//         receiverId: conv.receiverId
//       }

//       console.log(dynamic,2222222222);

//       io.emit("runConversation", (dynamic))
      
//     } catch (error) {
//       console.log(error, `Di bagian goConversation`);
//     }

//     io.emit("fetchMessage")
//   })

// });

io.on("connection", (socket) => {
 console.log(`di server connect client`);

  
})

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = (router, app);
