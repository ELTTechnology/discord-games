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
  antonyms,
} : Props) => {

  const playerDetails = playerNumber === 1 ? [userDetails, opponentDetails] : [opponentDetails, userDetails];
  return (
    <div className="flex flex-col w-full border border-indigo-500 bg-zinc-100 rounded-lg">
      <div className="flex flex-row justify-between p-2 gap-2">
        {
          playerDetails.map((player, index) => (
            <div className={`flex flex-row items-center w-full border-2 ${playerNumber === index + 1 ? 'border-indigo-500' : 'border-slate-300'} p-2 rounded-lg`}>
              {player.avatar ? (
                <img className="rounded-full w-8" alt="avatar" src={player.avatar} />
              ) : (
                <Image className="rounded-full" alt="avatar" src={smiley} width={32} height={32} />
              )}
              <div className="flex justify-between w-full ml-3">
                <span className="font-semibold text-black text-base">{player.name ? player.name : `Player ${index + 1}`}</span>
                <span className={`font-bold ${playerNumber === index + 1 ? 'text-indigo-500' : 'text-slate-500'}`}>{player.isSynonym ? synonyms : antonyms} pts</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}