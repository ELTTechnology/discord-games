import { TileData } from "@/components/game/types";
import { sleep } from "@/utils/sleep";
import { random } from "lodash";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

const useGameSocket = (sessionId: string, userName: string | null, userAvatar: string | null) => {
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isSearchingGame, setIsSearchingGame] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opponentAction, setOpponentAction] = useState<TileData | null>(null);
  const [playerNumber, setPlayerNumber] = useState<1 | 2>();
  const [isSynonym, setIsSynonym] = useState(false);
  const [opponentName, setOpponentName] = useState<string | null>(null);
  const [opponentAvatar, setOpponentAvatar] = useState<string | null>(null);
  const [availableGameCode, setAvailableGameCode] = useState("");

  useEffect(() => {
    if (!socket) {
      // replace the URL w/ the deployed Web Sockets server
      // or use envi variable and make the URL dynamic
      // socket = io(`${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}`, {
      // path: "/socket",
      // socket = io(`${url}`, {
      socket = io({
        path: "/api/socket",
        // transports: ['polling', 'websocket'],
      });
    }

    socket.on("connect", () => {
      console.log(
        " [useGameSocket] 🔌 Connected to server: ",
        socket,
        " with session ID 🧑🏽‍💻 : ",
        sessionId
      );
    });

    socket.on("gameCreated", (code: string) => {
      console.log(" [useGameSocket] 🎮 Game created with code: ", code);
      setPlayerNumber(1);
      setGameCode(code);
    });

    socket.on("gameJoined", (code: string, isSynonymRandomized: boolean) => {
      console.log(" [useGameSocket] 🎮 Game joined with code: ", code);
      setPlayerNumber(2);
      setIsSynonym(isSynonymRandomized);
      setGameCode(code);
    });

    socket.on("startGame", () => {
      console.log(" [useGameSocket] 🎮 Game started ✅ ",);
      setIsGameStarted(true);
      sendOpponentDetails(userName, userAvatar);
    });

    socket.on("opponentAction", (data: TileData, player) => {
      console.log(" [useGameSocket] 🎮 Opponent action ♟️ ",);
      if (player === playerNumber) return;
      setOpponentAction(data);
    });

    socket.on("opponentDetailsReceived", (name: string, avatar: string, player) => {
      if (player === playerNumber) return;
      setOpponentName(name);
      setOpponentAvatar(avatar);
    });
    socket.on("availableGameFound", async (gameCode: string) => {
      console.log(" [useGameSocket] 🎮 Game found ✅ ");
      setAvailableGameCode(gameCode);
    })

    socket.on("noGameFound", async () => {
      console.log(" [useGameSocket] ❌ No game found ❌ ");
      await sleep(1920)
      setIsSearchingGame(false);
    });

    socket.on("error", (msg: string) => {
      console.log(" [useGameSocket] ❌ Error ❌ ");
      setError(msg);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const createGame = (code: string) => {
    if (socket) {
      setPlayerNumber(1);
      const isSynonymRandomized = random(0, 1) === 1;
      setIsSynonym(isSynonymRandomized);
      socket.emit("createGame", code, isSynonymRandomized);
    }
  };

  const joinGame = (code: string) => {
    if (socket) {
      setPlayerNumber(2);
      socket.emit("joinGame", code);
    }
  };

  const sendAction = (data: TileData) => {
    if (socket) {
      socket.emit("opponentAction", gameCode, data, playerNumber);
    }
  };

  const sendOpponentDetails = (name: string | null, avatar: string | null) => {
    if (socket) {
      socket.emit("sendOpponentDetails", gameCode, name, avatar, playerNumber);
    }
  };

  const leaveGame = () => {
    if (socket) {
      setGameCode(null);
      setIsGameStarted(false);
      socket.emit("leave", gameCode);
      socket.disconnect();
    }
  };

  const disconnect = () => {
    if (socket) {
      setGameCode(null);
      setIsGameStarted(false);
      socket.disconnect();
    }
  };

  return {
    gameCode,
    availableGameCode,
    createGame,
    joinGame,
    sendAction,
    disconnect,
    leaveGame,
    sendOpponentDetails,
    isGameStarted,
    isSearchingGame,
    opponentAction,
    playerNumber,
    isSynonym,
    error,
    opponentName,
    opponentAvatar,
  };
};

export default useGameSocket;
