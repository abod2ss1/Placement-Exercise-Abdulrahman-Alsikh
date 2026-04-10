import type { EventItem } from './types'

export function cleanText(value?: string | null): string {
  const raw = `${value ?? ''}`

  return raw
    .replace(/Â/g, '')
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€“/g, '-')
    .replace(/â€”/g, '-')
    .replace(/â€¦/g, '...')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function safeUrl(value?: string | null): string {
  const url = cleanText(value)
  return /^https?:\/\//i.test(url) ? url : ''
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }

    return entities[character] ?? character
  })
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatCompactDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(value))
}

export function formatTime(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} to ${formatTime(end)}`
}

export function formatDuration(start: string, end: string): string {
  const minutes = Math.max(0, Math.round((parseScheduleValue(end) - parseScheduleValue(start)) / 60000))
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60

  if (hours === 0) {
    return `${minutes} min`
  }

  if (remainder === 0) {
    return `${hours} hr`
  }

  return `${hours} hr ${remainder} min`
}

export function truncateText(value: string, limit: number): string {
  if (value.length <= limit) {
    return value
  }

  return `${value.slice(0, limit).replace(/\s+\S*$/, '').trim()}...`
}

export function parseScheduleValue(value: string): number {
  return new Date(value).getTime()
}

export function timesOverlap(first: EventItem, second: EventItem): boolean {
  return (
    parseScheduleValue(first.startTime) < parseScheduleValue(second.endTime) &&
    parseScheduleValue(second.startTime) < parseScheduleValue(first.endTime)
  )
}

export function sortByTime(first: EventItem, second: EventItem): number {
  return (
    parseScheduleValue(first.startTime) - parseScheduleValue(second.startTime) ||
    parseScheduleValue(first.endTime) - parseScheduleValue(second.endTime) ||
    first.title.localeCompare(second.title)
  )
}

export function pluralise(count: number, singular: string): string {
  return count === 1 ? singular : `${singular}s`
}

export function queryRequired<ElementType extends Element>(
  root: ParentNode,
  selector: string,
): ElementType {
  const element = root.querySelector<ElementType>(selector)

  if (!element) {
    throw new Error(`Expected to find element: ${selector}`)
  }

  return element
}
