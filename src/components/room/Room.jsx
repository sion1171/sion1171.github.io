import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { roomMeta } from '../../data/routes'
import { TILE, COLS, ROWS, START, ENTRANCE, OBJECTS, objectAtTile, objectInZone, findPath, isWalkable } from './roomMap'
import { buildSprites, drawRoom, drawNight, drawBubble, drawHighlight } from './art'
import { getStored, setStored } from '../../utils/storage'
import RoomDialog from './RoomDialog'
import RoomGuide from './RoomGuide'
import './Room.css'

const SPEED = 64 // px per second
const KEY_DIRS = {
  ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
  ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
  ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
  ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
}
const ACTION_KEYS = new Set(['e', 'E', ' ', 'Enter'])
const DIALOG_IDS = new Set(['projects', 'blog', 'education', 'contact'])

// Intro cutscene: one speech bubble per step; `focus` highlights an object and turns Sion toward it
const TOURS = {
  first: [
    { line: 'hello' },
    { line: 'welcome' },
    { line: 'desk', focus: 'projects' },
    { line: 'blog', focus: 'blog' },
    { line: 'education', focus: 'education' },
    { line: 'contact', focus: 'contact' },
    { line: 'window', focus: 'window' },
    { line: 'ready' },
  ],
  returning: [{ line: 'welcomeBack' }],
}

// The sprite's feet (bottom-centre 8×5 box) are what collide with the room
const footTile = (p) => [Math.floor((p.x + 8) / TILE), Math.floor((p.y + 13) / TILE)]
const blocked = (x, y) =>
  [[x + 4, y + 11], [x + 11, y + 11], [x + 4, y + 15], [x + 11, y + 15]]
    .some(([px, py]) => !isWalkable(Math.floor(px / TILE), Math.floor(py / TILE)))

function createPlayer({ col, row }, facing) {
  return {
    x: col * TILE,
    y: row * TILE - 2,
    facing,
    moving: false,
    animTime: 0,
    path: null,
    pending: null, // object to use once the path ends
    onArrive: null, // callback once a path without an object ends
  }
}

function step(p, keys, dt) {
  let dx = 0
  let dy = 0
  for (const key of keys) {
    dx += KEY_DIRS[key][0]
    dy += KEY_DIRS[key][1]
  }
  dx = Math.sign(dx)
  dy = Math.sign(dy)

  let arrived = false
  if (dx || dy) {
    const dist = SPEED * dt * (dx && dy ? Math.SQRT1_2 : 1)
    if (dx && !blocked(p.x + dx * dist, p.y)) p.x += dx * dist
    if (dy && !blocked(p.x, p.y + dy * dist)) p.y += dy * dist
    p.facing = dx ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')
    p.moving = true
  } else if (p.path) {
    const [col, row] = p.path[0]
    const tx = col * TILE
    const ty = row * TILE - 2
    const max = SPEED * dt
    if (Math.abs(tx - p.x) > 0.5) {
      p.x += Math.max(-max, Math.min(max, tx - p.x))
      p.facing = tx > p.x ? 'right' : 'left'
    } else if (Math.abs(ty - p.y) > 0.5) {
      p.y += Math.max(-max, Math.min(max, ty - p.y))
      p.facing = ty > p.y ? 'down' : 'up'
    } else {
      p.x = tx
      p.y = ty
      p.path.shift()
      if (!p.path.length) {
        p.path = null
        arrived = true
      }
    }
    p.moving = !!p.path
  } else {
    p.moving = false
  }

  p.animTime = p.moving ? p.animTime + dt : 0
  return arrived
}

// Turn to face the object you're using, so it reads as "looking at it"
function face(p, obj) {
  const [col, row] = footTile(p)
  const { box } = obj
  if (row >= box.row + box.h) p.facing = 'up'
  else if (row < box.row) p.facing = 'down'
  else p.facing = col < box.col ? 'right' : 'left'
}

// Keep the speech bubble (HTML, for crisp text) pinned above the sprite and inside the stage
function placeSpeech(el, canvas, player) {
  if (!el || !canvas) return
  const scale = canvas.clientWidth / (COLS * TILE)
  const headX = canvas.clientLeft + (player.x + 8) * scale
  const headY = canvas.clientTop + (player.y + 1) * scale
  const half = el.offsetWidth / 2
  const stageWidth = el.parentElement.clientWidth
  const left = Math.min(Math.max(headX, half + 4), stageWidth - half - 4)
  el.style.left = `${left}px`
  el.style.top = `${headY}px`
  el.style.setProperty('--tail-x', `${headX - left + half}px`)
  el.style.visibility = 'visible'
}

function loadVisited() {
  try {
    const ids = JSON.parse(getStored('roomVisited') || '[]')
    return new Set(Array.isArray(ids) ? ids.filter(id => OBJECTS[id]) : [])
  } catch {
    return new Set()
  }
}

