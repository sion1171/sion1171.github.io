import { TILE, COLS, ROWS, OBJECTS } from './roomMap'

// ===== Character sprites (16×16, one char per pixel) =====
const PALETTE = {
  k: '#2b2622', // outline
  h: '#3d2b20', // hair
  s: '#f1c8a0', // skin
  e: '#1d1d1d', // eyes
  w: '#4f74b3', // shirt
  p: '#2f3a52', // pants
  b: '#1f1f24', // shoes
}

const HEAD_DOWN = [
  '................',
  '.....kkkkkk.....',
  '....khhhhhhk....',
  '....khhhhhhk....',
  '....khsssshk....',
  '....ksessesk....',
  '....kssssssk....',
  '.....kssssk.....',
]
const HEAD_UP = [
  '................',
  '.....kkkkkk.....',
  '....khhhhhhk....',
  '....khhhhhhk....',
  '....khhhhhhk....',
  '....khhhhhhk....',
  '....khhhhhhk....',
  '.....kssssk.....',
]
const HEAD_SIDE = [
  '................',
  '.....kkkkkk.....',
  '....khhhhhhk....',
  '....khhhhhhk....',
  '....khhssssk....',
  '....khssseskk...',
  '....kssssssk....',
  '.....kssssk.....',
]
const BODY_FRONT = [
  '....kwwwwwwk....',
  '...kswwwwwwsk...',
  '...kswwwwwwsk...',
  '....kwwwwwwk....',
  '....kppppppk....',
]
const BODY_SIDE = [
  '....kwwwwwwk....',
  '....kwwswwwk....',
  '....kwwswwwk....',
  '....kwwwwwwk....',
  '....kppppppk....',
]
const LEGS = {
  stand: ['....kpk..kpk....', '....kbk..kbk....', '................'],
  walkA: ['....kpk..kpk....', '....kbk..kpk....', '.........kbk....'],
  walkB: ['....kpk..kpk....', '....kpk..kbk....', '....kbk.........'],
}

function makeSprite(rows, flip = false) {
  const canvas = document.createElement('canvas')
  canvas.width = TILE
  canvas.height = TILE
  const ctx = canvas.getContext('2d')
  rows.forEach((line, y) => {
    [...line].forEach((ch, x) => {
      if (ch === '.') return
      ctx.fillStyle = PALETTE[ch]
      ctx.fillRect(flip ? TILE - 1 - x : x, y, 1, 1)
    })
  })
  return canvas
}

// sprites[facing][frame], frames cycle stand → walkA → stand → walkB
export function buildSprites() {
  const frames = (head, body, flip) =>
    ['stand', 'walkA', 'stand', 'walkB'].map(leg => makeSprite([...head, ...body, ...LEGS[leg]], flip))
  return {
    down: frames(HEAD_DOWN, BODY_FRONT),
    up: frames(HEAD_UP, BODY_FRONT),
    right: frames(HEAD_SIDE, BODY_SIDE),
    left: frames(HEAD_SIDE, BODY_SIDE, true),
  }
}

// ===== Room =====
const rect = (ctx, x, y, w, h, color) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

function drawFloor(ctx) {
  for (let row = 3; row < ROWS - 1; row++) {
    for (let col = 1; col < COLS - 1; col++) {
      const x = col * TILE
      const y = row * TILE
      rect(ctx, x, y, TILE, TILE, '#c99d6b')
      // planks: 4px strips with staggered seams
      for (let i = 0; i < 4; i++) {
        rect(ctx, x, y + i * 4 + 3, TILE, 1, '#b4874f')
        const seam = (col * 7 + row * 3 + i * 5) % TILE
        rect(ctx, x + seam, y + i * 4, 1, 3, '#b4874f')
      }
    }
  }
}

