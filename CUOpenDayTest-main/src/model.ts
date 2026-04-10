import type { AppState, EventItem, FilterOption, OpenDayFeed, OpenDayModel, PlanConflict, Program, Topic } from './types'
import { cleanText, parseScheduleValue, safeUrl, sortByTime, timesOverlap } from './utils'

export function normaliseFeed(feed: OpenDayFeed): OpenDayModel {
  const rawTopics = feed.topics ?? []
  const events = rawTopics
    .flatMap((topic) =>
      (topic.programs ?? [])
        .filter((program) => program.active !== 0 && cleanText(program.title).length > 0)
        .map((program) => normaliseEvent(topic, program)),
    )
    .sort(sortByTime)

  const topicCountById = new Map<number, number>()
  for (const event of events) {
    topicCountById.set(event.topicId, (topicCountById.get(event.topicId) ?? 0) + 1)
  }

  const topics = rawTopics
    .map((topic) => ({
      value: String(topic.id),
      label: cleanText(topic.name) || 'Unknown subject',
      count: topicCountById.get(topic.id) ?? 0,
    }))
    .filter((topic) => topic.count > 0)
    .sort((first, second) => first.label.localeCompare(second.label))

  const types = buildFilterOptions(events.map((event) => event.type))
  const campuses = buildFilterOptions(events.map((event) => event.campus))
  const topTypes = [...types]
    .sort((first, second) => second.count - first.count || first.label.localeCompare(second.label))
    .slice(0, 4)

  return {
    feed,
    events,
    topics,
    types,
    campuses,
    topTypes,
    stats: {
      subjectCount: topics.length,
      eventCount: events.length,
      campusCount: campuses.length,
      venueCount: new Set(events.map((event) => event.locationTitle)).size,
      accessibleEventCount: events.filter((event) => event.accessible).length,
    },
  }
}

export function getFilteredEvents(events: EventItem[], state: AppState): EventItem[] {
  const searchTerm = state.search.trim().toLocaleLowerCase()

  const filtered = events.filter((event) => {
    if (state.topic !== 'all' && String(event.topicId) !== state.topic) {
      return false
    }

    if (state.type !== 'all' && event.type !== state.type) {
      return false
    }

    if (state.campus !== 'all' && event.campus !== state.campus) {
      return false
    }

    if (!searchTerm) {
      return true
    }

    return [
      event.title,
      event.topicName,
      event.summary,
      event.locationTitle,
      event.room,
      event.schoolName,
      event.type,
      event.campus,
    ]
      .join(' ')
      .toLocaleLowerCase()
      .includes(searchTerm)
  })

  return sortEvents(filtered, state.sort)
}

export function getSavedEvents(events: EventItem[], savedIds: Set<number>): EventItem[] {
  return events.filter((event) => savedIds.has(event.id)).sort(sortByTime)
}

export function findPlanConflicts(savedEvents: EventItem[]): PlanConflict[] {
  const sorted = [...savedEvents].sort(sortByTime)
  const conflicts: PlanConflict[] = []

  for (let currentIndex = 0; currentIndex < sorted.length; currentIndex += 1) {
    const current = sorted[currentIndex]

    for (let nextIndex = currentIndex + 1; nextIndex < sorted.length; nextIndex += 1) {
      const next = sorted[nextIndex]

      if (parseScheduleValue(next.startTime) >= parseScheduleValue(current.endTime)) {
        break
      }

      if (timesOverlap(current, next)) {
        conflicts.push({ first: current, second: next })
      }
    }
  }

  return conflicts
}

export function loadSavedIds(events: EventItem[], storageKey: string): Set<number> {
  const raw = window.localStorage.getItem(storageKey)

  if (!raw) {
    return new Set<number>()
  }

  try {
    const saved = JSON.parse(raw) as unknown
    const validIds = new Set(events.map((event) => event.id))

    if (!Array.isArray(saved)) {
      return new Set<number>()
    }

    return new Set(
      saved
        .map((value) => Number.parseInt(String(value), 10))
        .filter((value) => Number.isFinite(value) && validIds.has(value)),
    )
  } catch {
    return new Set<number>()
  }
}

export function persistSavedIds(savedIds: Set<number>, storageKey: string) {
  window.localStorage.setItem(storageKey, JSON.stringify([...savedIds]))
}

function normaliseEvent(topic: Topic, program: Program): EventItem {
  const location = program.location
  const topicSummary = cleanText(topic.description)
  const fullDescription = cleanText(program.description)
  const shortDescription = cleanText(program.description_short)
  const summary = shortDescription || fullDescription || topicSummary || 'Find out more at this session.'

  return {
    id: program.id,
    topicId: topic.id,
    topicName: cleanText(topic.name) || 'Unknown subject',
    topicSummary,
    title: cleanText(program.title),
    summary,
    description: fullDescription,
    startTime: program.start_time,
    endTime: program.end_time,
    room: cleanText(program.room),
    locationTitle: cleanText(location?.title) || 'Venue to be confirmed',
    locationDescription: cleanText(location?.description),
    locationAddress: cleanText(location?.address),
    locationPostcode: cleanText(location?.postcode),
    locationWebsite: safeUrl(location?.website),
    campus: cleanText(location?.campus?.title) || 'Campus to be confirmed',
    schoolName: cleanText(program.school?.name),
    type: cleanText(program.programType?.type) || 'Session',
    accessible: Boolean(location?.accessible),
    parking: Boolean(location?.parking),
    bikeParking: Boolean(location?.bike_parking),
  }
}

function buildFilterOptions(values: string[]): FilterOption[] {
  const counts = new Map<string, number>()

  for (const value of values) {
    const label = cleanText(value)
    if (!label) {
      continue
    }

    counts.set(label, (counts.get(label) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([label, count]) => ({ value: label, label, count }))
    .sort((first, second) => first.label.localeCompare(second.label))
}

function sortEvents(events: EventItem[], sort: AppState['sort']): EventItem[] {
  const sorted = [...events]

  if (sort === 'subject') {
    return sorted.sort(
      (first, second) =>
        first.topicName.localeCompare(second.topicName) ||
        first.title.localeCompare(second.title) ||
        sortByTime(first, second),
    )
  }

  if (sort === 'venue') {
    return sorted.sort(
      (first, second) =>
        first.locationTitle.localeCompare(second.locationTitle) ||
        first.title.localeCompare(second.title) ||
        sortByTime(first, second),
    )
  }

  return sorted.sort(sortByTime)
}
