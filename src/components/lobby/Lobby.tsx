"use client";
import { useEffect, useState } from "react";
import Image from 'next/image';
import useGameSocket from "@/hooks/useGameSocket";
import { Game } from "../game/Game";
import { data } from "../game/data";
import { nanoid } from "nanoid";
import { WaitingForOtherPlayer } from "./WaitingForOtherPlayer";
import { LoadingOverlay } from "../loadingOverlay/LoadingOverlay";
import wordRiotLogo from '../../assets/word_riot_logo.png';

// Toggle this for Discord integration
import { useDiscord } from "@/hooks/useDiscord";
import { sleep } from "@/utils/sleep";

export const Lobby = () => {
  const [inputCode, setInputCode] = useState("");
  // Generate specific session/user ID
  const [sessionId] = useState(nanoid(9));
  // Toggle this for Discord integration
  const { username, channelName, userAvatar, exitDiscordActivity } =
    useDiscord();

  const {
    createGame,
    joinGame,
    sendAction,
    leaveGame,
    sendOpponentDetails,
    gameCode,
    availableGameCode,
    isGameStarted,
    isSearchingGame,
    opponentAction,
    playerNumber,
    isSynonym,
    error,
    opponentDetails,
  } = useGameSocket(sessionId, username, userAvatar);

  useEffect(() => {
    if (isGameStarted && username && userAvatar) {
      sendOpponentDetails(username, userAvatar);
    }
  }, [username, userAvatar, isGameStarted]);

  useEffect(() => {
    // If we want to auto join the player
    // availableGameCode && joinGame(availableGameCode);
    availableGameCode && setInputCode(availableGameCode);
  }, [availableGameCode]);

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
          <div className="my-2 text-white">
            Activity Channel: {channelName ?? "-"}
          </div>
          <div className="my-2 text-white">Hi, {username}</div>
          <div className="flex justify-center w-full">
            <Image className="rounded" src={wordRiotLogo} alt="Word Riot Logo" width={320} />
          </div>
          <button
            onClick={handleCreateGame}
            className="bg-green-500 w-full text-white py-2 px-4 rounded"
          >
            Create Game
          </button>

          <div className="text-white">or</div>
          {availableGameCode && (
            <div className="flex space-x-2">
              <span className="text-emerald-500">Available game found! </span>
              <span className="text-white">{availableGameCode}</span>
            </div>
          )}

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
            userDetails={{
              name: username ?? "",
              avatar: userAvatar ?? "",
              isSynonym,
            }}
            opponentDetails={opponentDetails}
          />
        </>
      )}
    </div>
  );
};
