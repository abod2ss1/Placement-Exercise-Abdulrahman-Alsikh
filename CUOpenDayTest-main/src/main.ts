import './style.css'
import cuLogo from '/cu-logo.svg'
import { mountApp } from './app'
import { normaliseFeed } from './model'
import type { AppState, OpenDayFeed } from './types'
import { escapeHtml } from './utils'

const appRoot = document.querySelector<HTMLDivElement>('#app')

if (!appRoot) {
  throw new Error('App root not found.')
}

appRoot.innerHTML = `
  <div class="status-shell">
    <div class="status-card">
      <p class="status-eyebrow">Loading programme</p>
      <h1>Preparing the Cardiff University Open Day planner</h1>
      <p>Fetching the programme data and building the event browser.</p>
    </div>
  </div>
`

void initialiseApp(appRoot)

async function initialiseApp(root: HTMLDivElement) {
  try {
    const feed = await loadOpenDay()
    const model = normaliseFeed(feed)
    const state: AppState = {
      search: '',
      topic: 'all',
      type: 'all',
      campus: 'all',
      sort: 'time',
    }

    mountApp(root, cuLogo, model, state)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'The Open Day data could not be loaded.'

    root.innerHTML = `
      <div class="status-shell">
        <div class="status-card status-card--error" role="alert">
          <p class="status-eyebrow">Unable to load the programme</p>
          <h1>Something went wrong</h1>
          <p>${escapeHtml(message)}</p>
        </div>
      </div>
    `
  }
}

async function loadOpenDay(): Promise<OpenDayFeed> {
  const base = import.meta.env.BASE_URL || './'
  const response = await fetch(`${base}api/OpenDay.json`)

  if (!response.ok) {
    throw new Error(`Open Day feed request failed with status ${response.status}.`)
  }

  return (await response.json()) as OpenDayFeed
}
