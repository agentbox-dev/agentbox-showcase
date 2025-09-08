export const themeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('theme') || 'light';
      document.documentElement.className = 'theme-' + theme;
    } catch (e) {
      document.documentElement.className = 'theme-light';
    }
  })();
`
