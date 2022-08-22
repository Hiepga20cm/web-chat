import bodyParser from "body-parser";
import express, { Request, Response, NextFunction, Application } from "express";
import cors from 'cors';
import router from "./Router";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from 'http';


const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    },
})

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Chatapp');

io.on('connection', (socket) => {
    console.log(`user connected :${socket.id} `)
    socket.on('on-chat', data => {
        console.log({ data })

    })
})


server.listen(5000, () => {
    console.log('is running on port 5000');
});

app.use('/', router);