import { GUIDE_ORDER, OBJECT_ICONS } from './roomMap'

// The exit door isn't something to "find", so it doesn't count toward the collection
const COLLECTIBLE = GUIDE_ORDER.filter(id => id !== 'exit')

function RoomGuide({ t, visited, disabled, onHover, onSelect, onReplayIntro }) {
  const found = COLLECTIBLE.filter(id => visited.has(id)).length
  const allFound = found === COLLECTIBLE.length

  return (
    <aside className={`room-guide ${disabled ? 'is-disabled' : ''}`} aria-label={t.room.guideTitle} inert={disabled}>
      <div className="room-guide-header">
        <h2>📜 {t.room.guideTitle}</h2>
        <button className="room-guide-help" onClick={onReplayIntro} aria-label={t.room.replayIntro} title={t.room.replayIntro}>?</button>
      </div>
      <p className="room-guide-hint">{t.room.guideHint}</p>

      <ul className="room-guide-list">
        {GUIDE_ORDER.map(id => (
          <li key={id}>
            <button
              className={`room-guide-item ${visited.has(id) ? 'is-visited' : ''}`}
              onMouseEnter={() => onHover(id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(id)}
              onBlur={() => onHover(null)}
              onClick={() => onSelect(id)}
            >
              <span className="room-guide-icon" aria-hidden="true">{OBJECT_ICONS[id]}</span>
              <span className="room-guide-text">
                <strong>{t.room.objects[id].split(' — ')[0]}</strong>
                <span>{t.room.descriptions[id]}</span>
              </span>
              {id !== 'exit' && (
                <span className="room-guide-check" aria-hidden="true">{visited.has(id) ? '★' : '☆'}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="room-guide-progress">
        <div className="room-guide-bar">
          <div className="room-guide-bar-fill" style={{ width: `${(found / COLLECTIBLE.length) * 100}%` }} />
        </div>
        <span>
          {allFound
            ? t.room.allFound
            : t.room.found.replace('{{n}}', found).replace('{{total}}', COLLECTIBLE.length)}
        </span>
      </div>
    </aside>
  )
}

export default RoomGuide
