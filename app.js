import express from 'express'
import HelloController from "./controllers/hello-controller.js"
import UsersController from "./controllers/users/users-controller.js"
import TuitsController from "./controllers/tuits/tuits-controller.js";
import LikesController from "./controllers/likes/likes-controller.js";
import AuthenticationController from "./controllers/users/auth-controller.js";
import MessagesController from "./controllers/messages/messages-controller.js";
import GamesController
    from "./controllers/games/games-controller.js";
import ReviewController
    from "./controllers/reviews/reviews-controller.js";
import cors from 'cors'
import session from 'express-session'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import { Server } from "socket.io";



dotenv.config();

//const DbUrl = 'mongodb://127.0.0.1:27017/tuiter';
const CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
mongoose.connect(CONNECTION_STRING).then(() => console.log('DB started'))
    .catch(() => () => console.log(error.message));

const app = express()

// cross network region
app.use(cors(
    {
        // support cookie header
        credentials: true,
        // must whitelists allowed domains(if using credentials)
        // http://localhost:3000
        origin: ['http://localhost:3000', process.env.CORS_ORIGIN]
    }));

// Secret is used in hashing the session ID
const SECRET = 'process.env.SECRET';
//session configure
let sess = {
    secret: SECRET,
    // forces a new session to be saved.
    saveUninitialized: true,
    // enforces that the session is resaved against the server store on each request
    resave: true,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        // sameSite: none allows cookies to be sent in all contexts
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
    }
}

if (process.env.NODE_ENV === 'production') {
    // must set for secure to work on HTTPs protocol
    app.set('trust proxy', 1) // trust first proxy
}

app.use(session(sess))
app.use(express.json({
    limit: '50mb'
}));

GamesController(app);
ReviewController(app);
TuitsController(app);
HelloController(app);
UsersController(app);
LikesController(app);
MessagesController(app);
AuthenticationController(app);
const httpServer = app.listen(process.env.PORT || 4000);

// create io, pass a http.Server instance to socket
const io = new Server(httpServer, {
    cors: {
        // support cookie header
        credentials: true,
        // must whitelists allowed domains(if using credentials)
        // http://localhost:3000
        origin: ['http://localhost:3000', process.env.CORS_ORIGIN]
    }
})

let onlineUsers = new Map();
// create connection with client
io.on("connection", (socket) => {

    let uid = '';
    //add online users
    socket.on("addUser", (userId) => {
        uid = userId
        onlineUsers.set(userId, socket.id);
    });

    // send message
    socket.on("sendMsg", (data) =>{
        // find receiver
        const receiverSocket = onlineUsers.get(data.sentTo);
        if(receiverSocket){
            // use socket to send received message to receiver
            socket.to(receiverSocket).emit("receiveMsg", data.message);
        }
    });

    //disconnect
    socket.on("disconnect", () => {
        //delete user
        onlineUsers.delete(uid);
    })

})