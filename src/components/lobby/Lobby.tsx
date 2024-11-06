"use client";
import { useState } from "react";
import useGameSocket from "@/hooks/useGameSocket";
import { Game } from "../game/Game";
import { data } from "../game/data";
import { nanoid } from "nanoid";
import { WaitingForOtherPlayer } from "./WaitingForOtherPlayer";
import { LoadingOverlay } from "../loadingOverlay/LoadingOverlay";

// Toggle this for Discord integration
import { useDiscord } from "@/hooks/useDiscord";
import { sleep } from "@/utils/sleep";

export const Lobby = () => {
  const [inputCode, setInputCode] = useState("");
  // Generate specific session/user ID
  const [sessionId] = useState(nanoid(9));
  const {
    createGame,
    joinGame,
    sendAction,
    leaveGame,
    gameCode,
    isGameStarted,
    isSearchingGame,
    opponentAction,
    playerNumber,
    isSynonym,
    error,
  } = useGameSocket(sessionId);

  // Toggle this for Discord integration
  const { username, channelName, exitDiscordActivity } = useDiscord();

  const handleCreateGame = () => {
    const code = nanoid(5).toUpperCase();
    createGame(code);
  };

  const endGame = async () => {
    // Disconnect game session
    leaveGame();
    // Toggle this for Discord integration
    // Leave Discord Activity
    await sleep(320);
    exitDiscordActivity();
  };

  const handleJoinGame = () => {
    joinGame(inputCode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      <LoadingOverlay
        isOpen={isSearchingGame && !isGameStarted}
        loadingText="Searching for a game ... "
      />
      {!gameCode && !isGameStarted && (
        <div className="flex flex-col items-center space-y-4">
          {/* Toggle this for Discord integration */}
          <div className="my-2 text-white">Activity Channel: {channelName}</div>
          <div className="my-2 text-white">User: {username}</div>
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
        <WaitingForOtherPlayer gameCode={gameCode} />
      )}
      {isGameStarted && (
        <>
          <Game
            key={gameCode}
            // data={(() => {
            //   const randomNumber = random(0, data.length - 5);
            //   return [...data].slice(randomNumber, randomNumber + 5);
            // })()}
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
