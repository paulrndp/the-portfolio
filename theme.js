// Apply a saved theme before styles paint, including on GitHub Pages.
(() => {
  const themes = ['midnight', 'paper', 'forest'];
  let theme = 'midnight';
  try { const saved = localStorage.getItem('pj-portfolio-theme'); if (themes.includes(saved)) theme = saved; } catch {}
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = { midnight: '#111723', paper: '#f4f1e9', forest: '#13251f' }[theme];
})();
