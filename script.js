(() => {
  const profile = window.PORTFOLIO;
  if (!profile) return;
  const $ = selector => document.querySelector(selector);
  const text = (tag, value, className) => { const element = document.createElement(tag); element.textContent = value; if (className) element.className = className; return element; };
  const safeUrl = value => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; } };
  const stackIcons = {
    'Vue.js': 'vue', 'Vue 3': 'vue', TypeScript: 'typescript', Nuxt: 'nuxt',
    '.NET': 'dotnet', '.NET 10': 'dotnet', 'ASP.NET Core': 'dotnet', Docker: 'docker',
    'C#': 'csharp', Python: 'python', 'Entity Framework': 'entity-framework', 'Entity Framework Core': 'entity-framework', 'Entity Framework / EF Core': 'entity-framework',
    MySQL: 'mysql', Microservices: 'microservices', Razor: 'razor', MVC: 'mvc',
    Vite: 'vite', Pinia: 'pinia', 'Vue Router': 'router', JWT: 'jwt', AWS: 'aws',
    'ASP.NET Core / MVC': 'dotnet', 'REST APIs': 'api', Authentication: 'authentication', RBAC: 'rbac',
    PostgreSQL: 'postgresql', TimescaleDB: 'timescaledb', Redis: 'redis', SQL: 'sql', xUnit: 'xunit', NUnit: 'nunit',
    'Integration testing': 'integration-testing', 'Unit / integration testing': 'integration-testing', Git: 'git', 'GitLab CI/CD': 'gitlab',
    Azure: 'azure', Postman: 'postman', Swagger: 'swagger', 'Swagger / OpenAPI': 'swagger', JavaScript: 'javascript'
  };
  function createBadge(label) {
    const badge = text('span', label);
    if (stackIcons[label]) {
      badge.className = 'tech-badge';
      const icon = document.createElement('img');
      icon.src = `./assests/icons/${stackIcons[label]}.svg`;
      icon.alt = ''; icon.width = 16; icon.height = 16;
      // Keep the readable label if an icon ever fails to load.
      icon.addEventListener('error', () => icon.hidden = true, { once: true });
      badge.prepend(icon);
    }
    return badge;
  }
  document.querySelectorAll('[data-profile]').forEach(element => { const value = profile[element.dataset.profile]; if (value) element.textContent = value; });
  document.title = `${profile.name} — ${profile.role}`;
  $('.current-year').textContent = new Date().getFullYear();
  if (profile.skillGroups?.length) {
    profile.skillGroups.forEach(group => {
      const section = document.createElement('div'); section.className = 'skill-group';
      const badges = document.createElement('div'); badges.className = 'tags';
      group.items.forEach(skill => badges.append(createBadge(skill)));
      section.append(text('h3', group.title), badges); $('#skill-list').append(section);
    });
  } else { $('#skill-list').classList.add('tags'); profile.skills.forEach(skill => $('#skill-list').append(createBadge(skill))); }
  function renderExperience(job, target) {
    const article = document.createElement('article'); article.className = 'experience-card';
    article.append(text('p', job.dates, 'experience-dates'), text('h3', job.company), text('p', job.role, 'experience-role'));
    if (job.location || job.mode) article.append(text('p', [job.location, job.mode].filter(Boolean).join(' · '), 'experience-meta'));
    if (job.highlights) {
      const list = document.createElement('ul');
      job.highlights.forEach(item => {
        if (typeof item === 'string') { list.append(text('li', item)); return; }
        const entry = document.createElement('li'); entry.append(document.createTextNode(item.before || ''));
        const url = safeUrl(item.url);
        if (url && item.linkText) {
          const link = text('a', item.linkText); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
          link.setAttribute('aria-label', `${item.linkText} website (opens in a new tab)`); entry.append(link);
        } else if (item.linkText) entry.append(document.createTextNode(item.linkText));
        entry.append(document.createTextNode(item.after || '')); list.append(entry);
      });
      article.append(list);
    } else article.append(text('p', job.description, 'experience-description'));
    $(target).append(article);
  }
  (profile.experience || []).forEach(job => renderExperience(job, '#experience-list'));
  (profile.additionalExperience || []).forEach(job => renderExperience(job, '#additional-experience-list'));
  (profile.education || []).forEach(item => {
    const entry = document.createElement('article'); entry.className = 'education-entry';
    entry.append(text('p', item.dates, 'experience-dates'), text('h4', item.institution), text('p', item.qualification)); $('#education-list').append(entry);
  });
  if (profile.email) { const email = text('a', profile.email); email.href = `mailto:${profile.email}`; $('#contact-details').append(email); }
  if (profile.phone && profile.phoneLink) { const phone = text('a', profile.phone); phone.href = `tel:${profile.phoneLink}`; $('#contact-details').append(phone); }
  const themeColors = { midnight: '#111723', paper: '#f4f1e9', forest: '#13251f' };
  function setTheme(theme) {
    if (!Object.hasOwn(themeColors, theme)) theme = 'midnight';
    document.documentElement.dataset.theme = theme;
    $('meta[name="theme-color"]').content = themeColors[theme];
    document.querySelectorAll('[data-theme-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme)));
    try { localStorage.setItem('pj-portfolio-theme', theme); } catch {}
  }
  setTheme(document.documentElement.dataset.theme);
  document.querySelectorAll('[data-theme-choice]').forEach(button => button.addEventListener('click', () => setTheme(button.dataset.themeChoice)));
  const dialog = $('#details-dialog');
  function showDetails(title, description, tags = [], label = 'PROJECT PLACEHOLDER') {
    $('#dialog-title').textContent = title; $('#dialog-description').textContent = description; $('#dialog-label').textContent = label;
    $('#dialog-tags').replaceChildren(...tags.map(createBadge)); dialog.showModal();
  }
  $('#dialog-close').addEventListener('click', () => dialog.close());
  $('#dialog-done').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  const previews = {
    dashboard: '<div class="mini-window"><div class="mini-toolbar"><i></i><i></i><i></i></div><div class="mini-dashboard"><div class="mini-sidebar"></div><div class="mini-bars"><i></i><i></i><i></i><i></i><i></i></div></div></div>',
    website: '<div class="mini-site"><small>STUDIO / 01</small><div class="mini-site-body"><b>Space for<br>better ideas.</b><div class="mini-site-shape"></div></div></div>',
    tasks: '<div class="mini-task"><b>Today, with focus.</b><div><i></i><em></em></div><div><i></i><em></em></div><div><i></i><em></em></div></div>',
    weather: '<div class="mini-weather"><div class="mini-sun"></div><div><b>24°</b><small>A CLEAR DAY</small></div></div>',
    experiment: '<div class="mini-orbit"><i></i></div>',
    safety: '<div class="mini-safety"><div class="safety-symbol">+</div><div class="safety-profile"><i></i><i></i><i></i></div></div>'
  };
  profile.projects.forEach(project => {
    const group = project.group === 'professional' ? 'professional' : 'personal';
    const card = document.createElement('article'); card.className = 'project-card';
    const visual = previews[project.visual] ? project.visual : 'experiment';
    const preview = document.createElement('div'); preview.className = `project-preview preview-${visual}`;
    if (project.preview) {
      const image = document.createElement('img');
      image.src = project.preview; image.alt = `${project.title} project preview`; image.loading = 'lazy'; image.decoding = 'async';
      preview.classList.add('preview-live');
      if (project.previewFit === 'contain') preview.classList.add('preview-contain');
      preview.append(image); preview.dataset.label = project.previewLabel || 'LIVE SITE';
    } else {
      preview.setAttribute('aria-hidden', 'true'); preview.innerHTML = previews[visual];
      preview.dataset.label = project.placeholder ? 'CONCEPT' : 'PREVIEW PENDING';
    }
    const body = document.createElement('div'); body.className = 'project-body';
    const heading = document.createElement('h3'); heading.className = 'project-title';
    const url = safeUrl(project.url);
    const titleUrl = group === 'professional' ? null : url;
    const action = text(titleUrl ? 'a' : 'button', project.title, 'project-action'); action.append(text('span', '↗')); action.lastChild.setAttribute('aria-hidden', 'true');
    if (titleUrl) { action.href = titleUrl; action.target = '_blank'; action.rel = 'noopener noreferrer'; action.setAttribute('aria-label', `View ${project.title} source code (opens in a new tab)`); }
    else { action.setAttribute('aria-label', `View details for ${project.title}`); action.addEventListener('click', () => showDetails(project.title, `${project.details || project.description} ${project.placeholder ? 'This is a project concept, not completed work. Screenshots, implementation details, and links are pending.' : url ? '' : 'The project link will be added soon.'}`.trim(), project.stack || project.tags, project.placeholder ? 'PROJECT CONCEPT / NOT COMPLETED' : 'PROJECT DETAILS')); }
    heading.append(action);
    const headingRow = document.createElement('div'); headingRow.className = 'project-heading'; headingRow.append(heading);
    const tags = document.createElement('div'); tags.className = 'tags';
    if (project.stack) tags.setAttribute('aria-label', 'Technology stack');
    (project.stack || project.tags).forEach(tag => tags.append(createBadge(tag)));
    body.append(text('p', project.type, 'project-type'), headingRow, text('p', project.description, 'project-description'), tags);
    if (project.placeholder) body.append(text('span', 'Project concept · Not completed', 'placeholder-label'));
    else if (project.detailsPending) body.append(text('span', 'Project details coming soon', 'placeholder-label'));
    if (group === 'professional' && url) {
      const visit = document.createElement('a'); visit.className = 'visit-site';
      visit.href = url; visit.target = '_blank'; visit.rel = 'noopener noreferrer';
      visit.setAttribute('aria-label', `Visit ${project.title} site (opens in a new tab)`);
      visit.title = `Visit ${project.title} site`;
      visit.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/></svg>';
      visit.append(text('span', 'Visit Site', 'visit-label'));
      headingRow.append(visit);
    }
    card.append(preview, body); $(`#${group}-projects`).append(card);
  });
  ['professional', 'personal'].forEach(group => $(`#${group}-count`).textContent = String($(`#${group}-projects`).children.length).padStart(2, '0'));
  function contactPlaceholder(platform) { showDetails(`${platform} details coming soon`, `The ${platform.toLowerCase()} details haven't been added yet. Check back soon for a way to connect.`, [], 'LET’S CONNECT'); }
  function emailAction() { if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) window.location.href = `mailto:${profile.email}`; else contactPlaceholder('Email'); }
  $('#contact-action').addEventListener('click', emailAction);
  const icons = {
    GitHub: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-3c3-.3 6-1.5 6-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2S17.4 2.5 15 4a11 11 0 0 0-6 0C6.6 2.5 5.4 2.6 5.4 2.6a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9c0 4.5 3 5.7 6 6a3.5 3.5 0 0 0-1 3v4"/></svg>',
    LinkedIn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m4-7v7m0-4a3 3 0 0 1 6 0v4"/><circle cx="7" cy="7" r=".6" fill="currentColor"/></svg>',
    Email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg>',
    Portfolio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>'
  };
  [['GitHub', profile.github], ['LinkedIn', profile.linkedin], ['Portfolio', profile.portfolio], ['Email', '']].forEach(([label, value]) => {
    const url = safeUrl(value); if (!url && label !== 'Email') return;
    const control = document.createElement(url ? 'a' : 'button'); control.innerHTML = icons[label]; control.setAttribute('aria-label', label); control.title = label;
    if (url) { control.href = url; control.target = '_blank'; control.rel = 'noopener noreferrer'; }
    else control.addEventListener('click', label === 'Email' ? emailAction : () => contactPlaceholder(label));
    $('#social-links').append(control);
  });
  // Highlight the section nearest the top, including the final section at page bottom.
  const sections = [...document.querySelectorAll('.content-section')];
  const navigation = [...document.querySelectorAll('.nav-link')];
  let scrollPending = false;
  function updateNavigation() {
    let active = sections[0];
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 180) active = section; });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) active = sections[sections.length - 1];
    navigation.forEach(link => { const current = link.hash === `#${active.id}`; link.classList.toggle('active', current); if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    scrollPending = false;
  }
  window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateNavigation); } }, { passive: true });
  window.addEventListener('resize', updateNavigation); updateNavigation();
})();