function drawRug(ctx) {
  const x = 6 * TILE
  const y = 6 * TILE
  const w = 4 * TILE
  const h = 3 * TILE
  rect(ctx, x, y, w, h, '#8c3b3b')
  rect(ctx, x + 3, y + 3, w - 6, h - 6, '#e4d3b0')
  rect(ctx, x + 5, y + 5, w - 10, h - 10, '#2f4a6b')
  for (let i = 0; i < 6; i++) rect(ctx, x + 10 + i * 8, y + h / 2 - 1, 4, 2, '#e4d3b0')
}

function drawWalls(ctx) {
  // back wall face
  rect(ctx, 0, 0, COLS * TILE, 3 * TILE, '#e8dcc4')
  for (let x = 4; x < COLS * TILE; x += 8) rect(ctx, x, 6, 1, 3 * TILE - 6, '#ddcfb3')
  rect(ctx, 0, 0, COLS * TILE, 5, '#6b5546')
  rect(ctx, 0, 3 * TILE - 3, COLS * TILE, 3, '#9b7b5f') // baseboard
  // side + bottom walls (seen from above)
  rect(ctx, 0, 0, TILE, ROWS * TILE, '#6b5546')
  rect(ctx, (COLS - 1) * TILE, 0, TILE, ROWS * TILE, '#6b5546')
  rect(ctx, 0, (ROWS - 1) * TILE, COLS * TILE, TILE, '#6b5546')
  rect(ctx, TILE - 2, 3 * TILE, 2, (ROWS - 4) * TILE, '#53423a')
  rect(ctx, (COLS - 1) * TILE, 3 * TILE, 2, (ROWS - 4) * TILE, '#53423a')
}

function drawWindow(ctx, night, t) {
  const { col, row, w, h } = OBJECTS.window.box
  const x = col * TILE + 3
  const y = row * TILE + 2
  const W = w * TILE - 6
  const H = h * TILE - 4
  rect(ctx, x - 2, y - 2, W + 4, H + 4, '#f7f3ea')
  rect(ctx, x, y, W, H, night ? '#1c2452' : '#8fd0f0')
  if (night) {
    const MOON = ['.###', '##..', '#...', '##..', '.###'] // crescent
    MOON.forEach((line, my) => [...line].forEach((ch, mx) => {
      if (ch === '#') rect(ctx, x + W - 12 + mx, y + 4 + my, 1, 1, '#f4ecc2')
    }))
    const stars = [[5, 5], [14, 11], [22, 4], [9, 18], [28, 16], [18, 22]]
    stars.forEach(([sx, sy], i) => {
      if (Math.floor(t / 600 + i) % 3) rect(ctx, x + sx, y + sy, 1, 1, '#ffffff')
    })
  } else {
    const drift = Math.floor(t / 400) % (W + 16)
    const cx = x + ((drift + 6) % (W + 4)) - 8
    rect(ctx, Math.max(x, cx), y + 7, Math.min(10, x + W - Math.max(x, cx)), 3, '#ffffff')
    rect(ctx, Math.max(x, cx + 2), y + 5, Math.max(0, Math.min(6, x + W - cx - 2)), 2, '#ffffff')
  }
  rect(ctx, x + W / 2 - 1, y, 2, H, '#f7f3ea') // mullions
  rect(ctx, x, y + H / 2 - 1, W, 2, '#f7f3ea')
  rect(ctx, x - 4, y + H + 2, W + 8, 2, '#d8cfbd') // sill
}

function drawDiploma(ctx) {
  const { col, row, w } = OBJECTS.education.box
  const x = col * TILE + 4
  const y = row * TILE + 2
  const W = w * TILE - 8
  rect(ctx, x, y, W, 12, '#b88a2e')
  rect(ctx, x + 2, y + 2, W - 4, 8, '#fbf7ec')
  rect(ctx, x + 5, y + 4, W - 10, 1, '#8a8378')
  rect(ctx, x + 5, y + 6, W - 14, 1, '#8a8378')
  rect(ctx, x + W - 8, y + 6, 3, 3, '#c0392b')
}

