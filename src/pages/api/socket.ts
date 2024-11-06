import { Server as IOServer } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as HTTPServer } from "http";
import { Socket } from "net";

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface ExtendedNextApiResponse extends NextApiResponse {
  socket: Socket & { server: SocketServer };
}

const games: any = {};

const gameCodes: string[] = [];

export default function handler(
  req: NextApiRequest,
  res: ExtendedNextApiResponse
) {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server, {
      cors: {
        origin: "*", // Your Next.js app's origin
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      },
      path: "/api/socket", // Set the path explicitly
      // transports: ['polling', 'websocket'],
    });
    res.socket.server.io = io;

    console.log(" 🔌 Socket.io established ✅ ");

    io.on("connection", (socket) => {
      console.log(" 🧑🏽‍💻 New player connected:", socket.id);

      const joinGame = (gameCode: string) => {
        socket.join(gameCode);
        console.log(` 🧑🏽‍💻 ${socket.id} joined game room 🎮 ${gameCode}`);
        socket.emit("gameJoined", gameCode, games[gameCode as string].player2);
        io.to(gameCode).emit("startGame"); // Notify both players to start the game
      };

      const onNoGameFound = () => {
        console.log(" ❌ NO GAME FOUND ❌ ");
        socket.emit("noGameFound");
      };

      const autoJoinAvailableGame = () => {
        console.log(" 🔎 AUTO JOIN AVAILABLE GAME 🔍 ");
        gameCodes.forEach(async (gameCode, index) => {
          const room = io.sockets.adapter.rooms.get(gameCode);
          const sockets = await io.in(gameCode).fetchSockets();
          console.log(" 🧑🏽‍💻 socket.id: ", socket.id);
          console.log(" 🔢 sockets.length: ", sockets.length);
          console.log(
            " 📋 sockets ids: ",
            sockets.map((s) => s.id).join(" / ")
          );
          if (
            room &&
            room.size === 1 &&
            !sockets.find((s) => s.id === socket.id)
          ) {
            console.log(" 🎮 Game room available 🔎: ", gameCode);
            joinGame(gameCode);
          } else {
            if (gameCodes.length === index + 1) {
              onNoGameFound();
            }
          }
        });
      };

      // Check if same user is already in a game room
      if (gameCodes.length > 0) {
        autoJoinAvailableGame();
      } else {
        onNoGameFound();
      }

      socket.on("connect_error", (err) => {
        console.error(" ❌ Connection error:", err);
      });

      // Create a game room
      socket.on("createGame", (gameCode: string, isSynonym: boolean) => {
        socket.join(gameCode);
        games[gameCode as string] = {
          gameCode: gameCode,
          player1: isSynonym,
          player2: !isSynonym,
        };
        console.log(`Game room 🎮 ${gameCode} created by 🧑🏽‍💻 ${socket.id}`);
        gameCodes.push(gameCode);
        // Emit gameCode back to player 1
        socket.emit("gameCreated", gameCode);
        // Notify other players that a game is available
        socket.broadcast.emit("availableGameFound", gameCode);
      });

      // Join an existing game room
      socket.on("joinGame", (gameCode: string) => {
        const room = io.sockets.adapter.rooms.get(gameCode);
        if (room && room.size === 1) {
          joinGame(gameCode);
        } else {
          socket.emit("error", "Game room not available or already full");
        }
      });

      socket.on(
        "opponentAction",
        (gameCode: string, data: any, playerNumber: 1 | 2) => {
          socket.to(gameCode).emit("opponentAction", data, playerNumber);
        }
      );

      socket.on(
        "sendOpponentDetails",
        (gameCode: string, name: string, avatar: string, playerNumber: 1 | 2) => {
          socket.to(gameCode).emit("opponentDetailsReceived", name, avatar, playerNumber);
        }
      );

      socket.on("leave", (gameCode: string) => {
        console.log(" 🧑🏽‍💻 Player left > socket.id:", socket.id);
        // Make sure to leave the game room
        // and close the game room
        io.socketsLeave(gameCode);
      });

      socket.on("disconnect", (gameCode: string) => {
        console.log(" 🧑🏽‍💻 Player disconnected 🔌 :", socket.id);
        // Current player leave the game room
        // socket.leave(gameCode);
        // Make all players leave the game room
        io.socketsLeave(gameCode);
        // Disconnect all sockets
        io.disconnectSockets();
      });
    });
  } else {
    console.log(" 🔌 Socket.io server already running 🏃🏽 ");
  }
  res.end();
}
