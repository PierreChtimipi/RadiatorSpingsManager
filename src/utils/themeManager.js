/**
 * Gestionnaire de thème pour basculer entre mode clair et sombre
 */
export class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.themeToggleBtn = null;
    this.storageKey = 'cars_theme_preference';
    
    // Initialiser le thème au chargement
    this.init();
  }

  /**
   * Initialiser le gestionnaire de thème
   */
  init() {
    // Charger le thème sauvegardé ou détecter la préférence système
    this.loadSavedTheme();
    
    // Appliquer le thème initial
    this.applyTheme(this.currentTheme);
    
    // Configurer les écouteurs d'événements
    this.setupEventListeners();
    
    // Écouter les changements de préférence système
    this.watchSystemPreference();
  }

  /**
   * Charger le thème sauvegardé depuis localStorage
   */
  loadSavedTheme() {
    const savedTheme = localStorage.getItem(this.storageKey);
    
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      this.currentTheme = savedTheme;
    } else {
      // Détecter la préférence système par défaut
      this.currentTheme = this.getSystemPreference();
    }
  }

  /**
   * Obtenir la préférence système
   */
  getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Surveiller les changements de préférence système
   */
  watchSystemPreference() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Écouter les changements
      mediaQuery.addEventListener('change', (e) => {
        if (this.currentTheme === 'auto') {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  /**
   * Configurer les écouteurs d'événements
   */
  setupEventListeners() {
    // Bouton de bascule de thème
    this.themeToggleBtn = document.getElementById('theme-toggle');
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Raccourci clavier pour basculer le thème
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  /**
   * Basculer entre les thèmes
   */
  toggleTheme() {
    const themes = ['light', 'dark'];
    const currentIndex = themes.indexOf(this.getEffectiveTheme());
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    this.setTheme(nextTheme);
  }

  /**
   * Définir un thème spécifique
   */
  setTheme(theme) {
    if (!['light', 'dark', 'auto'].includes(theme)) {
      console.warn(`Thème non valide: ${theme}`);
      return;
    }

    this.currentTheme = theme;
    
    // Appliquer le thème effectif
    const effectiveTheme = this.getEffectiveTheme();
    this.applyTheme(effectiveTheme);
    
    // Sauvegarder la préférence
    this.saveThemePreference();
    
    // Émettre un événement personnalisé
    this.emitThemeChange(effectiveTheme);
  }

  /**
   * Obtenir le thème effectif (résoudre 'auto' en 'light' ou 'dark')
   */
  getEffectiveTheme() {
    if (this.currentTheme === 'auto') {
      return this.getSystemPreference();
    }
    return this.currentTheme;
  }

  /**
   * Appliquer le thème au DOM
   */
  applyTheme(theme) {
    const html = document.documentElement;
    
    // Supprimer l'ancien thème
    html.removeAttribute('data-theme');
    
    // Ajouter le nouveau thème
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    }
    
    // Mettre à jour l'icône du bouton de bascule
    this.updateThemeToggleIcon(theme);
    
    // Mettre à jour la meta tag pour la couleur de la barre d'état
    this.updateStatusBarColor(theme);
  }

  /**
   * Mettre à jour l'icône du bouton de bascule
   */
  updateThemeToggleIcon(theme) {
    if (this.themeToggleBtn) {
      const iconElement = this.themeToggleBtn.querySelector('.theme-icon');
      if (iconElement) {
        iconElement.textContent = theme === 'dark' ? '🛌' : '💡';
      }
      
      // Mettre à jour l'attribut aria-label pour l'accessibilité
      const newLabel = theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre';
      this.themeToggleBtn.setAttribute('aria-label', newLabel);
    }
  }

  /**
   * Mettre à jour la couleur de la barre d'état mobile
   */
  updateStatusBarColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    const colors = {
      light: '#FFFFFF',
      dark: '#1A1A2E'
    };
    
    metaThemeColor.content = colors[theme] || colors.light;
  }

  /**
   * Sauvegarder la préférence de thème
   */
  saveThemePreference() {
    try {
      localStorage.setItem(this.storageKey, this.currentTheme);
    } catch (error) {
      console.error('Impossible de sauvegarder la préférence de thème:', error);
    }
  }

  /**
   * Émettre un événement de changement de thème
   */
  emitThemeChange(theme) {
    const event = new CustomEvent('themeChanged', {
      detail: {
        theme: theme,
        timestamp: new Date().toISOString()
      }
    });
    
    document.dispatchEvent(event);
  }

  /**
   * Obtenir le thème actuel
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Obtenir le thème effectif actuel
   */
  getEffectiveCurrentTheme() {
    return this.getEffectiveTheme();
  }

  /**
   * Vérifier si le mode sombre est actif
   */
  isDarkMode() {
    return this.getEffectiveTheme() === 'dark';
  }

  /**
   * Ajouter des styles CSS dynamiques pour les transitions de thème
   */
  enableThemeTransitions() {
    const transitionCSS = `
      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = transitionCSS;
    document.head.appendChild(styleElement);
    
    // Désactiver les transitions après le changement initial
    setTimeout(() => {
      styleElement.remove();
    }, 300);
  }

  /**
   * Obtenir les couleurs du thème actuel
   */
  getCurrentColors() {
    const computedStyle = getComputedStyle(document.documentElement);
    
    return {
      primary: computedStyle.getPropertyValue('--primary-color').trim(),
      secondary: computedStyle.getPropertyValue('--secondary-color').trim(),
      background: computedStyle.getPropertyValue('--bg-primary').trim(),
      text: computedStyle.getPropertyValue('--text-primary').trim(),
      border: computedStyle.getPropertyValue('--border-color').trim()
    };
  }

  /**
   * Réinitialiser le thème aux valeurs par défaut
   */
  resetToDefault() {
    this.setTheme('light');
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Exporter la configuration du thème
   */
  exportConfig() {
    return {
      currentTheme: this.currentTheme,
      effectiveTheme: this.getEffectiveTheme(),
      systemPreference: this.getSystemPreference(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Importer une configuration de thème
   */
  importConfig(config) {
    if (config && config.currentTheme) {
      this.setTheme(config.currentTheme);
      return true;
    }
    return false;
  }
}