import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { Server as ExpressServer } from "express";

let io: SocketIOServer | null = null;

interface DecodedToken {
  id: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export const initSocket = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // Adjust as necessary for production
      methods: ["GET", "POST"],
    },
  });

  // Authentication Middleware for Socket.IO
  io.use((socket: Socket, next) => {
    let token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

    if (!token) {
      return next(new Error("Authentication error: Token is required"));
    }

    // Clean up bearer token format
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trim();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_corewatch_key_2026") as DecodedToken;
      socket.data.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`Client connected: Socket ID ${socket.id} | User ID: ${userId}`);

    // Join a secure private room dedicated to this User ID
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room: ${userId}`);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: Socket ID ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.IO not initialized. Call initSocket first!");
  }
  return io;
};

/**
 * Safely sends a real-time event only to the logged-in customer's sockets.
 * 
 * @param userId - Target customer's database ID
 * @param eventName - Socket event key
 * @param payload - Payload object to send
 */
export const emitToUser = (userId: string, eventName: string, payload: any): void => {
  if (!io) {
    console.error("Cannot emit event: Socket.IO is not initialized.");
    return;
  }
  
  // Emitting strictly to the room matching the user's ID
  io.to(userId).emit(eventName, payload);
  console.log(`Dispatched real-time event '${eventName}' to room: ${userId}`);
};
