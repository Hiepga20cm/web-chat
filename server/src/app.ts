import bodyParser from "body-parser";
import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import router from "./Router";
import mongoose from "mongoose";
import { Server } from "socket.io";
import http from "http";

const URL =
  "mongodb+srv://hiepga123409:rh-nb-v5k-3YVKz@cluster0.vlwcxhx.mongodb.net/?retryWrites=true&w=majority";
const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect("mongodb://0.0.0.0/Chatapp")
  .then(() => console.log("✅ Connected database from mongodb."))
  .catch((error) =>
    console.error(`❌ Connect database is failed with error which is ${error}`)
  );

//mongoose.connect(URL)

io.on("connection", (socket) => {
  console.log(`user connected :${socket.id} `);
  socket.on("on-chat", (data) => {
    console.log({ data });
  });
});

server.listen(5000, () => {
  console.log("is running on port 5000");
});

app.use("/", router);
