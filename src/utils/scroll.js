const behavior = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

export function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: behavior() })
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: behavior() })
}
