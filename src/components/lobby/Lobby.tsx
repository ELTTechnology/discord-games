"use client";
import { useState } from "react";
import useGameSocket from "@/hooks/useGameSocket";
import { Game } from "../game/Game";
import { data } from "../game/data";
import { nanoid } from "nanoid";

// Toggle this for Discord integration
// import { useDiscord } from "@/hooks/useDiscord";
// import { sleep } from "@/utils/sleep";

export const Lobby = () => {
  const [inputCode, setInputCode] = useState("");
  const {
    createGame,
    joinGame,
    sendAction,
    leaveGame,
    gameCode,
    isGameStarted,
    opponentAction,
    playerNumber,
    isSynonym,
    error,
  } = useGameSocket();

  // Toggle this for Discord integration
  // const { username, channelName, exitDiscordActivity } = useDiscord();

  const handleCreateGame = () => {
    // const code = Math.random().toString(36).substr(2, 5).toUpperCase();
    const code = nanoid(5).toUpperCase();
    createGame(code);
  };

  const endGame = async () => {
    // Disconnect game session
    leaveGame();
    // Toggle this for Discord integration
    // Leave Discord Activity
    // await sleep(320);
    // exitDiscordActivity();
  }

  const handleJoinGame = () => {
    joinGame(inputCode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      Version 0.0.3
      {!gameCode && !isGameStarted && (
        <div className="flex flex-col items-center space-y-4">
          {/* Toggle this for Discord integration */}
          {/* <div className="my-2 text-white">Activity Channel: {channelName}</div>
          <div className="my-2 text-white">User: {username}</div> */}
          <button
            onClick={handleCreateGame}
            className="bg-green-500 w-full text-white py-2 px-4 rounded"
          >
            Create Game
          </button>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter game code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="border rounded p-2"
            />
            <button
              onClick={handleJoinGame}
              className="bg-indigo-500 text-white py-2 px-4 rounded"
            >
              Join Game
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </div>
      )}
      {gameCode && !isGameStarted && (
        <p className="text-xl font-semibold text-white">
          Waiting for the second player... Game Code:{" "}
          <span className="text-amber-500">{gameCode}</span>
        </p>
      )}
      {isGameStarted && (
        <>
          <Game
            key={gameCode}
            data={[...data].slice(0, 5)}
            sendAction={sendAction}
            endGame={endGame}
            opponentAction={opponentAction}
            playerNumber={playerNumber}
            isSynonym={isSynonym}
          />
        </>
      )}
    </div>
  );
};
