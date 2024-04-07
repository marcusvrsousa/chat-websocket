import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
console.log("runningggg");

//desacoplo o servidor http que está em app
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);
// cors: { origin: "http:localhost:3000/chat" },

// sempre que houver uma conexão/estiver 'on' faça algo
socketServer.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  //Quando não houver conexao
  socket.on("disconnect", (reason) => {
    console.log("Usuario desconectado", socket.id);
  });

  socket.on("usuario_conectado", (usuario) => {
    socket.data.nome = usuario;
    console.log(`Nome do usuario: ${socket.data.nome}`);
  });

  //escuta a mensagem recebida do front
  socket.on("message", (message, usuario) => {
    console.log(`Tentando capturar o nome do usuario: ${usuario}`);
    //emite de volta essa mensagem para o front
    socketServer.emit("mensagem_recebida", {
      message,
      autor: usuario,
    });
  });
});

httpServer.listen(3333);
