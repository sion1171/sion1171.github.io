import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

let initialized = false

function Mermaid({ chart }) {
  const ref = useRef(null)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
        flowchart: { curve: 'basis', padding: 20 },
        securityLevel: 'loose',
      })
      initialized = true
    }

    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`
    mermaid.render(id, chart)
      .then(({ svg: rendered }) => {
        setSvg(rendered)
        setError(null)
      })
      .catch((err) => {
        console.error('Mermaid render error:', err)
        setError(String(err))
      })
  }, [chart])

  if (error) {
    return <div className="mermaid-container" style={{ color: '#e53935', fontSize: '0.85rem', padding: '1rem' }}>Diagram failed to render</div>
  }

  return (
    <div
      ref={ref}
      className="mermaid-container"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default Mermaid
