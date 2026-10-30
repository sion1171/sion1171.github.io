export const TILE = 16
export const COLS = 16
export const ROWS = 12

// # wall · . floor · R rug (walkable) · W window · F diploma frame · D desk
// B bookshelf · M mailbox · P plant · X door
export const MAP = [
  '################',
  '#####WWW#FF#####',
  '#####WWW####BB##',
  '#DDD........BB.#',
  '#DDD........BB.#',
  '#..............#',
  '#.....RRRR.....#',
  '#.....RRRR.....#',
  '#.....RRRR.....#',
  '#P...........M.#',
  '#P.............#',
  '#######XX#######',
]

// Sion walks in from the door to the middle of the rug at the start of the intro
export const ENTRANCE = { col: 7, row: 10 }
export const START = { col: 7, row: 8, facing: 'down' }

const OBJECT_IDS = {
  D: 'projects',
  B: 'blog',
  F: 'education',
  M: 'contact',
  W: 'window',
  P: 'plant',
  X: 'exit',
}

export const GUIDE_ORDER = ['projects', 'blog', 'education', 'contact', 'window', 'plant', 'exit']

export const OBJECT_ICONS = {
  projects: '🖥️',
  blog: '📚',
  education: '🎓',
  contact: '📮',
  window: '🪟',
  plant: '🪴',
  exit: '🚪',
}

const WALKABLE = new Set(['.', 'R'])

export const tileAt = (col, row) => MAP[row]?.[col] ?? '#'
export const isWalkable = (col, row) => WALKABLE.has(tileAt(col, row))

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]

// Each object: its tiles, bounding box (in tiles), and the floor tiles you can interact from
function buildObjects() {
  const objects = {}
  MAP.forEach((line, row) => {
    [...line].forEach((ch, col) => {
      const id = OBJECT_IDS[ch]
      if (!id) return
      objects[id] ??= { id, tiles: [] }
      objects[id].tiles.push([col, row])
    })
  })

  for (const obj of Object.values(objects)) {
    const cols = obj.tiles.map(([c]) => c)
    const rows = obj.tiles.map(([, r]) => r)
    obj.box = {
      col: Math.min(...cols),
      row: Math.min(...rows),
      w: Math.max(...cols) - Math.min(...cols) + 1,
      h: Math.max(...rows) - Math.min(...rows) + 1,
    }

    const zone = new Map()
    for (const [c, r] of obj.tiles) {
      for (const [dc, dr] of DIRS) {
        if (isWalkable(c + dc, r + dr)) zone.set(`${c + dc},${r + dr}`, [c + dc, r + dr])
      }
    }
    // Wall decorations (diploma) sit above more wall: interact from the first floor tile below
    if (zone.size === 0) {
      for (const [c, r] of obj.tiles) {
        let below = r + 1
        while (below < ROWS && !isWalkable(c, below)) below++
        if (below < ROWS) zone.set(`${c},${below}`, [c, below])
      }
    }
    obj.zone = zone
  }
  return objects
}

export const OBJECTS = buildObjects()

export const objectAtTile = (col, row) =>
  Object.values(OBJECTS).find(o => o.tiles.some(([c, r]) => c === col && r === row)) ?? null

export const objectInZone = (col, row) =>
  Object.values(OBJECTS).find(o => o.zone.has(`${col},${row}`)) ?? null

// Shortest walkable path from start until isGoal(col, row); includes the start tile
export function findPath([startCol, startRow], isGoal) {
  const key = (c, r) => `${c},${r}`
  const prev = new Map([[key(startCol, startRow), null]])
  const queue = [[startCol, startRow]]
  while (queue.length) {
    const [c, r] = queue.shift()
    if (isGoal(c, r)) {
      const path = []
      for (let k = key(c, r); k; k = prev.get(k)) path.unshift(k.split(',').map(Number))
      return path
    }
    for (const [dc, dr] of DIRS) {
      const nc = c + dc
      const nr = r + dr
      if (!isWalkable(nc, nr) || prev.has(key(nc, nr))) continue
      prev.set(key(nc, nr), key(c, r))
      queue.push([nc, nr])
    }
  }
  return null
}
