import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { TILE, COLS, ROWS } from './roomMap'
import { buildSprites, drawRoom, drawNight } from './art'
import './RoomPreview.css'

const SPEED = 32 // px per second — a slow stroll for the title screen
// Sion strolls around the rug: tile corners of a loop, in walking order
const LOOP = [[5, 5], [10, 5], [10, 9], [5, 9]]

// Position and facing along the loop at time `seconds`
function strollAt(seconds) {
  const legs = LOOP.map((from, i) => {
    const to = LOOP[(i + 1) % LOOP.length]
    return { from, to, length: (Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1])) * TILE }
  })
  const total = legs.reduce((sum, leg) => sum + leg.length, 0)
  let dist = (seconds * SPEED) % total
  for (const { from, to, length } of legs) {
    if (dist <= length) {
      const f = dist / length
      const dx = Math.sign(to[0] - from[0])
      const dy = Math.sign(to[1] - from[1])
      return {
        x: (from[0] + (to[0] - from[0]) * f) * TILE,
        y: (from[1] + (to[1] - from[1]) * f) * TILE - 2,
        facing: dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up',
      }
    }
    dist -= length
  }
  return { x: LOOP[0][0] * TILE, y: LOOP[0][1] * TILE - 2, facing: 'down' }
}

function RoomPreview() {
  const canvasRef = useRef(null)
  const nightRef = useRef(false)
  const { t } = useLanguage()
  const { theme } = useTheme()

  useEffect(() => {
    nightRef.current = theme === 'dark'
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const sprites = buildSprites()
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let raf = null

    const draw = (now) => {
      const seconds = reduceMotion ? 0 : now / 1000
      const sion = strollAt(seconds)
      const frame = reduceMotion ? 0 : Math.floor(seconds * 6) % 4
      drawRoom(ctx, { night: nightRef.current, t: now })
      ctx.drawImage(sprites[sion.facing][frame], Math.round(sion.x), Math.round(sion.y))
      if (nightRef.current) drawNight(ctx)
    }
    const loop = (now) => {
      draw(now)
      raf = requestAnimationFrame(loop)
    }

    draw(performance.now())
    if (reduceMotion) return

    // Only animate while the preview is on screen
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && raf === null) raf = requestAnimationFrame(loop)
      if (!entry.isIntersecting && raf !== null) {
        cancelAnimationFrame(raf)
        raf = null
      }
    })
    observer.observe(canvas)
    return () => {
      observer.disconnect()
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <Link to="/room" className="room-preview" aria-label={t.room.enter}>
      <canvas ref={canvasRef} className="room-preview-canvas" width={COLS * TILE} height={ROWS * TILE} />
      <span className="room-preview-overlay" aria-hidden="true">
        <span className="room-preview-press">{t.roomPreview.press} ▶</span>
      </span>
    </Link>
  )
}

export default RoomPreview
