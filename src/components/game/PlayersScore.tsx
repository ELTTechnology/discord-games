import Image from 'next/image';
import smiley from '../../assets/smiley.png';
import { User } from './types';

interface Props {
  userDetails: User;
  opponentDetails: User;
  playerNumber: number;
  synonyms: number;
  antonyms: number;
}

export const PlayersScore = ({
  userDetails,
  opponentDetails,
  playerNumber,
  synonyms,
  antonyms
} : Props) => {

  const playerDetails = playerNumber === 1 ? [userDetails, opponentDetails] : [opponentDetails, userDetails];
  return (
    <div className="flex flex-col max-h-[230px] min-w-[230px] border border-amber-500 bg-zinc-100 rounded-lg ml-6">
      <div className="flex items-center justify-center font-bold bg-amber-500 rounded-t-lg p-2">
        PLAYERS
      </div>
      <div className="flex flex-col py-4 px-3 gap-5">
        {
          playerDetails.map((player, index) => (
            <div className={`flex flex-row items-center border-2 ${playerNumber === index + 1 ? 'border-indigo-500' : 'border-slate-300'} p-2 rounded-lg`}>
              {player.avatar ? (
                <img className="rounded-full w-10" alt="avatar" src={player.avatar} />
              ) : (
                <Image className="rounded-full" alt="avatar" src={smiley} width={40} height={40} />
              )}
              <div className="flex flex-col items-start ml-3">
                <span className="font-semibold text-black text-base">{player.name ? player.name : `Player ${index + 1}`}</span>
                <p className={`font-bold ${playerNumber === index + 1 ? 'text-indigo-500' : 'text-slate-500'}`}>{player.isSynonym ? synonyms : antonyms} pts</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}