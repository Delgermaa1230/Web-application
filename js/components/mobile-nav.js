const header = document.querySelector('body > header');

if (header) {
  const icons = {
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4"/><path d="M12 17h.01"/>',
    heart: '<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    teach: '<path d="M3 5h18v12H3z"/><path d="M8 21h8M12 17v4M7 10h10M12 7v6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v2"/>',
  };
  const icon = name => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none"
    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${icons[name]}</svg>`;
  const links = [
    ['/pages/question.html', 'Тусламж', 'help'],
    ['/pages/lovedTeachers.html', 'Хадгалсан багш', 'heart'],
    ['/pages/becomeTeacher.html', 'Багш болох', 'teach'],
    ['/pages/profile.html', 'Профайл', 'user'],
  ];
  const linkMarkup = () => links.map(([href, label, symbol]) =>
    `<a href="${href}">${icon(symbol)}<span>${label}</span></a>`).join('');
  header.className = 'site-header';
  header.innerHTML = `
    <a class="site-logo" href="/index.html">Numteach</a>
    <nav class="site-nav" aria-label="Үндсэн цэс">${linkMarkup()}</nav>
    <button class="theme-toggle" type="button" aria-pressed="false"></button>
    <button class="site-menu-toggle" type="button" aria-label="Цэс нээх"
      aria-controls="site-drawer" aria-expanded="false">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
    </button>
    <nav id="site-drawer" class="site-drawer" aria-label="Мобайл цэс" hidden>${linkMarkup()}</nav>`;
  const button = header.querySelector('.site-menu-toggle');
  const drawer = header.querySelector('.site-drawer');
  const themeButton = header.querySelector('.theme-toggle');
  const themeIcon = dark => dark
    ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
    : '<path d="M20.9 13a9 9 0 0 1-9.9-9.9A9 9 0 1 0 20.9 13Z"/>';
  function updateThemeButton() {
    const dark = document.documentElement.dataset.theme === 'dark';
    const label = dark ? 'Гэрэл горимд шилжих' : 'Харанхуй горимд шилжих';
    themeButton.setAttribute('aria-label', label);
    themeButton.setAttribute('title', label);
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"
      stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true">${themeIcon(dark)}</svg>`;
  }
  updateThemeButton();
  themeButton.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('numteach-theme', next); } catch { /* Keep the current page setting. */ }
    updateThemeButton();
  });
  function close() {
    drawer.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Цэс нээх');
  }
  button.addEventListener('click', () => {
    drawer.hidden = !drawer.hidden;
    button.setAttribute('aria-expanded', String(!drawer.hidden));
    button.setAttribute('aria-label', drawer.hidden ? 'Цэс нээх' : 'Цэс хаах');
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  drawer.addEventListener('click', event => { if (event.target.closest('a')) close(); });
}
