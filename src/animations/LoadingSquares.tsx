import animationData from "@/assets/loading_squares-3.json";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import React, { useEffect, useRef } from "react";

interface Props {
  styles?: string;
  speed?: number;
}

export const LoadingSquares = ({ styles, speed = 1}: Props) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    lottieRef && lottieRef.current?.setSpeed(speed);
  }, []);

  return (
    <Lottie
      className={styles}
      animationData={animationData}
      loop={true}
      lottieRef={lottieRef}
    />
  );
};
