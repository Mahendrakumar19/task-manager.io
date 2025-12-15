import http from "http";
import app from "./app";
import { Server as IOServer } from "socket.io";
import { initSocket } from "./socket";
import { verifyJwt } from "./utils/jwt";

const port = Number(process.env.PORT || 4000);
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: true, credentials: true },
});

initSocket(io);

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  
  // Authenticate socket connection
  const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split("token=")[1]?.split(";")[0];
  if (token) {
    try {
      const user = verifyJwt(token);
      socket.join(`user:${user.id}`);
      console.log(`User ${user.id} joined their room`);
    } catch (err) {
      console.error("Socket auth failed", err);
    }
  }
  
  socket.on("join", (room) => socket.join(room));
  socket.on("disconnect", () => console.log("socket disconnected", socket.id));
});

server.listen(port, () => console.log(`Server listening on ${port}`));
