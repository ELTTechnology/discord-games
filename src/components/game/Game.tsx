"use client";
import { shuffle } from "lodash";
import { Data, TileData, SelectionResult, User } from "./types";
import { useEffect, useState } from "react";
import { Tile } from "./Tile";
import { AnimatePresence } from "framer-motion";
import { sleep } from "../../utils/sleep";
import "./game.styles.css";
import { Won } from "./Won";
import { Lose } from "./Lose";
import { Modal } from "../modal/Modal";
import { Instructions } from "../instructions/Instructions";
import { PlayersScore } from "./PlayersScore";

interface Props {
  data: Data[];
  sendAction: (data: TileData) => void;
  endGame: () => void;
  opponentAction: TileData | null;
  playerNumber: number | undefined;
  isSynonym: boolean;
  userDetails: User;
  opponentDetails: User;
}

const createCinnamonSquares = (data: Data[]) => {
  const cinnamonSquares = [];
  data.forEach((item) => {
    cinnamonSquares.push(item);
    const synonym: TileData = {
      word: item.synonym ?? "",
      synonym: item.word,
      antonym: item.antonym,
      hidden: false,
    };
    cinnamonSquares.push(synonym);
    const antonym: TileData = {
      word: item.antonym ?? "",
      synonym: item.antonym,
      antonym: item.antonym,
      hidden: false,
    };
    cinnamonSquares.push(antonym);
  });
  cinnamonSquares.push({
    word: "meow",
    synonym: null,
    antonym: null,
    hidden: false,
  });
  return cinnamonSquares;
};

const cols = [0, 4, 8, 12];

export const Game = ({
  data,
  sendAction,
  endGame,
  opponentAction,
  isSynonym,
  playerNumber,
  userDetails,
  opponentDetails,
}: Props) => {
  const [cinnamonSquares, setCinnamonSquares] = useState(
    shuffle(createCinnamonSquares(data))
  );
  const [selectedWords, setSelectedWords] = useState<TileData[]>([]);
  const [result, setResult] = useState<SelectionResult>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [synonymsAnswered, setSynonymsAnswered] = useState(0);
  const [antonymsAnswered, setAntonymsAnswered] = useState(0);
  const [isWinner, setIsWinner] = useState<boolean | null>(null);
  const [tileState, setTileState] = useState<boolean>(playerNumber === 2);
  const [instructionsOpen, setInstructionsOpen] = useState(true);

  useEffect(() => {
    (async () => {
      await sleep(10000);
      setInstructionsOpen(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (antonymsAnswered + synonymsAnswered === 5) {
        console.log(" --------- Game Completed ");
        if (antonymsAnswered < synonymsAnswered) {
          isSynonym ? setIsWinner(true) : setIsWinner(false);
        } else {
          isSynonym ? setIsWinner(false) : setIsWinner(true);
        }
      }
    })();
  }, [synonymsAnswered, antonymsAnswered]);

  useEffect(() => {
    if (opponentAction) onSelect(opponentAction, true);
  }, [opponentAction]);

  const onSelect = (data: TileData, fromOpponent = false) => {
    if (!fromOpponent) sendAction(data);
    if (selectedWords.includes(data)) {
      setSelectedWords([]);
    } else {
      setSelectedWords((prev) => [...prev, data]);
    }
    setTileState(!tileState);
  };

  const evaluate = async () => {
    if (selectedWords[1].word === selectedWords[0].synonym) {
      console.log(" evaluate > synonym ");
      setResult("synonyms");
      setSynonymsAnswered(synonymsAnswered + 1);
      await sleep(560);
      setIsAnimating(true);
      setTileState(!isSynonym);
      hideWord([
        selectedWords[0].word,
        selectedWords[0].synonym ?? "",
        selectedWords[0].antonym ?? "",
        selectedWords[1].word,
        selectedWords[1].synonym ?? "",
        selectedWords[1].antonym ?? "",
      ]);
    } else if (
      selectedWords[1].word === selectedWords[0].antonym ||
      selectedWords[1].antonym === selectedWords[0].word
    ) {
      console.log(" evaluate > antonym ");
      setResult("antonyms");
      setAntonymsAnswered(antonymsAnswered + 1);
      await sleep(560);
      setIsAnimating(true);
      setTileState(isSynonym);
      hideWord([
        selectedWords[0].word,
        selectedWords[0].synonym ?? "",
        selectedWords[0].antonym ?? "",
        selectedWords[1].word,
        selectedWords[1].synonym ?? "",
        selectedWords[1].antonym ?? "",
      ]);
    } else {
      console.log(" evaluate > incorrect ");
      await sleep(120);
      setIsAnimating(true);
      setTileState(!!tileState);
      setResult("error");
    }
    await sleep(960);
    setIsAnimating(false);
    setSelectedWords([]);
    setResult(null);
  };

  useEffect(() => {
    if (selectedWords.length === 2) evaluate();
  }, [selectedWords]);

  const hideWord = (words: string[]) => {
    setCinnamonSquares((prev) => {
      const newCinnamonSquares = [...prev];
      newCinnamonSquares.forEach((cinnamon) => {
        if (words.includes(cinnamon.word)) {
          cinnamon.hidden = true;
        }
      });
      return newCinnamonSquares;
    });
  };

  const onAnimationEnd = async () => {
    console.log(" --------- onAnimationEnd ");
    await sleep(1920);
    endGame();
  };

  const isSelected = (data: TileData) => {
    return selectedWords.some((word) => word.word === data.word);
  };

  if (isWinner === true) {
    return <Won onAnimationEnd={onAnimationEnd} />;
  } else if (isWinner === false) {
    return <Lose onAnimationEnd={onAnimationEnd} />;
  }

  return (
    <div className="min-w-[320px] w-[500px]">
      <Modal title="Instructions" isOpen={instructionsOpen}>
        <div>
          <Instructions autoclose />
        </div>
      </Modal>
      <div className="my-2 text-white">
        Select{" "} <span className="font-bold text-amber-500">{isSynonym ? `synonyms!` : `antonyms!`}</span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-2">
          {cols.map((col) => (
            <div
              key={col}
              className="w-[120px] h-[504px] flex flex-col-reverse gap-2"
            >
              <AnimatePresence
                onExitComplete={() => setIsAnimating(false)}
                presenceAffectsLayout={true}
                mode="popLayout"
              >
                {cinnamonSquares.slice(col, col + 4).map((cinnamon) =>
                  !cinnamon.hidden ? (
                    <Tile
                      key={cinnamon.word}
                      data={cinnamon}
                      selectedWords={selectedWords}
                      onSelect={() => onSelect(cinnamon)}
                      isSelected={() => {
                        return isSelected(cinnamon);
                      }}
                      result={result}
                      isAnimating={isAnimating}
                      animationEnd={() => setIsAnimating(false)}
                      isDisabled={tileState}
                    />
                  ) : null
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <PlayersScore
          userDetails={userDetails}
          opponentDetails={opponentDetails}
          playerNumber={playerNumber ?? 0}
          synonyms={synonymsAnswered}
          antonyms={antonymsAnswered}
        />
      </div>
    </div>
  );
};
