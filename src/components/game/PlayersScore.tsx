import Image from 'next/image';
import smiley from '../../assets/smiley.png';
import { User } from './types';

interface Props {
  userDetails: User;
  userScore: number;
  opponentDetails: User;
  opponentScore: number;
}

export const PlayersScore = ({
  userDetails,
  userScore,
  opponentDetails,
  opponentScore,
} : Props) => {
  return (
    <div className="flex flex-col max-h-[230px] min-w-[230px] bg-slate-300 rounded-lg ml-6">
      <div className="flex items-center justify-center font-bold bg-amber-500 rounded-t-lg p-2">
        PLAYERS
      </div>
      <div className="flex flex-col py-4 px-3 gap-5">
        <div className="flex flex-row items-center border-2 border-indigo-500 p-2 rounded-lg">
          {userDetails.avatar ? (
            <Image className="rounded-full w-10" alt="avatar" src={userDetails.avatar} />
          ) : (
            <Image className="rounded-full w-10" src={smiley} alt="avatar" />
          )}
          <div className="flex flex-col items-start ml-3">
            <span className="font-semibold text-black text-base">{userDetails.name ?? 'Player 1/2'}</span>
            <p className="text-amber-600 font-bold">{userScore} pts</p>
          </div>
        </div>
        <div className="flex flex-row border-2 border-indigo-500 p-2 rounded-lg">
          {opponentDetails.avatar ? (
            <Image className="rounded-full w-10" alt="avatar" src={opponentDetails.avatar} />
          ) : (
            <Image className="rounded-full w-10" src={smiley} alt="avatar" />
          )}
          <div className="flex flex-col items-start ml-3">
            <span className="font-semibold text-black text-base">{opponentDetails.name ?? 'Player 2/2'}</span>
            <p className="text-amber-600 font-bold">{opponentScore} pts</p>
          </div>
        </div>
      </div>
    </div>
  );
}