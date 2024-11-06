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
        You will be assigned to select either synonyms or antonyms. Each turn,
        choose only one word. Selecting an incorrect pair awards a point to the
        opponent. The inviter takes the first turn. If you match a correct pair,
        you may select again; otherwise, the turn passes to the opponent. A
        single distractor word is included, which has no match. When only the
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
