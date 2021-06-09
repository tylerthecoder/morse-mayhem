import { useEffect, useRef, useState } from "react";
import morseData from "./morse.json";
import { useFrameTime } from "./utils";

const morseToArabic = Object.fromEntries(Object.entries(morseData).map(d => [d[1], d[0]]));

interface IProps {
  onLetter?: (letter: string) => void;
}

enum Digit {
  DIT = ".",
  DAH = "-",
  STOP = " | ",
}


const SPEED = -.25;
const xOffset = (3 / 4) * window.innerWidth;
const yOffset = 50;

const ditLowerThreshold = 30;
const ditUpperThreshold = 300;
const dahLowerThreshold = 300;

const stopThreshold = 1000;

export default function Morse(props: IProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [digits, setDigits] = useState<Digit[]>([]);
  const [wordDigit, setWordDigit] = useState<Digit[]>([]);
  const [letterOver, setLetterOver] = useState(false);
  const frameTime = useFrameTime();
  const [message, setMessage] = useState("");

  const [isDown, setIsDown] = useState(false);

  const keyDown = (e: KeyboardEvent | TouchEvent) => {
    e.preventDefault();
    setIsDown(true);
  }

  const keyUp = (e: KeyboardEvent | TouchEvent) => {
    e.preventDefault();
    setIsDown(false);
  }

  useEffect(() => {
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("touchstart", keyDown);
    window.addEventListener("touchend", keyUp);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keydown", keyUp);
      window.removeEventListener("touchstart", keyDown);
      window.removeEventListener("touchend", keyUp);
    }
  }, []);

  const lastTapTime = tapTimes[tapTimes.length - 1];
  const tapTimeDiff = frameTime - lastTapTime;

  if (tapTimeDiff > stopThreshold && !letterOver && !isDown) {
    const letter = wordDigit.join("");

    setLetterOver(true);

    setWordDigit([]);

    const arabicLetter = morseToArabic[letter];

    if (arabicLetter) {
      setMessage(old => old + arabicLetter);
      props.onLetter?.(arabicLetter);
    } else {
      props.onLetter?.("Nothing");
    }
  }

  useEffect(() => {
    if (tapTimes.length === 0 && !isDown) return;
    setLetterOver(false);
    setTapTimes(old => old.concat(frameTime));

    // compute the type
    if (isDown === false) {
      const length = frameTime - lastTapTime;

      if (length > ditLowerThreshold && length < ditUpperThreshold) {
        setDigits(old => old.concat(Digit.DIT));
        setWordDigit(old => old.concat(Digit.DIT));
      } else if (length > dahLowerThreshold) {
        setDigits(old => old.concat(Digit.DAH));
        setWordDigit(old => old.concat(Digit.DAH));
      }
    }
  }, [isDown]);

  const ctx = canvasRef.current?.getContext("2d");

  if (ctx) {
    // DRAW
    ctx.clearRect(0, 0, window.innerWidth, 700);

    tapTimes.forEach((hit, index, hitTimes) => {
      const isEnd = index % 2 === 1;
      const lastHit = hitTimes[index - 1];

      if (isEnd) {
        const x = xOffset + ((frameTime - hit) * SPEED);
        const y = 50;
        const w = (hit - lastHit) * SPEED;
        const h = 50;
        ctx.fillRect(x, y, w, h)
      }
    });

    if (isDown) {
      const x = xOffset;
      const y = yOffset;
      const w = (frameTime - lastTapTime) * SPEED;
      const h = 50;
      ctx.fillRect(x, y, w, h);
    }
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={100}
      />
      {/* {digits.map(dig => {
        return <span> {dig} </span>
      })} */}
      {/* <h1>
        {message}
      </h1> */}
    </>
  )
}