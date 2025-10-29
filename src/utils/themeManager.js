// Gestionnaire simple pour le thème clair/sombre
export class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.init();
  }

  // Initialiser le thème
  init() {
    // Charger le thème sauvegardé
    const saved = localStorage.getItem('cars_theme');
    if (saved) {
      this.currentTheme = saved;
    }
    
    // Appliquer le thème
    this.applyTheme(this.currentTheme);
    
    // Écouter le clic sur le bouton
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggleTheme());
    }
  }

  // Changer de thème
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('cars_theme', this.currentTheme);
  }

  // Appliquer le thème sur la page
  applyTheme(theme) {
    document.documentElement.style.colorScheme = theme;
    
    // Changer l'icône du bouton
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const icon = btn.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    }
  }
}