function drawDesk(ctx, t) {
  const { col, row, w, h } = OBJECTS.projects.box
  const x = col * TILE
  const y = row * TILE
  const W = w * TILE
  const H = h * TILE
  // desk
  rect(ctx, x, y + 6, W, 12, '#8a5a35')
  rect(ctx, x, y + 6, W, 2, '#a7744a')
  rect(ctx, x + 1, y + 18, W - 2, H - 20, '#6f4628')
  rect(ctx, x + 4, y + 21, 14, 8, '#7d5130') // drawers
  rect(ctx, x + 4, y + 25, 14, 1, '#5a3820')
  rect(ctx, x + 10, y + 23, 2, 1, '#d9b98a')
  rect(ctx, x + 10, y + 27, 2, 1, '#d9b98a')
  rect(ctx, x + 2, y + H - 2, 3, 2, '#4d301b') // legs
  rect(ctx, x + W - 5, y + H - 2, 3, 2, '#4d301b')
  // monitor
  rect(ctx, x + 14, y - 8, 22, 15, '#2a2d34')
  rect(ctx, x + 16, y - 6, 18, 11, '#1b2b3a')
  const colors = ['#7fd1b9', '#f2c14e', '#e07a5f', '#9fb4ff']
  for (let i = 0; i < 4; i++) {
    const len = 4 + ((i * 5 + Math.floor(t / 300)) % 10)
    rect(ctx, x + 18 + (i % 2) * 2, y - 4 + i * 2, len, 1, colors[i])
  }
  rect(ctx, x + 23, y + 7, 4, 2, '#2a2d34')
  // mug + papers
  rect(ctx, x + 5, y + 2, 5, 6, '#e9e4dc')
  rect(ctx, x + 10, y + 4, 1, 2, '#e9e4dc')
  rect(ctx, x + 38, y + 3, 8, 5, '#f4f1e8')
  rect(ctx, x + 39, y + 4, 5, 1, '#b9b2a5')
}

function drawBookshelf(ctx) {
  const { col, row, w, h } = OBJECTS.blog.box
  const x = col * TILE
  const y = row * TILE
  const W = w * TILE
  const H = h * TILE
  rect(ctx, x, y, W, H, '#5c3b24')
  rect(ctx, x + 2, y + 2, W - 4, H - 4, '#3e2717')
  const spines = ['#c0392b', '#2e86ab', '#f2c14e', '#3d9970', '#8e6bbf', '#e07a5f', '#ecf0f1']
  for (let shelf = 0; shelf < 3; shelf++) {
    const sy = y + 3 + shelf * 15
    let bx = x + 3
    let i = shelf * 2
    while (bx < x + W - 5) {
      const bw = 2 + (i % 3)
      const bh = 10 + (i % 2) * 2
      rect(ctx, bx, sy + (12 - bh), bw, bh, spines[i % spines.length])
      bx += bw + 1
      i++
    }
    rect(ctx, x + 2, sy + 12, W - 4, 2, '#5c3b24')
  }
}

function drawMailbox(ctx) {
  const { col, row } = OBJECTS.contact.box
  const x = col * TILE
  const y = row * TILE
  rect(ctx, x + 7, y + 8, 2, 8, '#5b4636')
  rect(ctx, x + 2, y + 1, 12, 8, '#c0392b')
  rect(ctx, x + 2, y + 1, 12, 2, '#e05a4b')
  rect(ctx, x + 4, y + 5, 8, 1, '#8e2a20')
  rect(ctx, x + 13, y - 2, 1, 5, '#3b3b3b') // flag
  rect(ctx, x + 13, y - 2, 3, 2, '#f2c14e')
}

function drawPlant(ctx, t) {
  const { col, row } = OBJECTS.plant.box
  const x = col * TILE
  const y = row * TILE
  const sway = Math.floor(t / 700) % 2
  rect(ctx, x + 4, y + 22, 8, 9, '#b5603a')
  rect(ctx, x + 3, y + 21, 10, 2, '#c97a50')
  const leaves = [[2, 8], [8, 4], [5, 13], [10, 12], [1, 15], [9, 17]]
  leaves.forEach(([lx, ly], i) => {
    rect(ctx, x + lx + (i % 2 ? sway : 0), y + ly, 5, 4, i % 2 ? '#3d9970' : '#2f7d5b')
  })
  rect(ctx, x + 7, y + 10, 1, 12, '#2f6e4f')
}

