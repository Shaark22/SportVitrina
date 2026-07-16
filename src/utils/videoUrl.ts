export interface VideoInfo {
  type: 'youtube' | 'instagram' | 'external'
  embedUrl?: string
  openUrl: string
}

export function parseVideoUrl(url: string): VideoInfo | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)

    if (
      parsed.hostname.includes('youtube.com') ||
      parsed.hostname === 'youtu.be'
    ) {
      let videoId = ''

      if (parsed.hostname === 'youtu.be') {
        videoId = parsed.pathname.slice(1).split('/')[0]
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/')[2] ?? ''
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/')[2] ?? ''
      } else {
        videoId = parsed.searchParams.get('v') ?? ''
      }

      if (videoId) {
        return {
          type: 'youtube',
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          openUrl: `https://www.youtube.com/watch?v=${videoId}`,
        }
      }

      return { type: 'youtube', openUrl: trimmed }
    }

    if (parsed.hostname.includes('instagram.com')) {
      const match = trimmed.match(
        /instagram\.com\/(reel|p|tv)\/([A-Za-z0-9_-]+)/,
      )
      if (match) {
        const [, kind, code] = match
        return {
          type: 'instagram',
          embedUrl: `https://www.instagram.com/${kind}/${code}/embed`,
          openUrl: trimmed,
        }
      }
      return { type: 'instagram', openUrl: trimmed }
    }

    return { type: 'external', openUrl: trimmed }
  } catch {
    return null
  }
}
