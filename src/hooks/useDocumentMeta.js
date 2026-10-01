import { useEffect } from 'react'
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION } from '../data/routes'

function setDescription(content) {
  document.querySelector('meta[name="description"]')?.setAttribute('content', content)
}

export function useDocumentMeta({ title, description } = {}) {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE
    setDescription(description || DEFAULT_DESCRIPTION)
  }, [title, description])
}
