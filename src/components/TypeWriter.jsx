import { useState, useEffect, useMemo } from 'react'

// 이모지인지 확인하는 함수
const isEmoji = (char) => {
  const emojiRegex = /\p{Emoji}/u
  return emojiRegex.test(char) && !/\d/.test(char)
}

function TypeWriter({ text, speed = 100, delay = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [started, setStarted] = useState(false)

  // 이모지를 포함한 유니코드 문자를 제대로 분리
  const characters = useMemo(() => [...text], [text])

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true)
    }, delay)

    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return

    if (currentIndex < characters.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, characters.length, speed, started])

  const displayChars = characters.slice(0, currentIndex)

  return (
    <span className="typewriter">
      {displayChars.map((char, index) => (
        isEmoji(char) ? (
          <span key={index} className="emoji">{char}</span>
        ) : (
          <span key={index}>{char}</span>
        )
      ))}
      <span className="cursor">|</span>
    </span>
  )
}

export default TypeWriter
