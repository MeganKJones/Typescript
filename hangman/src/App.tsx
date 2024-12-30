import { useState, useEffect, useCallback } from "react"
import words from "./words.json"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"

function App() {

  function getWord() {
    return words[Math.floor(Math.random() * words.length)]
  }

  const [wordToGuess, setwordToGuess] = useState(getWord())

  console.log(wordToGuess)

  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter( letter => !wordToGuess.includes(letter))

  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return

    setGuessedLetters(currentLetters => [...currentLetters, letter])
  }, [guessedLetters]) 

  const isLoser = incorrectLetters.length >= 6
  const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if (!key.match(/^[a-z]$/)) return

      e.preventDefault()
      addGuessedLetter(key)
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if (key !== "Enter") return

      e.preventDefault()
      setGuessedLetters([])
     setwordToGuess(getWord())
    }

    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress", handler)
    }
  }, [guessedLetters])

  return <div style={{
    maxWidth:"880px",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    margin: "0 auto",
    alignItems: "center"

  }}>
<div style={{fontSize: "2rem", textAlign: "center"}}>
  {isWinner && "Winer! - Refresh to try again."}
  {isLoser && "Nice try - Refresh to try again."}
</div>
<HangmanDrawing numberOfGuesses={incorrectLetters.length}></HangmanDrawing>
<HangmanWord reveal={isLoser} guessedLetters={guessedLetters}  wordToGuess={wordToGuess}></HangmanWord>
<div style={{alignSelf: "stretch"}}>
  <Keyboard disabled={isWinner || isLoser} activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))} inactiveLetters={incorrectLetters} addGuessedLetter={addGuessedLetter}></Keyboard>
</div>

  </div>
}

export default App
