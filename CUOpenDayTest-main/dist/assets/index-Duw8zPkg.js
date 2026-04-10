(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();const j=""+new URL("../cu-logo.svg",import.meta.url).href;function l(e){return`${e??""}`.replace(/Â/g,"").replace(/â€™/g,"'").replace(/â€˜/g,"'").replace(/â€œ/g,'"').replace(/â€/g,'"').replace(/â€“/g,"-").replace(/â€”/g,"-").replace(/â€¦/g,"...").replace(/\u00a0/g," ").replace(/\s+/g," ").trim()}function w(e){const t=l(e);return/^https?:\/\//i.test(t)?t:""}function r(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]??t)}function L(e){return new Intl.DateTimeFormat("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date(e))}function D(e){return new Intl.DateTimeFormat("en-GB",{weekday:"short",day:"numeric",month:"short"}).format(new Date(e))}function v(e){return new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit"}).format(new Date(e))}function T(e,t){return`${v(e)} to ${v(t)}`}function _(e,t){const s=Math.max(0,Math.round((m(t)-m(e))/6e4)),i=Math.floor(s/60),n=s%60;return i===0?`${s} min`:n===0?`${i} hr`:`${i} hr ${n} min`}function E(e,t){return e.length<=t?e:`${e.slice(0,t).replace(/\s+\S*$/,"").trim()}...`}function m(e){return new Date(e).getTime()}function h(e,t){return m(e.startTime)-m(t.startTime)||m(e.endTime)-m(t.endTime)||e.title.localeCompare(t.title)}function b(e,t){return e===1?t:`${t}s`}function u(e,t){const s=e.querySelector(t);if(!s)throw new Error(`Expected to find element: ${t}`);return s}function k(e){const t=e.topics??[],s=t.flatMap(a=>(a.programs??[]).filter(p=>p.active!==0&&l(p.title).length>0).map(p=>F(a,p))).sort(h),i=new Map;for(const a of s)i.set(a.topicId,(i.get(a.topicId)??0)+1);const n=t.map(a=>({value:String(a.id),label:l(a.name)||"Unknown subject",count:i.get(a.id)??0})).filter(a=>a.count>0).sort((a,p)=>a.label.localeCompare(p.label)),o=$(s.map(a=>a.type)),c=$(s.map(a=>a.campus)),S=[...o].sort((a,p)=>p.count-a.count||a.label.localeCompare(p.label)).slice(0,4);return{feed:e,events:s,topics:n,types:o,campuses:c,topTypes:S,stats:{subjectCount:n.length,eventCount:s.length,campusCount:c.length,venueCount:new Set(s.map(a=>a.locationTitle)).size,accessibleEventCount:s.filter(a=>a.accessible).length}}}function O(e,t){const s=t.search.trim().toLocaleLowerCase(),i=e.filter(n=>t.topic!=="all"&&String(n.topicId)!==t.topic||t.type!=="all"&&n.type!==t.type||t.campus!=="all"&&n.campus!==t.campus?!1:s?[n.title,n.topicName,n.summary,n.locationTitle,n.room,n.schoolName,n.type,n.campus].join(" ").toLocaleLowerCase().includes(s):!0);return B(i,t.sort)}function F(e,t){const s=t.location,i=l(e.description),n=l(t.description),c=l(t.description_short)||n||i||"Find out more at this session.";return{id:t.id,topicId:e.id,topicName:l(e.name)||"Unknown subject",topicSummary:i,title:l(t.title),summary:c,description:n,startTime:t.start_time,endTime:t.end_time,room:l(t.room),locationTitle:l(s?.title)||"Venue to be confirmed",locationDescription:l(s?.description),locationAddress:l(s?.address),locationPostcode:l(s?.postcode),locationWebsite:w(s?.website),campus:l(s?.campus?.title)||"Campus to be confirmed",schoolName:l(t.school?.name),type:l(t.programType?.type)||"Session",accessible:!!s?.accessible,parking:!!s?.parking,bikeParking:!!s?.bike_parking}}function $(e){const t=new Map;for(const s of e){const i=l(s);i&&t.set(i,(t.get(i)??0)+1)}return[...t.entries()].map(([s,i])=>({value:s,label:s,count:i})).sort((s,i)=>s.label.localeCompare(i.label))}function B(e,t){const s=[...e];return t==="subject"?s.sort((i,n)=>i.topicName.localeCompare(n.topicName)||i.title.localeCompare(n.title)||h(i,n)):t==="venue"?s.sort((i,n)=>i.locationTitle.localeCompare(n.locationTitle)||i.title.localeCompare(n.title)||h(i,n)):s.sort(h)}const N={time:"Time",subject:"Subject",venue:"Venue"};function M(e,t,s){const i=L(t.feed.start_time),n=T(t.feed.start_time,t.feed.end_time),o=w(t.feed.cover_image);return`
    <a class="skip-link" href="#programme">Skip to the programme results</a>
    <div class="page-shell">
      <header class="site-header">
        <a class="brand-lockup" href="#top" aria-label="Return to the top of the page">
          <img src="${e}" alt="Cardiff University" class="brand-logo" />
          <div>
            <p class="eyebrow">Student Recruitment</p>
            <h1 class="site-title" id="top">Open Day Planner</h1>
          </div>
        </a>
        <div class="site-actions">
          <p class="site-meta">${r(i)}</p>
          <a class="button-link button-link--quiet" href="#filters">Browse sessions</a>
        </div>
      </header>

      <main class="page-main">
        <section class="hero-section" aria-labelledby="hero-title">
          <div class="hero-image">
            ${o?`<img src="${r(o)}" alt="Cardiff University Open Day" loading="eager" />`:`<div class="hero-image__fallback">
                    <img src="${e}" alt="Cardiff University" class="hero-image__logo" />
                  </div>`}
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
            <p class="hero-caption">${r(i)} | ${r(n)} | Cardiff local time</p>
            <div class="hero-facts">
              ${f(`${t.stats.eventCount} sessions`)}
              ${f(`${t.stats.subjectCount} subjects`)}
              ${f(`${t.stats.venueCount} venues`)}
              ${f(`${t.stats.campusCount} campuses`)}
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
                value="${r(s.search)}"
              />
            </label>

            <label class="field">
              <span class="field-label">Subject</span>
              <select id="topic" name="topic" class="field-control">
                ${g(t.topics,"All subjects",s.topic)}
              </select>
            </label>

            <label class="field">
              <span class="field-label">Session type</span>
              <select id="type" name="type" class="field-control">
                ${g(t.types,"All session types",s.type)}
              </select>
            </label>

            <label class="field">
              <span class="field-label">Campus</span>
              <select id="campus" name="campus" class="field-control">
                ${g(t.campuses,"All campuses",s.campus)}
              </select>
            </label>

            <label class="field">
              <span class="field-label">Sort programme</span>
              <select id="sort" name="sort" class="field-control">
                <option value="time"${s.sort==="time"?" selected":""}>Time</option>
                <option value="subject"${s.sort==="subject"?" selected":""}>Subject</option>
                <option value="venue"${s.sort==="venue"?" selected":""}>Venue</option>
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
  `}function A(e,t){const s=[];if(e.search.trim()&&s.push(`Search: "${e.search.trim()}"`),e.topic!=="all"){const i=t.topics.find(n=>n.value===e.topic);i&&s.push(`Subject: ${i.label}`)}return e.type!=="all"&&s.push(`Session type: ${e.type}`),e.campus!=="all"&&s.push(`Campus: ${e.campus}`),e.sort!=="time"&&s.push(`Sorted by ${N[e.sort].toLowerCase()}`),s.length===0?'<span class="filter-pill filter-pill--muted">Showing the full programme</span>':s.map(i=>`<span class="filter-pill">${r(i)}</span>`).join("")}function R(e){return e.length>0?e.map((t,s)=>q(t,s)).join(""):I()}function g(e,t,s){return[`<option value="all"${s==="all"?" selected":""}>${r(t)}</option>`,...e.map(i=>`<option value="${r(i.value)}"${s===i.value?" selected":""}>${r(`${i.label} (${i.count})`)}</option>`)].join("")}function f(e){return`<span class="hero-fact">${r(e)}</span>`}function q(e,t){const s=[e.locationAddress,e.locationPostcode].filter(Boolean).join(", "),i=e.description||e.summary,n=[`Venue: ${e.locationTitle}`,e.room?`Room: ${e.room}`:"",e.schoolName?`School: ${e.schoolName}`:""].filter(Boolean);return`
    <article class="event-row" style="--card-delay: ${Math.min(t,10)*35}ms">
      <div class="event-time">
        <p class="event-time__day">${r(D(e.startTime))}</p>
        <p class="event-time__range">${r(T(e.startTime,e.endTime))}</p>
        <p class="event-time__duration">${r(_(e.startTime,e.endTime))}</p>
      </div>
      <div class="event-content">
        <div class="event-heading">
          <div>
            <p class="event-subject">${r(e.topicName)}</p>
            <h3 class="event-title">${r(e.title)}</h3>
          </div>
        </div>

        <div class="chip-group">
          <span class="chip chip--accent">${r(e.type)}</span>
          <span class="chip">${r(e.campus)}</span>
        </div>

        <p class="event-summary">${r(E(e.summary,180))}</p>
        <p class="event-meta">${r(n.join(" | "))}</p>

        <details class="event-details">
          <summary>More details</summary>
          <div class="event-details__body">
            <p>${r(i)}</p>
            ${s?`<p><strong>Address:</strong> ${r(s)}</p>`:""}
            ${e.locationWebsite?`<a class="text-link" href="${r(e.locationWebsite)}" target="_blank" rel="noreferrer">Venue information</a>`:""}
          </div>
        </details>
      </div>
    </article>
  `}function I(){return`
    <div class="empty-state">
      <p class="empty-state__title">No matching sessions</p>
      <p>Try removing a filter, broadening the search term, or switching the sort order.</p>
    </div>
  `}function P(e,t,s,i){e.innerHTML=M(t,s,i);const n=U(e);x(n,s,i),d(n,s,i)}function U(e){return{root:e,search:u(e,"#search"),topic:u(e,"#topic"),type:u(e,"#type"),campus:u(e,"#campus"),sort:u(e,"#sort"),activeFilters:u(e,"#active-filters"),resultsCount:u(e,"#results-count"),results:u(e,"#programme-results")}}function x(e,t,s){e.search.addEventListener("input",()=>{s.search=e.search.value,d(e,t,s)}),e.topic.addEventListener("change",()=>{s.topic=e.topic.value,d(e,t,s)}),e.type.addEventListener("change",()=>{s.type=e.type.value,d(e,t,s)}),e.campus.addEventListener("change",()=>{s.campus=e.campus.value,d(e,t,s)}),e.sort.addEventListener("change",()=>{s.sort=e.sort.value,d(e,t,s)}),e.root.addEventListener("click",i=>{const o=i.target.closest("[data-action]");if(!o)return;o.dataset.action==="clear-filters"&&(i.preventDefault(),H(s),C(e,s),d(e,t,s))})}function d(e,t,s){C(e,s);const i=O(t.events,s),n=new Set(i.map(o=>o.topicName)).size;e.resultsCount.textContent=i.length>0?`Showing ${i.length} ${b(i.length,"session")} across ${n} ${b(n,"subject")}.`:"No sessions match the current filters.",e.activeFilters.innerHTML=A(s,t),e.results.innerHTML=R(i)}function C(e,t){e.search.value=t.search,e.topic.value=t.topic,e.type.value=t.type,e.campus.value=t.campus,e.sort.value=t.sort}function H(e){e.search="",e.topic="all",e.type="all",e.campus="all",e.sort="time"}const y=document.querySelector("#app");if(!y)throw new Error("App root not found.");y.innerHTML=`
  <div class="status-shell">
    <div class="status-card">
      <p class="status-eyebrow">Loading programme</p>
      <h1>Preparing the Cardiff University Open Day planner</h1>
      <p>Fetching the programme data and building the event browser.</p>
    </div>
  </div>
`;V(y);async function V(e){try{const t=await G(),s=k(t);P(e,j,s,{search:"",topic:"all",type:"all",campus:"all",sort:"time"})}catch(t){const s=t instanceof Error?t.message:"The Open Day data could not be loaded.";e.innerHTML=`
      <div class="status-shell">
        <div class="status-card status-card--error" role="alert">
          <p class="status-eyebrow">Unable to load the programme</p>
          <h1>Something went wrong</h1>
          <p>${r(s)}</p>
        </div>
      </div>
    `}}async function G(){const t=await fetch("./api/OpenDay.json");if(!t.ok)throw new Error(`Open Day feed request failed with status ${t.status}.`);return await t.json()}
