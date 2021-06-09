import { useState } from "react"
import Morse from "./morse";
import morseData from "./morse.json";
import { randomEleFromArray } from "./utils";


const letters = Object.keys(morseData);



export default function Game() {
  const [testLetter, setTestLetter] = useState<string>(randomEleFromArray(letters));
  const [messageText, setMessageText] = useState("");
  const [numIncorrect, setNumIncorrect] = useState(0);

  console.log(numIncorrect);

  function handleLetter(letter: string) {
    if (letter === testLetter) {
      console.log("Correct!");
      setMessageText("Correct!");
      setNumIncorrect(0);
      setTestLetter(randomEleFromArray(letters));
    } else {
      console.log("Incorrect!", numIncorrect);
      if (numIncorrect === 2) {
        const correctMorse = morseData[testLetter as "0"];
        setMessageText(`Too many incorrect. Correct morse is ${correctMorse}`);
      } else {
        setNumIncorrect(numIncorrect + 1);
        setMessageText(`Incorrect! You typed ${letter}. ${numIncorrect + 1} attempts`);
      }
    }
  }

  return (
    <div>
      <h1 style={{ textAlign: "center" }}> Type a "{testLetter}" </h1>
      <Morse
        onLetter={handleLetter}
      />
      <h3 style={{ textAlign: "center" }}> {messageText} </h3>
    </div>

  )
}