function drawDoor(ctx) {
  const { col, row, w } = OBJECTS.exit.box
  const x = col * TILE
  const y = row * TILE
  const W = w * TILE
  rect(ctx, x + 1, y, W - 2, TILE, '#3a2c22')
  rect(ctx, x + 3, y, W - 6, TILE - 3, '#9c6b3f')
  rect(ctx, x + W / 2 - 1, y, 2, TILE - 3, '#7a522f')
  rect(ctx, x + 6, y - 6, W - 12, 5, '#7a3b3b') // doormat
  rect(ctx, x + 8, y - 4, W - 16, 1, '#a35454')
}

// Speech bubble with "!" over an object the player can interact with
export function drawBubble(ctx, obj, t) {
  const { col, row, w } = obj.box
  const bounce = Math.floor(t / 250) % 2
  const x = col * TILE + (w * TILE) / 2 - 4
  const y = Math.max(1, row * TILE - 13 - bounce)
  rect(ctx, x, y, 9, 10, '#2b2622')
  rect(ctx, x + 1, y + 1, 7, 8, '#ffffff')
  rect(ctx, x + 4, y + 2, 1, 4, '#2b2622')
  rect(ctx, x + 4, y + 7, 1, 1, '#2b2622')
  rect(ctx, x + 3, y + 10, 3, 1, '#2b2622')
}

// Blinking outline + bouncing arrow, used when the guide points at an object
export function drawHighlight(ctx, obj, t) {
  const { col, row, w, h } = obj.box
  const x = col * TILE - 1
  const y = row * TILE - 1
  const W = w * TILE + 2
  const H = h * TILE + 2
  const color = Math.floor(t / 300) % 2 ? '#ffd84a' : '#fff4c2'
  rect(ctx, x, y, W, 1, color)
  rect(ctx, x, y + H - 1, W, 1, color)
  rect(ctx, x, y, 1, H, color)
  rect(ctx, x + W - 1, y, 1, H, color)
  const ax = x + W / 2 - 3
  const ay = Math.max(1, y - 8 - (Math.floor(t / 250) % 2))
  rect(ctx, ax, ay, 7, 2, '#ffd84a')
  rect(ctx, ax + 1, ay + 2, 5, 1, '#ffd84a')
  rect(ctx, ax + 2, ay + 3, 3, 1, '#ffd84a')
  rect(ctx, ax + 3, ay + 4, 1, 1, '#ffd84a')
}

export function drawRoom(ctx, { night, t }) {
  drawWalls(ctx)
  drawFloor(ctx)
  drawRug(ctx)
  drawWindow(ctx, night, t)
  drawDiploma(ctx)
  drawBookshelf(ctx)
  drawDesk(ctx, t)
  drawMailbox(ctx)
  drawPlant(ctx, t)
  drawDoor(ctx)
}

// Night: darken everything, then add the monitor glow and moonlight back
export function drawNight(ctx) {
  ctx.fillStyle = 'rgba(12, 16, 44, 0.5)'
  ctx.fillRect(0, 0, COLS * TILE, ROWS * TILE)
  ctx.globalCompositeOperation = 'lighter'
  const glow = (cx, cy, r, color) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    g.addColorStop(0, color)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
  }
  const desk = OBJECTS.projects.box
  glow(desk.col * TILE + 25, desk.row * TILE, 40, 'rgba(90, 140, 200, 0.35)')
  const win = OBJECTS.window.box
  glow(win.col * TILE + (win.w * TILE) / 2, (win.row + win.h) * TILE + 12, 36, 'rgba(120, 130, 200, 0.25)')
  ctx.globalCompositeOperation = 'source-over'
}
