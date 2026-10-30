/**
 * Real-time GitHub Contribution Calendar for Paul John Jimenez (@paulrndp)
 * Fetches live contribution data from GitHub with resilient fallback & caching.
 */
(() => {
  const USERNAME = 'paulrndp';
  const PRIMARY_API = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;
  const BACKUP_API = `https://github-contributions.vercel.app/api/v1/${USERNAME}`;
  const LOCAL_CACHE_KEY = 'pj_github_contributions_v1';
  const LOCAL_FALLBACK_FILE = './assests/github-contributions.json';

  const svg = document.querySelector('#contrib-svg');
  const totalCountEl = document.querySelector('#contrib-total-count');
  const tooltip = document.querySelector('#contrib-tooltip');
  const scrollContainer = document.querySelector('#contrib-scroll');
  const liveBadge = document.querySelector('#activity .contrib-live-badge');

  if (!svg || !totalCountEl) return;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const CELL_SIZE = 10;
  const CELL_GAP = 3;
  const LABEL_W = 28;
  const TOP_H = 18;
  const TOTAL_WEEKS = 53;

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let activeCell = null;
  let hideTimeout = null;

  function toISODate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatTooltip(count, dateStr) {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);

    const dayName = FULL_DAYS[d.getDay()] || '';
    const monthName = FULL_MONTHS[month] || '';
    const dateFormatted = `${dayName}, ${monthName} ${day}, ${year}`;

    if (count === 0) {
      return `No contributions on ${dateFormatted}`;
    } else if (count === 1) {
      return `<strong>1 contribution</strong> on ${dateFormatted}`;
    } else {
      return `<strong>${count.toLocaleString()} contributions</strong> on ${dateFormatted}`;
    }
  }

  function positionTooltip(cell) {
    if (!tooltip) return;
    const box = cell.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const h = tooltipRect.height || 28;
    const w = tooltipRect.width || 180;

    let left = box.left + box.width / 2;
    let top = box.top - 8;

    // Clamp horizontally to the card / viewport bounds
    const card = document.querySelector('#github-contrib-card');
    const cardRight = card ? card.getBoundingClientRect().right : window.innerWidth;
    const cardLeft = card ? card.getBoundingClientRect().left : 0;

    const minLeft = Math.max(12, cardLeft + 12) + w / 2;
    const maxLeft = Math.min(window.innerWidth - 12, cardRight - 12) - w / 2;
    left = Math.max(minLeft, Math.min(maxLeft, left));

    // If too close to viewport top, flip below the cell
    if (top - h < 10) {
      top = box.bottom + h + 8;
    }

    tooltip.style.left = `${Math.round(left)}px`;
    tooltip.style.top = `${Math.round(top)}px`;
  }

  function showTooltip(cell) {
    if (!tooltip) return;
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    activeCell = cell;
    const count = parseInt(cell.getAttribute('data-count') || '0', 10);
    const dateStr = cell.getAttribute('data-date') || '';
    tooltip.innerHTML = formatTooltip(count, dateStr);
    tooltip.hidden = false;
    positionTooltip(cell);
    tooltip.classList.add('is-visible');
  }

  function hideTooltip() {
    if (!tooltip) return;
    activeCell = null;
    tooltip.classList.remove('is-visible');
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!activeCell) tooltip.hidden = true;
    }, 120);
  }

  function renderCalendar(contributionsMap, totalCount) {
    // Update total count in header
    totalCountEl.textContent = Number(totalCount || 0).toLocaleString();

    // Compute the 53-week date grid ending on current Saturday
    const now = new Date();
    const endSat = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    endSat.setDate(endSat.getDate() + (6 - endSat.getDay()));

    const startSun = new Date(endSat);
    startSun.setDate(endSat.getDate() - (TOTAL_WEEKS * 7 - 1));

    // Clear SVG
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Set SVG attributes
    const svgWidth = LABEL_W + TOTAL_WEEKS * (CELL_SIZE + CELL_GAP) + 2;
    const svgHeight = TOP_H + 7 * (CELL_SIZE + CELL_GAP) + 4;
    svg.setAttribute('width', String(svgWidth));
    svg.setAttribute('height', String(svgHeight));
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

    // Track month positions
    const monthHeaders = [];
    let lastMonth = -1;

    // Day of week labels on the left (Mon, Wed, Fri)
    const dayLabels = [
      { text: 'Mon', row: 1 },
      { text: 'Wed', row: 3 },
      { text: 'Fri', row: 5 }
    ];
    dayLabels.forEach(label => {
      const textEl = document.createElementNS(SVG_NS, 'text');
      textEl.setAttribute('class', 'contrib-day-label');
      textEl.setAttribute('x', '0');
      textEl.setAttribute('y', String(TOP_H + label.row * (CELL_SIZE + CELL_GAP) + 8.5));
      textEl.textContent = label.text;
      svg.appendChild(textEl);
    });

    const cells = [];
    const todayStr = toISODate(now);

    for (let w = 0; w < TOTAL_WEEKS; w++) {
      const weekStart = new Date(startSun);
      weekStart.setDate(startSun.getDate() + w * 7);

      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(weekStart);
        currentDate.setDate(weekStart.getDate() + d);
        const dateStr = toISODate(currentDate);

        // Check if month changes
        const m = currentDate.getMonth();
        if (m !== lastMonth && d <= 3) {
          monthHeaders.push({ name: MONTH_NAMES[m], week: w });
          lastMonth = m;
        }

        const isFuture = dateStr > todayStr;
        const entry = contributionsMap.get(dateStr);
        const count = entry ? entry.count : 0;
        let level = 0;
        if (entry && entry.level !== undefined) {
          level = entry.level;
        } else if (count > 0) {
          if (count >= 10) level = 4;
          else if (count >= 6) level = 3;
          else if (count >= 3) level = 2;
          else level = 1;
        }

        const rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttribute('class', `contrib-day${isFuture ? ' future' : ''}`);
        rect.setAttribute('x', String(LABEL_W + w * (CELL_SIZE + CELL_GAP)));
        rect.setAttribute('y', String(TOP_H + d * (CELL_SIZE + CELL_GAP)));
        rect.setAttribute('width', String(CELL_SIZE));
        rect.setAttribute('height', String(CELL_SIZE));
        rect.setAttribute('rx', '2');
        rect.setAttribute('ry', '2');
        rect.setAttribute('data-date', dateStr);
        rect.setAttribute('data-count', String(count));
        rect.setAttribute('data-level', String(level));

        if (!isFuture) {
          rect.setAttribute('tabindex', '0');
          rect.setAttribute('role', 'gridcell');
          rect.setAttribute('aria-label', `${count} ${count === 1 ? 'contribution' : 'contributions'} on ${dateStr}`);

          rect.addEventListener('focus', () => showTooltip(rect));
          rect.addEventListener('blur', hideTooltip);

          cells.push(rect);
        }

        svg.appendChild(rect);
      }
    }

    // Smooth event delegation on SVG (glitch-free hover across cells)
    svg.onpointerover = e => {
      const cell = e.target.closest('.contrib-day');
      if (!cell || cell.classList.contains('future')) return;
      if (activeCell === cell) return;
      showTooltip(cell);
    };

    svg.onpointerleave = () => {
      hideTooltip();
    };

    // Render month labels at top, filtering collisions
    for (let i = 0; i < monthHeaders.length; i++) {
      const mh = monthHeaders[i];
      const nextMh = monthHeaders[i + 1];
      // Skip if too close to previous label or at column 0 with next label right after
      if (mh.week === 0 && nextMh && nextMh.week <= 2) continue;
      if (nextMh && (nextMh.week - mh.week < 2)) continue;

      const textEl = document.createElementNS(SVG_NS, 'text');
      textEl.setAttribute('class', 'contrib-month-label');
      textEl.setAttribute('x', String(LABEL_W + mh.week * (CELL_SIZE + CELL_GAP)));
      textEl.setAttribute('y', '10');
      textEl.textContent = mh.name;
      svg.appendChild(textEl);
    }

    // Keyboard navigation (arrows, home, end, escape)
    cells.forEach((cell, idx) => {
      cell.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          hideTooltip();
          return;
        }

        let nextIdx = null;
        if (e.key === 'ArrowLeft') nextIdx = idx - 7;
        else if (e.key === 'ArrowRight') nextIdx = idx + 7;
        else if (e.key === 'ArrowUp') nextIdx = idx - 1;
        else if (e.key === 'ArrowDown') nextIdx = idx + 1;
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = cells.length - 1;

        if (nextIdx !== null && nextIdx >= 0 && nextIdx < cells.length) {
          e.preventDefault();
          const target = cells[nextIdx];
          target.focus();
          showTooltip(target);
          target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      });
    });

    // Auto-scroll calendar to rightmost side on mobile so latest contributions are visible
    if (scrollContainer && scrollContainer.scrollWidth > scrollContainer.clientWidth) {
      scrollContainer.scrollLeft = scrollContainer.scrollWidth;
    }
  }

  function parseJogruberData(json) {
    if (!json || !Array.isArray(json.contributions)) return null;
    const map = new Map();
    let total = json.total?.lastYear;
    let sum = 0;
    json.contributions.forEach(item => {
      map.set(item.date, {
        date: item.date,
        count: item.count,
        level: item.level !== undefined ? item.level : (item.count > 0 ? 1 : 0)
      });
      sum += item.count || 0;
    });
    if (total === undefined || total === null) total = sum;
    return { map, total };
  }

  function parseVercelData(json) {
    if (!json || !Array.isArray(json.contributions)) return null;
    const map = new Map();
    const today = toISODate(new Date());
    const yearAgoDate = new Date();
    yearAgoDate.setFullYear(yearAgoDate.getFullYear() - 1);
    const yearAgoStr = toISODate(yearAgoDate);

    let total = 0;
    json.contributions.forEach(item => {
      const level = Math.min(4, Math.max(0, parseInt(item.intensity, 10) || (item.count > 0 ? 1 : 0)));
      map.set(item.date, { date: item.date, count: item.count, level });
      if (item.date >= yearAgoStr && item.date <= today) {
        total += item.count || 0;
      }
    });

    // Find current year total from json.years if present
    const currentYearStr = String(new Date().getFullYear());
    const yearObj = (json.years || []).find(y => String(y.year) === currentYearStr);
    if (yearObj && typeof yearObj.total === 'number') {
      total = yearObj.total;
    }

    return { map, total };
  }

  async function fetchWithTimeout(url, timeoutMs = 6000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal, cache: 'no-cache' });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  async function syncContributions() {
    let result = null;

    // 1. Try Primary Real-Time API (Jogruber)
    try {
      const data = await fetchWithTimeout(PRIMARY_API, 5000);
      result = parseJogruberData(data);
    } catch (e) {
      console.warn('Primary GitHub API failed or timed out, trying backup...', e.message);
    }

    // 2. Try Secondary Real-Time API (Vercel)
    if (!result) {
      try {
        const data = await fetchWithTimeout(BACKUP_API, 5000);
        result = parseVercelData(data);
      } catch (e) {
        console.warn('Backup GitHub API failed or timed out, checking cache...', e.message);
      }
    }

    // If online fetch succeeded, save to localStorage & render
    if (result && result.map.size > 0) {
      renderCalendar(result.map, result.total);
      if (liveBadge) {
        liveBadge.setAttribute('title', 'Real-time sync from GitHub active');
      }
      try {
        const cachePayload = {
          timestamp: Date.now(),
          total: result.total,
          entries: Array.from(result.map.entries())
        };
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(cachePayload));
      } catch {}
      return;
    }

    // 3. Try LocalStorage cache if offline or APIs unreachable
    try {
      const cachedStr = localStorage.getItem(LOCAL_CACHE_KEY);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (cached && Array.isArray(cached.entries)) {
          const map = new Map(cached.entries);
          renderCalendar(map, cached.total);
          return;
        }
      }
    } catch {}

    // 4. Try local bundled JSON file
    try {
      const data = await fetchWithTimeout(LOCAL_FALLBACK_FILE, 4000);
      const parsed = parseJogruberData(data);
      if (parsed) {
        renderCalendar(parsed.map, parsed.total);
      }
    } catch {}
  }

  // Instant render from localStorage cache or local file before network returns
  try {
    const cachedStr = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr);
      if (cached && Array.isArray(cached.entries)) {
        renderCalendar(new Map(cached.entries), cached.total);
      }
    } else {
      // Fetch local file for instant zero-flash render
      fetch(LOCAL_FALLBACK_FILE)
        .then(r => r.json())
        .then(data => {
          const parsed = parseJogruberData(data);
          if (parsed && (!svg.hasChildNodes() || svg.childNodes.length === 0)) {
            renderCalendar(parsed.map, parsed.total);
          }
        })
        .catch(() => {});
    }
  } catch {}

  // Trigger live background sync
  syncContributions();

  // Handle window resize or scroll to reposition tooltip if open
  window.addEventListener('resize', () => {
    if (activeCell) positionTooltip(activeCell);
    else hideTooltip();
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (activeCell) positionTooltip(activeCell);
  }, { passive: true });

  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', () => {
      if (activeCell) positionTooltip(activeCell);
    }, { passive: true });
  }
})();
