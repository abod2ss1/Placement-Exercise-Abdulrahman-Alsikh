import type { AppState, EventItem, FilterOption, OpenDayModel } from './types'
import {
  escapeHtml,
  formatCompactDate,
  formatDate,
  formatDuration,
  formatTimeRange,
  safeUrl,
  truncateText,
} from './utils'

const SORT_LABELS: Record<AppState['sort'], string> = {
  time: 'Time',
  subject: 'Subject',
  venue: 'Venue',
}

export function renderShell(cuLogo: string, model: OpenDayModel, state: AppState): string {
  const dayLabel = formatDate(model.feed.start_time)
  const timeLabel = formatTimeRange(model.feed.start_time, model.feed.end_time)
  const heroImage = safeUrl(model.feed.cover_image)

  return `
    <a class="skip-link" href="#programme">Skip to the programme results</a>
    <div class="page-shell">
      <header class="site-header">
        <a class="brand-lockup" href="#top" aria-label="Return to the top of the page">
          <img src="${cuLogo}" alt="Cardiff University" class="brand-logo" />
          <div>
            <p class="eyebrow">Student Recruitment</p>
            <h1 class="site-title" id="top">Open Day Planner</h1>
          </div>
        </a>
        <div class="site-actions">
          <p class="site-meta">${escapeHtml(dayLabel)}</p>
          <a class="button-link button-link--quiet" href="#filters">Browse sessions</a>
        </div>
      </header>

      <main class="page-main">
        <section class="hero-section" aria-labelledby="hero-title">
          <div class="hero-image">
            ${
              heroImage
                ? `<img src="${escapeHtml(heroImage)}" alt="Cardiff University Open Day" loading="eager" />`
                : `<div class="hero-image__fallback">
                    <img src="${cuLogo}" alt="Cardiff University" class="hero-image__logo" />
                  </div>`
            }
          </div>
          <div class="hero-copy">
            <p class="eyebrow">Cardiff University Open Day</p>
            <h2 id="hero-title" class="hero-title">Everything you need to plan your visit on one page.</h2>
            <p class="hero-summary">
              Explore the programme, filter sessions by subject or campus, and review the key details without jumping between different screens.
            </p>
            <div class="hero-actions">
              <a class="button-link button-link--primary" href="#filters">Start planning</a>
            </div>
            <p class="hero-caption">${escapeHtml(dayLabel)} | ${escapeHtml(timeLabel)} | Cardiff local time</p>
            <div class="hero-facts">
              ${renderHeroFact(`${model.stats.eventCount} sessions`)}
              ${renderHeroFact(`${model.stats.subjectCount} subjects`)}
              ${renderHeroFact(`${model.stats.venueCount} venues`)}
              ${renderHeroFact(`${model.stats.campusCount} campuses`)}
            </div>
          </div>
        </section>

        <section class="filters-section" id="filters" aria-labelledby="filters-title">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Programme explorer</p>
              <h2 class="section-title" id="filters-title">Find the right sessions quickly</h2>
            </div>
            <button class="button-link button-link--quiet" type="button" data-action="clear-filters">
              Clear filters
            </button>
          </div>

          <form class="filters-grid" role="search">
            <label class="field field--search">
              <span class="field-label">Search sessions</span>
              <input
                id="search"
                name="search"
                class="field-control"
                type="search"
                placeholder="Try Computer Science, tour, or Bute Building"
                value="${escapeHtml(state.search)}"
              />
            </label>

            <label class="field">
              <span class="field-label">Subject</span>
              <select id="topic" name="topic" class="field-control">
                ${renderSelectOptions(model.topics, 'All subjects', state.topic)}
              </select>
            </label>

            <label class="field">
              <span class="field-label">Session type</span>
              <select id="type" name="type" class="field-control">
                ${renderSelectOptions(model.types, 'All session types', state.type)}
              </select>
            </label>

            <label class="field">
              <span class="field-label">Campus</span>
              <select id="campus" name="campus" class="field-control">
                ${renderSelectOptions(model.campuses, 'All campuses', state.campus)}
              </select>
            </label>

            <label class="field">
              <span class="field-label">Sort programme</span>
              <select id="sort" name="sort" class="field-control">
                <option value="time"${state.sort === 'time' ? ' selected' : ''}>Time</option>
                <option value="subject"${state.sort === 'subject' ? ' selected' : ''}>Subject</option>
                <option value="venue"${state.sort === 'venue' ? ' selected' : ''}>Venue</option>
              </select>
            </label>
          </form>
        </section>

        <section class="programme-section" id="programme" aria-labelledby="programme-title">
          <div class="section-heading section-heading--tight">
            <div>
              <p class="eyebrow">Programme</p>
              <h2 class="section-title" id="programme-title">Results</h2>
            </div>
          </div>
          <p id="results-count" class="results-count" aria-live="polite"></p>
          <div id="active-filters" class="active-filters" aria-live="polite"></div>
          <div id="programme-results" class="programme-list"></div>
        </section>
      </main>
    </div>
  `
}

