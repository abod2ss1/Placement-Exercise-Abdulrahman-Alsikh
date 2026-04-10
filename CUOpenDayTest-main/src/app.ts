import type { AppState, OpenDayModel } from './types'
import { getFilteredEvents } from './model'
import { renderActiveFilters, renderResults, renderShell } from './templates'
import { pluralise, queryRequired } from './utils'

interface AppRefs {
  root: HTMLDivElement
  search: HTMLInputElement
  topic: HTMLSelectElement
  type: HTMLSelectElement
  campus: HTMLSelectElement
  sort: HTMLSelectElement
  activeFilters: HTMLDivElement
  resultsCount: HTMLParagraphElement
  results: HTMLDivElement
}

export function mountApp(
  root: HTMLDivElement,
  logoPath: string,
  model: OpenDayModel,
  state: AppState,
) {
  root.innerHTML = renderShell(logoPath, model, state)
  const refs = queryRefs(root)
  bindEvents(refs, model, state)
  renderContent(refs, model, state)
}

function queryRefs(root: HTMLDivElement): AppRefs {
  return {
    root,
    search: queryRequired<HTMLInputElement>(root, '#search'),
    topic: queryRequired<HTMLSelectElement>(root, '#topic'),
    type: queryRequired<HTMLSelectElement>(root, '#type'),
    campus: queryRequired<HTMLSelectElement>(root, '#campus'),
    sort: queryRequired<HTMLSelectElement>(root, '#sort'),
    activeFilters: queryRequired<HTMLDivElement>(root, '#active-filters'),
    resultsCount: queryRequired<HTMLParagraphElement>(root, '#results-count'),
    results: queryRequired<HTMLDivElement>(root, '#programme-results'),
  }
}

function bindEvents(refs: AppRefs, model: OpenDayModel, state: AppState) {
  refs.search.addEventListener('input', () => {
    state.search = refs.search.value
    renderContent(refs, model, state)
  })

  refs.topic.addEventListener('change', () => {
    state.topic = refs.topic.value
    renderContent(refs, model, state)
  })

  refs.type.addEventListener('change', () => {
    state.type = refs.type.value
    renderContent(refs, model, state)
  })

  refs.campus.addEventListener('change', () => {
    state.campus = refs.campus.value
    renderContent(refs, model, state)
  })

  refs.sort.addEventListener('change', () => {
    state.sort = refs.sort.value as AppState['sort']
    renderContent(refs, model, state)
  })

  refs.root.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const actionButton = target.closest<HTMLElement>('[data-action]')

    if (!actionButton) {
      return
    }

    const action = actionButton.dataset.action

    if (action === 'clear-filters') {
      event.preventDefault()
      resetFilters(state)
      syncControls(refs, state)
      renderContent(refs, model, state)
    }
  })
}

function renderContent(refs: AppRefs, model: OpenDayModel, state: AppState) {
  syncControls(refs, state)

  const filteredEvents = getFilteredEvents(model.events, state)
  const subjectCount = new Set(filteredEvents.map((event) => event.topicName)).size

  refs.resultsCount.textContent =
    filteredEvents.length > 0
      ? `Showing ${filteredEvents.length} ${pluralise(filteredEvents.length, 'session')} across ${subjectCount} ${pluralise(subjectCount, 'subject')}.`
      : 'No sessions match the current filters.'

  refs.activeFilters.innerHTML = renderActiveFilters(state, model)
  refs.results.innerHTML = renderResults(filteredEvents)
}

function syncControls(refs: AppRefs, state: AppState) {
  refs.search.value = state.search
  refs.topic.value = state.topic
  refs.type.value = state.type
  refs.campus.value = state.campus
  refs.sort.value = state.sort
}

function resetFilters(state: AppState) {
  state.search = ''
  state.topic = 'all'
  state.type = 'all'
  state.campus = 'all'
  state.sort = 'time'
}
