import { Server as IOServer } from "socket.io";

let io: IOServer;

export function initSocket(server: IOServer) {
  io = server;
  return io;
}

export function getIO(): IOServer {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
