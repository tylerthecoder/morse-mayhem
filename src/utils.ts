import { useEffect, useState } from "react";


export function randomEleFromArray<T>(array: T[]): T {
  const index = Math.floor(array.length * Math.random());
  return array[index];
}


export function useFrameTime() {
  const [frameTime, setFrameTime] = useState(performance.now());
  useEffect(() => {
    let frameId: number;
    const frame = (time: number) => {
      setFrameTime(time);
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);
  return frameTime;
};