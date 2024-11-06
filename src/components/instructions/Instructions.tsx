import React from "react";
import { useTimer } from "@/hooks/useTimer";
import { LoadingSquares } from "@/animations/LoadingSquares";

interface Props {
  autoclose?: boolean;
  countdown?: number;
}

export const Instructions = ({ autoclose, countdown = 10 }: Props) => {
  const timer = useTimer(countdown, false);
  return (
    <div id="instructions">
      <div>
        You will be assigned either synonyms or antonyms. Selecting the wrong
        type gives a point to the other player. The inviter goes first. When a
        player matches a correct pair, they choose the next tile; if not, the
        turn passes. A single distractor tile is included—once only the
        distractor remains, the game ends, and the player with the most correct
        pairs wins.
      </div>
      {autoclose && (
        <div className="flex justify-end items-center">
          {timer}
          <LoadingSquares styles="w-16 h-16" speed={1.5} />
        </div>
      )}
    </div>
  );
};
