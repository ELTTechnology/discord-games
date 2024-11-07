import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "@/assets/your_turn.json";
import React, { useEffect, useRef, useState } from "react";

export const YourTurn = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  // useEffect(() => {
    
  // }, []);

  useEffect(() => {
    setTimeout(() => setIsPlaying(false), 2000);
  }, []);

  return (
    <>
      {isPlaying && (
        <div
          id="your-turn"
          className="fixed inset-0 z-[999]] flex items-center justify-center bg-black bg-opacity-50"
        >
          <Lottie animationData={animationData} lottieRef={lottieRef}  />
        </div>
      )}
    </>
  );
};
