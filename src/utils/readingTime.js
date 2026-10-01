const WORDS_PER_MINUTE = 200

// Minutes to read a post, counting only text blocks (images/diagrams are skipped)
export function readingTime(post) {
  const words = post.content
    .filter(block => typeof block === 'string')
    .join(' ')
    .split(/\s+/).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
