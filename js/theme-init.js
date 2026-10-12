(() => {
  let saved;
  try { saved = localStorage.getItem('numteach-theme'); } catch { /* Storage may be unavailable. */ }
  const dark = saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
})();
