export interface OpenDayFeed {
  id: number
  start_time: string
  end_time: string
  description?: string | null
  cover_image?: string | null
  topics?: Topic[]
}

export interface Topic {
  id: number
  name?: string | null
  description?: string | null
  cover_image?: string | null
  programs?: Program[]
}

export interface Program {
  id: number
  title?: string | null
  description?: string | null
  description_short?: string | null
  start_time: string
  end_time: string
  room?: string | null
  location?: LocationDetails | null
  school?: SchoolDetails | null
  programType?: ProgramTypeDetails | null
  active?: number
}

export interface LocationDetails {
  title?: string | null
  description?: string | null
  address?: string | null
  postcode?: string | null
  website?: string | null
  accessible?: number | null
  parking?: number | null
  bike_parking?: number | null
  campus?: CampusDetails | null
}

export interface CampusDetails {
  title?: string | null
}

export interface SchoolDetails {
  name?: string | null
}

export interface ProgramTypeDetails {
  type?: string | null
}

export interface EventItem {
  id: number
  topicId: number
  topicName: string
  topicSummary: string
  title: string
  summary: string
  description: string
  startTime: string
  endTime: string
  room: string
  locationTitle: string
  locationDescription: string
  locationAddress: string
  locationPostcode: string
  locationWebsite: string
  campus: string
  schoolName: string
  type: string
  accessible: boolean
  parking: boolean
  bikeParking: boolean
}

export interface FilterOption {
  value: string
  label: string
  count: number
}

export interface OpenDayModel {
  feed: OpenDayFeed
  events: EventItem[]
  topics: FilterOption[]
  types: FilterOption[]
  campuses: FilterOption[]
  topTypes: FilterOption[]
  stats: {
    subjectCount: number
    eventCount: number
    campusCount: number
    venueCount: number
    accessibleEventCount: number
  }
}

export interface PlanConflict {
  first: EventItem
  second: EventItem
}

export type SortMode = 'time' | 'subject' | 'venue'

export interface AppState {
  search: string
  topic: string
  type: string
  campus: string
  sort: SortMode
}