function Room() {
  const canvasRef = useRef(null)
  const playerRef = useRef(null)
  const bubbleRef = useRef(null)
  // Latest handlers/state for the game loop, which is set up once
  const actRef = useRef(null)
  const advanceRef = useRef(null)
  const skipRef = useRef(null)
  const arriveRef = useRef(null)
  const nightRef = useRef(false)
  const dialogOpenRef = useRef(false)
  const cutsceneRef = useRef(null)
  const nearbyRef = useRef(null)
  const highlightRef = useRef(null)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [nearby, setNearby] = useState(null)
  const [dialog, setDialog] = useState(null)
  const [highlight, setHighlight] = useState(null)
  const [visited, setVisited] = useState(loadVisited)
  // phase 'walking': Sion enters through the door · 'talking': bubbles, click to advance
  const [cutscene, setCutscene] = useState(() => ({
    tour: getStored('roomIntroSeen') ? 'returning' : 'first',
    index: 0,
    phase: 'walking',
  }))
  const [reaction, setReaction] = useState(null) // one-off line after using the plant/window
  const [showStart, setShowStart] = useState(false)
  useDocumentMeta(roomMeta(t))

  const tourStep = cutscene ? TOURS[cutscene.tour][cutscene.index] : null
  const talking = cutscene?.phase === 'talking'
  const focus = talking ? tourStep.focus ?? null : null

  useEffect(() => {
    nightRef.current = theme === 'dark'
    dialogOpenRef.current = dialog !== null
    cutsceneRef.current = cutscene
    highlightRef.current = focus ?? highlight
  }, [theme, dialog, cutscene, focus, highlight])

  useEffect(() => {
    setStored('roomVisited', JSON.stringify([...visited]))
  }, [visited])

  // During the tour Sion looks at whatever is being introduced, otherwise at the visitor
  useEffect(() => {
    const player = playerRef.current
    if (!talking || !player) return
    if (focus) face(player, OBJECTS[focus])
    else player.facing = 'down'
  }, [talking, focus])

  useEffect(() => {
    if (!reaction) return
    const timer = setTimeout(() => setReaction(null), 2500)
    return () => clearTimeout(timer)
  }, [reaction])

  useEffect(() => {
    if (!showStart) return
    const timer = setTimeout(() => setShowStart(false), 1200)
    return () => clearTimeout(timer)
  }, [showStart])

  useEffect(() => {
    const finish = () => {
      setStored('roomIntroSeen', '1')
      setCutscene(null)
      setShowStart(true)
    }
    // Jump Sion to the rug if the visitor doesn't want to wait for the walk-in
    const skipWalk = () => {
      const player = playerRef.current
      player.path = null
      player.onArrive = null
      player.x = START.col * TILE
      player.y = START.row * TILE - 2
      player.facing = START.facing
    }
    arriveRef.current = () => setCutscene(c => (c ? { ...c, phase: 'talking' } : c))
    advanceRef.current = () => {
      if (!cutscene) return
      if (cutscene.phase === 'walking') {
        skipWalk()
        setCutscene({ ...cutscene, phase: 'talking' })
      } else if (cutscene.index < TOURS[cutscene.tour].length - 1) {
        setCutscene({ ...cutscene, index: cutscene.index + 1 })
      } else {
        finish()
      }
    }
    skipRef.current = () => {
      if (!cutscene) return
      if (cutscene.phase === 'walking') skipWalk()
      finish()
    }
  }, [cutscene])

  useEffect(() => {
    actRef.current = (obj) => {
      face(playerRef.current, obj)
      setVisited(prev => (prev.has(obj.id) ? prev : new Set(prev).add(obj.id)))
      if (DIALOG_IDS.has(obj.id)) setDialog(obj.id)
      else if (obj.id === 'exit') navigate('/')
      else if (obj.id === 'plant') setReaction('plantSays')
      else if (obj.id === 'window') {
        setReaction(theme === 'dark' ? 'daySays' : 'nightSays')
        toggleTheme()
      }
    }
  }, [navigate, theme, toggleTheme])

  // Game loop + keyboard
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    const sprites = buildSprites()
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const player = reduceMotion ? createPlayer(START, START.facing) : createPlayer(ENTRANCE, 'up')
    playerRef.current = player
    if (reduceMotion) {
      arriveRef.current()
    } else {
      player.path = findPath([ENTRANCE.col, ENTRANCE.row], (c, r) => c === START.col && r === START.row)
      player.onArrive = () => {
        player.facing = START.facing
        arriveRef.current()
      }
    }
    const keys = new Set()
    let last = performance.now()
    let raf

    const onKeyDown = (e) => {
      if (dialogOpenRef.current) return
      if (cutsceneRef.current) {
        if (e.key === 'Escape') skipRef.current()
        else if (ACTION_KEYS.has(e.key)) advanceRef.current()
        else return
        e.preventDefault()
        return
      }
      if (KEY_DIRS[e.key]) {
        keys.add(e.key)
        player.path = null
        player.pending = null
        e.preventDefault()
      } else if (ACTION_KEYS.has(e.key)) {
        const obj = objectInZone(...footTile(player))
        if (obj) {
          e.preventDefault()
          actRef.current(obj)
        }
      }
    }
    const onKeyUp = (e) => keys.delete(e.key)
    const onBlur = () => keys.clear()

    const loop = (now) => {
      // Sub-step long frames so slow devices keep normal walking speed without skipping collisions
      let remaining = Math.min(0.25, (now - last) / 1000)
      last = now
      while (remaining > 0 && !dialogOpenRef.current) {
        const dt = Math.min(0.05, remaining)
        remaining -= dt
        if (!step(player, keys, dt)) continue
        if (player.pending) {
          actRef.current(player.pending)
          player.pending = null
        } else if (player.onArrive) {
          const onArrive = player.onArrive
          player.onArrive = null
          onArrive()
        }
      }

      const near = cutsceneRef.current ? null : objectInZone(...footTile(player))
      if ((near?.id ?? null) !== nearbyRef.current) {
        nearbyRef.current = near?.id ?? null
        setNearby(nearbyRef.current)
      }

      drawRoom(ctx, { night: nightRef.current, t: now })
      const frame = player.moving ? Math.floor(player.animTime * 8) % 4 : 0
      ctx.drawImage(sprites[player.facing][frame], Math.round(player.x), Math.round(player.y))
      if (nightRef.current) drawNight(ctx)
      if (highlightRef.current) drawHighlight(ctx, OBJECTS[highlightRef.current], now)
      else if (near && !dialogOpenRef.current) drawBubble(ctx, near, now)
      placeSpeech(bubbleRef.current, canvasRef.current, player)

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  // Walk up to an object and use it (or use it right away if already next to it)
  const walkTo = (target) => {
    const player = playerRef.current
    const from = footTile(player)
    if (target.zone.has(from.join(','))) {
      player.path = null
      actRef.current(target)
      return
    }
    player.path = findPath(from, (c, r) => target.zone.has(`${c},${r}`))
    player.pending = player.path ? target : null
  }

  // Tap/click: during the intro it advances the dialogue; otherwise walk to a tile or object
  const onPointerDown = (e) => {
    if (dialog) return
    if (cutscene) {
      advanceRef.current()
      return
    }
    const bounds = e.currentTarget.getBoundingClientRect()
    const col = Math.floor(((e.clientX - bounds.left) / bounds.width) * COLS)
    const row = Math.floor(((e.clientY - bounds.top) / bounds.height) * ROWS)
    const target = objectAtTile(col, row)

    if (target) {
      walkTo(target)
    } else if (isWalkable(col, row)) {
      const player = playerRef.current
      player.path = findPath(footTile(player), (c, r) => c === col && r === row)
      player.pending = null
    }
  }

  const actOnNearby = () => {
    if (nearby) actRef.current(OBJECTS[nearby])
  }

  const bubbleText = talking ? t.room.tour[tourStep.line] : reaction && t.room[reaction]

  return (
    <div className="room-page">
      <header className="room-header">
        <Link to="/" className="room-back">← {t.room.back}</Link>
        <h1 className="room-title">{t.room.title}</h1>
      </header>

      <div className="room-layout">
        <div className="room-main">
          <div className={`room-stage ${cutscene ? 'is-cutscene' : ''}`}>
            <canvas
              ref={canvasRef}
              className="room-canvas"
              width={COLS * TILE}
              height={ROWS * TILE}
              onPointerDown={onPointerDown}
              aria-label={t.room.title}
            />
            {bubbleText && !dialog && (
              <div
                ref={bubbleRef}
                className={`room-speech ${talking ? 'is-sticky' : ''}`}
                role="status"
                onClick={() => advanceRef.current()}
              >
                <span key={bubbleText} className="room-speech-text">{bubbleText}</span>
                {talking && <span className="room-speech-next" aria-hidden="true">▼</span>}
              </div>
            )}
            {showStart && <div className="room-start" aria-hidden="true">{t.room.start}</div>}
            {dialog && <RoomDialog id={dialog} onClose={() => setDialog(null)} />}
          </div>

          <div className="room-hud">
            {cutscene ? (
              <div className="room-cutscene-hud">
                {talking ? (
                  <span className="room-hint">
                    <span className="room-hint-keys">{t.room.continueHint}</span>
                    <span className="room-hint-touch">{t.room.continueHintTouch}</span>
                  </span>
                ) : (
                  <span className="room-hint">…</span>
                )}
                <button className="room-skip" onClick={() => skipRef.current()}>
                  {t.room.skip} <span className="room-key room-hint-keys">Esc</span>
                </button>
              </div>
            ) : nearby ? (
              <button className="room-action" onClick={actOnNearby}>
                <span className="room-key">E</span>
                {t.room.objects[nearby]}
              </button>
            ) : (
              <p className="room-hint">
                <span className="room-hint-keys">{t.room.hintKeys}</span>
                <span className="room-hint-touch">{t.room.hintTouch}</span>
              </p>
            )}
          </div>
        </div>

        <RoomGuide
          t={t}
          visited={visited}
          disabled={!!cutscene}
          onHover={setHighlight}
          onSelect={(id) => {
            setHighlight(null)
            walkTo(OBJECTS[id])
          }}
          onReplayIntro={() => setCutscene({ tour: 'first', index: 0, phase: 'talking' })}
        />
      </div>
    </div>
  )
}

export default Room