export function renderActiveFilters(state: AppState, model: OpenDayModel): string {
  const activeFilters: string[] = []

  if (state.search.trim()) {
    activeFilters.push(`Search: "${state.search.trim()}"`)
  }

  if (state.topic !== 'all') {
    const selectedTopic = model.topics.find((topic) => topic.value === state.topic)
    if (selectedTopic) {
      activeFilters.push(`Subject: ${selectedTopic.label}`)
    }
  }

  if (state.type !== 'all') {
    activeFilters.push(`Session type: ${state.type}`)
  }

  if (state.campus !== 'all') {
    activeFilters.push(`Campus: ${state.campus}`)
  }

  if (state.sort !== 'time') {
    activeFilters.push(`Sorted by ${SORT_LABELS[state.sort].toLowerCase()}`)
  }

  if (activeFilters.length === 0) {
    return '<span class="filter-pill filter-pill--muted">Showing the full programme</span>'
  }

  return activeFilters
    .map((filter) => `<span class="filter-pill">${escapeHtml(filter)}</span>`)
    .join('')
}

export function renderResults(events: EventItem[]): string {
  return events.length > 0
    ? events.map((event, index) => renderEventRow(event, index)).join('')
    : renderEmptyState()
}

function renderSelectOptions(options: FilterOption[], allLabel: string, selected: string): string {
  return [
    `<option value="all"${selected === 'all' ? ' selected' : ''}>${escapeHtml(allLabel)}</option>`,
    ...options.map(
      (option) =>
        `<option value="${escapeHtml(option.value)}"${selected === option.value ? ' selected' : ''}>${escapeHtml(`${option.label} (${option.count})`)}</option>`,
    ),
  ].join('')
}

function renderHeroFact(label: string): string {
  return `<span class="hero-fact">${escapeHtml(label)}</span>`
}

function renderEventRow(event: EventItem, index: number): string {
  const address = [event.locationAddress, event.locationPostcode].filter(Boolean).join(', ')
  const longDescription = event.description || event.summary
  const metaItems = [
    `Venue: ${event.locationTitle}`,
    event.room ? `Room: ${event.room}` : '',
    event.schoolName ? `School: ${event.schoolName}` : '',
  ].filter(Boolean)

  return `
    <article class="event-row" style="--card-delay: ${Math.min(index, 10) * 35}ms">
      <div class="event-time">
        <p class="event-time__day">${escapeHtml(formatCompactDate(event.startTime))}</p>
        <p class="event-time__range">${escapeHtml(formatTimeRange(event.startTime, event.endTime))}</p>
        <p class="event-time__duration">${escapeHtml(formatDuration(event.startTime, event.endTime))}</p>
      </div>
      <div class="event-content">
        <div class="event-heading">
          <div>
            <p class="event-subject">${escapeHtml(event.topicName)}</p>
            <h3 class="event-title">${escapeHtml(event.title)}</h3>
          </div>
        </div>

        <div class="chip-group">
          <span class="chip chip--accent">${escapeHtml(event.type)}</span>
          <span class="chip">${escapeHtml(event.campus)}</span>
        </div>

        <p class="event-summary">${escapeHtml(truncateText(event.summary, 180))}</p>
        <p class="event-meta">${escapeHtml(metaItems.join(' | '))}</p>

        <details class="event-details">
          <summary>More details</summary>
          <div class="event-details__body">
            <p>${escapeHtml(longDescription)}</p>
            ${
              address
                ? `<p><strong>Address:</strong> ${escapeHtml(address)}</p>`
                : ''
            }
            ${
              event.locationWebsite
                ? `<a class="text-link" href="${escapeHtml(event.locationWebsite)}" target="_blank" rel="noreferrer">Venue information</a>`
                : ''
            }
          </div>
        </details>
      </div>
    </article>
  `
}

function renderEmptyState(): string {
  return `
    <div class="empty-state">
      <p class="empty-state__title">No matching sessions</p>
      <p>Try removing a filter, broadening the search term, or switching the sort order.</p>
    </div>
  `
}
