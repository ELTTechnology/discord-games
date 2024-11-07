import React from "react";
import Image from "next/image";
import wordRiotLogo from "../../assets/word_riot_logo.png";

interface Props {
  exit: () => void;
}

export const Exit = ({ exit }: Props) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-center w-full">
        <Image
          className="rounded"
          src={wordRiotLogo}
          alt="Word Riot Logo"
          width={320}
        />
      </div>
      <div className="my-2 text-white font-bold">Thank you for playing! 🚀</div>
      <button
        onClick={exit}
        className="bg-rose-900 text-white py-2 px-4 rounded"
      >
        Exit Game
      </button>
      <div className="my-2 text-white text-center">
        If the game doesn’t close automatically, you can exit by using Discord’s
        leave button.
      </div>
    </div>
  );
};
