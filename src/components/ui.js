/**
 * Composant pour afficher les cartes de personnages
 */
export class CharacterCard {
  constructor(character, options = {}) {
    this.character = character;
    this.options = {
      showActions: true,
      onClick: null,
      onFavorite: null,
      onEdit: null,
      onDelete: null,
      ...options
    };
  }

  /**
   * Créer l'élément DOM de la carte
   */
  createElement() {
    const card = document.createElement('div');
    card.className = `character-card ${this.character.isFavorite ? 'favorite' : ''}`;
    card.setAttribute('data-id', this.character.id);
    
    // Gestion du clic sur la carte
    if (this.options.onClick) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // Ne pas déclencher le clic si on clique sur un bouton d'action
        if (!e.target.closest('.character-actions')) {
          this.options.onClick(this.character);
        }
      });
    }

    card.innerHTML = this.getCardHTML();
    
    // Ajouter les écouteurs pour les actions
    this.setupEventListeners(card);
    
    return card;
  }

  /**
   * Générer le HTML de la carte
   */
  getCardHTML() {
    const imageUrl = this.character.imageUrl || this.getDefaultImage();
    
    return `
      <div class="character-image-container">
        <img 
          src="${imageUrl}" 
          alt="${this.character.name}"
          class="character-image"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'"
        >
      </div>
      
      <div class="character-info">
        <div class="character-header">
          <div>
            <h3 class="character-name">${this.escapeHtml(this.character.name)}</h3>
            <p class="character-type">${this.escapeHtml(this.character.type)}</p>
          </div>
          <div 
            class="character-color" 
            style="background-color: ${this.character.color}"
            title="Couleur: ${this.character.color}"
          ></div>
        </div>
        
        <p class="character-description">${this.escapeHtml(this.character.description)}</p>
        
        <div class="character-meta">
          <span title="Ville d'origine">📍 ${this.escapeHtml(this.character.hometown)}</span>
          ${this.character.specialty ? `<span title="Spécialité">⚡ ${this.escapeHtml(this.character.specialty)}</span>` : ''}
        </div>
        
        ${this.options.showActions ? this.getActionsHTML() : ''}
      </div>
    `;
  }

  /**
   * Générer le HTML des actions
   */
  getActionsHTML() {
    return `
      <div class="character-actions">
        <button 
          class="btn-icon favorite ${this.character.isFavorite ? 'active' : ''}"
          data-action="favorite"
          title="${this.character.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
        >
          ${this.character.isFavorite ? '⭐' : '☆'}
        </button>
        
        <button 
          class="btn-icon"
          data-action="edit"
          title="Modifier"
        >
          ✏️
        </button>
        
        <button 
          class="btn-icon delete"
          data-action="delete"
          title="Supprimer"
        >
          🗑️
        </button>
      </div>
    `;
  }

  /**
   * Configurer les écouteurs d'événements
   */
  setupEventListeners(card) {
    if (!this.options.showActions) return;

    const actions = card.querySelectorAll('[data-action]');
    
    actions.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = button.getAttribute('data-action');
        
        switch (action) {
          case 'favorite':
            if (this.options.onFavorite) {
              this.options.onFavorite(this.character.id);
            }
            break;
          case 'edit':
            if (this.options.onEdit) {
              this.options.onEdit(this.character);
            }
            break;
          case 'delete':
            if (this.options.onDelete) {
              this.options.onDelete(this.character);
            }
            break;
        }
      });
    });
  }

  /**
   * Mettre à jour la carte avec de nouvelles données
   */
  update(newCharacter) {
    this.character = newCharacter;
    // Retourner le nouvel élément mis à jour
    return this.createElement();
  }

  /**
   * Obtenir une image par défaut basée sur le type de personnage
   */
  getDefaultImage() {
    const type = this.character.type.toLowerCase();
    
    const imageMap = {
      'voiture': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop',
      'dépanneuse': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      'porsche': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
      'hudson': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop',
      'fiat': 'https://images.unsplash.com/photo-1583747091849-ad948d080622?w=400&h=300&fit=crop',
      'chevrolet': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop'
    };
    
    // Trouver une image correspondante au type
    for (const [key, url] of Object.entries(imageMap)) {
      if (type.includes(key)) {
        return url;
      }
    }
    
    // Image par défaut
    return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop';
  }

  /**
   * Échapper le HTML pour éviter les injections XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }
}

/**
 * Composant pour afficher les détails d'un personnage
 */
export class CharacterDetails {
  constructor(character, container) {
    this.character = character;
    this.container = container;
  }

  /**
   * Afficher les détails du personnage
   */
  render() {
    if (!this.character) {
      this.hide();
      return;
    }

    this.container.style.display = 'block';
    
    const detailsContent = this.container.querySelector('#details-content');
    detailsContent.innerHTML = this.getDetailsHTML();
    
    // Ajouter une animation d'apparition
    this.container.style.opacity = '0';
    this.container.style.transform = 'translateX(20px)';
    
    requestAnimationFrame(() => {
      this.container.style.transition = 'all 0.3s ease';
      this.container.style.opacity = '1';
      this.container.style.transform = 'translateX(0)';
    });
  }

