import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

let initialized = false

function Mermaid({ chart }) {
  const ref = useRef(null)
  const [svg, setSvg] = useState('')

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
        flowchart: { curve: 'basis', padding: 20 },
      })
      initialized = true
    }

    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`
    mermaid.render(id, chart).then(({ svg: rendered }) => {
      setSvg(rendered)
    })
  }, [chart])

  return (
    <div
      ref={ref}
      className="mermaid-container"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default Mermaid
