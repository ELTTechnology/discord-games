import { formatTimer, useTimer } from "@/hooks/useTimer";
import { LoadingSquares } from "@/animations/LoadingSquares";

interface Props {
  gameCode: string;
}

const waitingForOTherPlayerDuration = 60;

export const WaitingForOtherPlayer = ({ gameCode }: Props) => {
  const timer = useTimer(waitingForOTherPlayerDuration, false);

  return (
    <div className="border-2 border-amber-500 shadow shadow-amber-400 rounded-xl p-6 w-[430px] h-[150px] font-semibold text-xl text-white mt-3">
      <div className="flex flex-row items-center">
        <div className="w-[80px]">
          <LoadingSquares styles="w-24" speed={2.5} />
        </div>
        <div>
          <p>Waiting for other player to join ...</p>
          <p>
            <span>Game code: </span>
            <span className="text-amber-500">{gameCode}</span>
          </p>
        </div>
      </div>
      <p className="flex items-center justify-center">{formatTimer(timer)}</p>
    </div>
  );
};