  /**
   * Masquer les détails
   */
  hide() {
    this.container.style.transition = 'all 0.3s ease';
    this.container.style.opacity = '0';
    this.container.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
      this.container.style.display = 'none';
    }, 300);
  }

  /**
   * Générer le HTML des détails
   */
  getDetailsHTML() {
    const imageUrl = this.character.imageUrl || this.getDefaultImage();
    
    return `
      <div class="details-header">
        <img 
          src="${imageUrl}" 
          alt="${this.character.name}"
          class="details-image"
          onerror="this.src='https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'"
        >
        <div class="details-title">
          <h2>${this.escapeHtml(this.character.name)}</h2>
          <p class="details-type">${this.escapeHtml(this.character.type)}</p>
        </div>
      </div>
      
      <div class="details-body">
        <div class="detail-section">
          <h3>🎨 Couleur principale</h3>
          <div class="color-preview">
            <div 
              class="color-swatch" 
              style="background-color: ${this.character.color}"
            ></div>
            <span>${this.character.color}</span>
          </div>
        </div>
        
        <div class="detail-section">
          <h3>📖 Description</h3>
          <p>${this.escapeHtml(this.character.description)}</p>
        </div>
        
        ${this.character.hometown ? `
          <div class="detail-section">
            <h3>📍 Ville d'origine</h3>
            <p>${this.escapeHtml(this.character.hometown)}</p>
          </div>
        ` : ''}
        
        ${this.character.specialty ? `
          <div class="detail-section">
            <h3>⚡ Spécialité</h3>
            <p>${this.escapeHtml(this.character.specialty)}</p>
          </div>
        ` : ''}
        
        ${this.character.year ? `
          <div class="detail-section">
            <h3>📅 Année d'apparition</h3>
            <p>${this.character.year}</p>
          </div>
        ` : ''}
        
        <div class="detail-section">
          <h3>⭐ Statut</h3>
          <p class="favorite-status ${this.character.isFavorite ? 'is-favorite' : ''}">
            ${this.character.isFavorite ? '⭐ Personnage favori' : '☆ Non favori'}
          </p>
        </div>
        
        <div class="detail-section">
          <h3>📊 Informations techniques</h3>
          <div class="tech-info">
            <div class="tech-item">
              <span class="tech-label">ID:</span>
              <span class="tech-value">${this.character.id}</span>
            </div>
            ${this.character.createdAt ? `
              <div class="tech-item">
                <span class="tech-label">Créé:</span>
                <span class="tech-value">${this.formatDate(this.character.createdAt)}</span>
              </div>
            ` : ''}
            ${this.character.updatedAt ? `
              <div class="tech-item">
                <span class="tech-label">Modifié:</span>
                <span class="tech-value">${this.formatDate(this.character.updatedAt)}</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
      
      <style>
        .details-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: var(--border-radius-lg);
          margin-bottom: var(--space-lg);
        }
        
        .details-title h2 {
          font-family: var(--font-racing);
          color: var(--primary-color);
          margin-bottom: var(--space-xs);
        }
        
        .details-type {
          color: var(--text-secondary);
          font-weight: 500;
        }
        
        .detail-section {
          margin-bottom: var(--space-xl);
          padding-bottom: var(--space-lg);
          border-bottom: 1px solid var(--border-color);
        }
        
        .detail-section:last-child {
          border-bottom: none;
        }
        
        .detail-section h3 {
          color: var(--text-primary);
          margin-bottom: var(--space-md);
          font-size: var(--font-size-lg);
        }
        
        .color-preview {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        
        .color-swatch {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          border: 2px solid var(--border-color);
        }
        
        .favorite-status.is-favorite {
          color: var(--accent-color);
          font-weight: 600;
        }
        
        .tech-info {
          display: grid;
          gap: var(--space-sm);
        }
        
        .tech-item {
          display: flex;
          justify-content: space-between;
          padding: var(--space-sm);
          background: var(--bg-tertiary);
          border-radius: var(--border-radius-sm);
        }
        
        .tech-label {
          font-weight: 500;
          color: var(--text-secondary);
        }
        
        .tech-value {
          font-family: monospace;
          color: var(--text-primary);
        }
      </style>
    `;
  }

  /**
   * Formater une date
   */
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Obtenir une image par défaut
   */
  getDefaultImage() {
    return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop';
  }

  /**
   * Échapper le HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }
}

/**
 * Gestionnaire des notifications toast
 */
export class NotificationManager {
  constructor() {
    this.container = null;
    this.notifications = new Map();
    this.init();
  }

  /**
   * Initialiser le gestionnaire de notifications
   */
  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      console.warn('Container de notifications non trouvé');
    }
  }

  /**
   * Afficher une notification
   */
  show(message, type = 'success', duration = 5000) {
    if (!this.container) return;

    const id = this.generateId();
    const toast = this.createToast(id, message, type);
    
    this.container.appendChild(toast);
    this.notifications.set(id, toast);

    // Animation d'apparition
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    // Auto-suppression
    if (duration > 0) {
      setTimeout(() => {
        this.hide(id);
      }, duration);
    }

    return id;
  }

  /**
   * Créer un élément toast
   */
  createToast(id, message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('data-id', id);
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s ease';

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${this.escapeHtml(message)}</span>
      </div>
      <button class="toast-close" aria-label="Fermer">✖️</button>
    `;

    // Écouteur pour le bouton de fermeture
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.hide(id);
    });

    return toast;
  }

  /**
   * Masquer une notification
   */
  hide(id) {
    const toast = this.notifications.get(id);
    if (toast) {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        this.notifications.delete(id);
      }, 300);
    }
  }

  /**
   * Méthodes de raccourci pour différents types
   */
  success(message, duration = 5000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 7000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 6000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 5000) {
    return this.show(message, 'info', duration);
  }

  /**
   * Effacer toutes les notifications
   */
  clearAll() {
    this.notifications.forEach((_, id) => {
      this.hide(id);
    });
  }

  /**
   * Générer un ID unique
   */
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Échapper le HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }
}