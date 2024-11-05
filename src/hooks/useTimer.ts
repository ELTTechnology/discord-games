import { useEffect, useState } from "react";

export const useTimer = (duration: number, isIncrement = true) => {
  const [timer, setTimer] = useState(isIncrement ? 0 : duration);

  useEffect(() => {
    const interval = setInterval(() => {
      const isTimesUp = isIncrement ? timer === duration : timer === 0;

      if (isTimesUp) {
        clearInterval(interval);
        return;
      }
      setTimer((prev) => (isIncrement ? prev + 1 : prev - 1));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [duration, isIncrement, timer]);

  return timer;
};

export const formatTimer = (timer: number) => {
  const minutes = Math.floor((timer % 3600) / 60);
  const seconds = timer % 60;

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};