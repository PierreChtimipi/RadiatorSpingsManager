/**
 * Application principale Cars Character Manager
 * Orchestre tous les composants et fonctionnalités
 */

import { carsCharacters, CarsDataManager } from './data/characters.js';
import { ReactiveDataManager, StorageService } from './utils/dataManager.js';
import { ThemeManager } from './utils/themeManager.js';
import { CharacterCard, CharacterDetails, NotificationManager } from './components/ui.js';
import { CharacterFormManager } from './components/formManager.js';

class CarsApp {
  constructor() {
    // Gestionnaires principaux
    this.dataManager = new ReactiveDataManager();
    this.themeManager = new ThemeManager();
    this.notificationManager = new NotificationManager();
    
    // Composants UI
    this.characterDetails = null;
    this.formManager = null;
    
    // Éléments DOM
    this.elements = {};
    
    // État de l'application
    this.state = {
      searchQuery: '',
      selectedFilter: '',
      showFavoritesOnly: false,
      currentCharacter: null
    };

    // Initialiser l'application
    this.init();
  }

  /**
   * Initialiser l'application
   */
  async init() {
    try {
      // Attendre que le DOM soit prêt
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Initialiser les composants
      this.initializeElements();
      this.initializeDataManager();
      this.initializeFormManager();
      this.initializeEventListeners();
      this.initializeCharacterDetails();
      this.initializeScrollToTop();
      
      // Charger les données initiales
      await this.loadInitialData();
      
      // Rendu initial
      this.renderCharacters();
      this.updateStats();
      
      // Animation de chargement terminée
      this.showLoadedState();
      
      console.log('🏎️ Cars Character Manager initialisé avec succès!');
      this.notificationManager.success('Application chargée avec succès! 🏎️');
      
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      this.notificationManager.error('Erreur lors du chargement de l\'application');
    }
  }

  /**
   * Référencer les éléments DOM importants
   */
  initializeElements() {
    this.elements = {
      // Containers
      charactersGrid: document.getElementById('characters-grid'),
      noResults: document.getElementById('no-results'),
      
      // Recherche et filtres
      searchInput: document.getElementById('search-input'),
      clearSearchBtn: document.getElementById('clear-search'),
      typeFilter: document.getElementById('type-filter'),
      favoritesToggle: document.getElementById('favorites-toggle'),
      characterCount: document.getElementById('character-count'),
      
      // Modals
      characterModal: document.getElementById('character-modal'),
      modalOverlay: document.getElementById('modal-overlay'),
      modalClose: document.getElementById('modal-close'),
      deleteModal: document.getElementById('delete-modal'),
      
      // Modal de détails
      detailsModal: document.getElementById('character-details-modal'),
      detailsModalOverlay: document.getElementById('details-modal-overlay'),
      detailsContent: document.getElementById('details-content'),
      
      // Formulaire
      characterForm: document.getElementById('character-form'),
      
      // Boutons
      addCharacterBtn: document.getElementById('add-character-btn'),
      closeDetailsBtn: document.getElementById('close-details'),
      scrollToTopBtn: document.getElementById('scroll-to-top')
    };

    // Vérifier que les éléments essentiels sont présents
    const essentialElements = ['charactersGrid', 'searchInput', 'characterForm'];
    essentialElements.forEach(key => {
      if (!this.elements[key]) {
        throw new Error(`Élément essentiel manquant: ${key}`);
      }
    });
  }

  /**
   * Initialiser le gestionnaire de données avec Proxy
   */
  initializeDataManager() {
    // Écouter les changements de données
    this.dataManager.on('change', (changeData) => {
      console.log('Changement de données détecté:', changeData);
      this.handleDataChange(changeData);
    });

    this.dataManager.on('itemAdded', (character) => {
      this.notificationManager.success(`${character.name} a été ajouté avec succès! 🎉`);
    });

    this.dataManager.on('itemUpdated', ({ newItem }) => {
      this.notificationManager.success(`${newItem.name} a été modifié avec succès! ✏️`);
    });

    this.dataManager.on('itemRemoved', (character) => {
      this.notificationManager.success(`${character.name} a été supprimé avec succès! 🗑️`);
    });
  }

  /**
   * Initialiser le gestionnaire de formulaire
   */
  initializeFormManager() {
    this.formManager = new CharacterFormManager(this.elements.characterForm, {
      onSubmit: (data, isEdit) => this.handleFormSubmit(data, isEdit),
      onCancel: () => this.hideModal()
    });
  }

  /**
   * Initialiser les détails des personnages
   */
  initializeCharacterDetails() {
    this.characterDetails = new CharacterDetails(null, this.elements.detailsContent);
    
    if (this.elements.closeDetailsBtn) {
      this.elements.closeDetailsBtn.addEventListener('click', () => {
        this.hideCharacterDetails();
      });
    }

    if (this.elements.detailsModalOverlay) {
      this.elements.detailsModalOverlay.addEventListener('click', () => {
        this.hideCharacterDetails();
      });
    }
  }

  /**
   * Configurer tous les écouteurs d'événements
   */
  initializeEventListeners() {
    // Recherche
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value;
        this.debounce(() => this.filterAndRenderCharacters(), 300);
      });
    }

    if (this.elements.clearSearchBtn) {
      this.elements.clearSearchBtn.addEventListener('click', () => {
        this.elements.searchInput.value = '';
        this.state.searchQuery = '';
        this.filterAndRenderCharacters();
      });
    }

    // Filtres
    if (this.elements.typeFilter) {
      this.elements.typeFilter.addEventListener('change', (e) => {
        this.state.selectedFilter = e.target.value;
        this.filterAndRenderCharacters();
      });
    }

    if (this.elements.favoritesToggle) {
      this.elements.favoritesToggle.addEventListener('click', () => {
        this.toggleFavoritesFilter();
      });
    }

    // Modal
    if (this.elements.addCharacterBtn) {
      this.elements.addCharacterBtn.addEventListener('click', () => {
        this.showAddCharacterModal();
      });
    }

    if (this.elements.modalClose) {
      this.elements.modalClose.addEventListener('click', () => {
        this.hideModal();
      });
    }

    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.addEventListener('click', () => {
        this.hideModal();
      });
    }

    // Modal de suppression
    this.initializeDeleteModal();

    // Raccourcis clavier
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Écouter les changements de thème
    document.addEventListener('themeChanged', (e) => {
      console.log('Thème changé:', e.detail.theme);
    });
  }

  /**
   * Initialiser le bouton de retour en haut
   */
  initializeScrollToTop() {
    if (this.elements.scrollToTopBtn) {
      // Afficher/masquer selon le scroll
      window.addEventListener('scroll', () => {
        const shouldShow = window.scrollY > 300;
        this.elements.scrollToTopBtn.style.display = shouldShow ? 'block' : 'none';
      });

      // Gérer le clic
      this.elements.scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  /**
   * Charger les données initiales
   */
  async loadInitialData() {
    // Vérifier s'il y a des données sauvegardées
    const savedCharacters = StorageService.load(StorageService.KEYS.CHARACTERS, []);
    
    if (savedCharacters.length === 0) {
      // Première visite : charger les données par défaut
      console.log('Chargement des données par défaut...');
      this.dataManager.resetToDefault(carsCharacters);
      this.notificationManager.info('Données par défaut chargées. Bienvenue! 👋');
    } else {
      // Charger les données sauvegardées
      console.log('Chargement des données sauvegardées...');
      this.dataManager.loadFromStorage();
    }
  }

  /**
   * Gérer les changements de données (grâce au Proxy)
   */
  handleDataChange(changeData) {
    // Re-rendre les personnages après chaque changement
    this.renderCharacters();
    this.updateStats();
    
    // Mettre à jour les détails si nécessaire
    if (this.state.currentCharacter) {
      const updatedCharacter = this.dataManager.getById(this.state.currentCharacter.id);
      if (updatedCharacter) {
        this.state.currentCharacter = updatedCharacter;
        this.characterDetails.character = updatedCharacter;
        this.characterDetails.render();
      } else {
        // Le personnage a été supprimé
        this.hideCharacterDetails();
      }
    }
  }

  /**
   * Filtrer et rendre les personnages
   */
  filterAndRenderCharacters() {
    let characters = this.dataManager.getAll();

    // Appliquer la recherche
    if (this.state.searchQuery) {
      characters = this.dataManager.searchItems(this.state.searchQuery, ['name', 'type', 'hometown', 'specialty']);
    }

    // Appliquer le filtre par type
    if (this.state.selectedFilter) {
      characters = characters.filter(char => 
        char.type.toLowerCase().includes(this.state.selectedFilter.toLowerCase())
      );
    }

    // Appliquer le filtre favoris
    if (this.state.showFavoritesOnly) {
      characters = characters.filter(char => char.isFavorite);
    }

    this.renderCharacters(characters);
  }

  /**
   * Rendre la liste des personnages
   */
  renderCharacters(characters = null) {
    if (!characters) {
      characters = this.dataManager.getAll();
    }

    // Effacer la grille actuelle
    this.elements.charactersGrid.innerHTML = '';

    if (characters.length === 0) {
      this.showNoResults();
      return;
    }

    this.hideNoResults();

    // Créer et ajouter les cartes
    characters.forEach(character => {
      const card = new CharacterCard(character, {
        onClick: (char) => this.showCharacterDetails(char),
        onFavorite: (id) => this.toggleFavorite(id),
        onEdit: (char) => this.showEditCharacterModal(char),
        onDelete: (char) => this.showDeleteConfirmation(char)
      });

      const cardElement = card.createElement();
      this.elements.charactersGrid.appendChild(cardElement);

      // Animation d'apparition
      requestAnimationFrame(() => {
        cardElement.style.animation = 'fadeInUp 0.5s ease forwards';
      });
    });

    this.updateStats(characters.length);
  }

  /**
   * Afficher/masquer l'état "aucun résultat"
   */
  showNoResults() {
    this.elements.noResults.style.display = 'block';
    this.elements.charactersGrid.style.display = 'none';
  }

  hideNoResults() {
    this.elements.noResults.style.display = 'none';
    this.elements.charactersGrid.style.display = 'grid';
  }

  /**
   * Mettre à jour les statistiques
   */
  updateStats(count = null) {
    if (count === null) {
      count = this.dataManager.getAll().length;
    }

    if (this.elements.characterCount) {
      const text = count === 1 ? '1 personnage' : `${count} personnages`;
      this.elements.characterCount.textContent = text;
    }
  }

  /**
   * Basculer le filtre favoris
   */
  toggleFavoritesFilter() {
    this.state.showFavoritesOnly = !this.state.showFavoritesOnly;
    
    if (this.elements.favoritesToggle) {
      if (this.state.showFavoritesOnly) {
        this.elements.favoritesToggle.classList.add('active');
        this.elements.favoritesToggle.textContent = '⭐ Tous les personnages';
      } else {
        this.elements.favoritesToggle.classList.remove('active');
        this.elements.favoritesToggle.textContent = '⭐ Favoris uniquement';
      }
    }

    this.filterAndRenderCharacters();
  }

  /**
   * Basculer le statut favori d'un personnage
   */
  toggleFavorite(characterId) {
    const character = this.dataManager.getById(characterId);
    if (character) {
      this.dataManager.update(characterId, { 
        isFavorite: !character.isFavorite 
      });
    }
  }

  /**
   * Afficher les détails d'un personnage
   */
  showCharacterDetails(character) {
    this.state.currentCharacter = character;
    this.characterDetails.character = character;
    this.characterDetails.render();
    
    // Afficher le modal
    if (this.elements.detailsModal) {
      this.elements.detailsModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Animation d'entrée
      setTimeout(() => {
        this.elements.detailsModal.classList.add('show');
      }, 10);
    }
  }

  /**
   * Masquer les détails du personnage
   */
  hideCharacterDetails() {
    this.state.currentCharacter = null;
    
    // Masquer le modal avec animation
    if (this.elements.detailsModal) {
      this.elements.detailsModal.classList.remove('show');
      document.body.style.overflow = '';
      
      setTimeout(() => {
        this.elements.detailsModal.style.display = 'none';
        this.characterDetails.hide();
      }, 300);
    }
  }

  /**
   * Afficher le modal d'ajout
   */
  showAddCharacterModal() {
    this.formManager.resetForAdd();
    this.showModal();
  }

  /**
   * Afficher le modal d'édition
   */
  showEditCharacterModal(character) {
    this.formManager.populateForm(character);
    this.showModal();
  }

  /**
   * Afficher/masquer le modal
   */
  showModal() {
    if (this.elements.characterModal) {
      this.elements.characterModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Animation d'ouverture
      requestAnimationFrame(() => {
        this.elements.characterModal.style.opacity = '1';
      });
    }
  }

  hideModal() {
    if (this.elements.characterModal) {
      this.elements.characterModal.style.opacity = '0';
      
      setTimeout(() => {
        this.elements.characterModal.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
    }
  }

  /**
   * Gérer la soumission du formulaire
   */
  async handleFormSubmit(data, isEdit) {
    try {
      this.formManager.setLoading(true);

      if (isEdit) {
        // Modifier le personnage existant
        this.dataManager.update(data.id, data);
      } else {
        // Ajouter un nouveau personnage
        this.dataManager.add(data);
      }

      this.hideModal();
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      this.notificationManager.error('Erreur lors de la sauvegarde');
    } finally {
      this.formManager.setLoading(false);
    }
  }

  /**
   * Initialiser le modal de suppression
   */
  initializeDeleteModal() {
    const deleteModal = this.elements.deleteModal;
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');

    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => {
        this.confirmDelete();
      });
    }

    if (cancelDeleteBtn) {
      cancelDeleteBtn.addEventListener('click', () => {
        this.hideDeleteModal();
      });
    }
  }

  /**
   * Afficher la confirmation de suppression
   */
  showDeleteConfirmation(character) {
    this.characterToDelete = character;
    
    const nameElement = document.getElementById('delete-character-name');
    if (nameElement) {
      nameElement.textContent = character.name;
    }

    if (this.elements.deleteModal) {
      this.elements.deleteModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Confirmer la suppression
   */
  confirmDelete() {
    if (this.characterToDelete) {
      this.dataManager.remove(this.characterToDelete.id);
      this.hideDeleteModal();
      this.characterToDelete = null;
    }
  }

  /**
   * Masquer le modal de suppression
   */
  hideDeleteModal() {
    if (this.elements.deleteModal) {
      this.elements.deleteModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  /**
   * Gérer les raccourcis clavier
   */
  handleKeyboardShortcuts(e) {
    // Échap pour fermer les modals
    if (e.key === 'Escape') {
      this.hideModal();
      this.hideDeleteModal();
      this.hideCharacterDetails();
    }

    // Ctrl+N pour nouveau personnage
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      this.showAddCharacterModal();
    }

    // Ctrl+F pour focus sur la recherche
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      this.elements.searchInput.focus();
    }
  }

  /**
   * Fonction debounce pour optimiser les performances
   */
  debounce(func, delay) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(func, delay);
  }

  /**
   * Afficher l'état chargé de l'application
   */
  showLoadedState() {
    document.body.classList.add('loaded');
    
    // Supprimer les indicateurs de chargement s'ils existent
    const loaders = document.querySelectorAll('.loading, .loader');
    loaders.forEach(loader => loader.remove());
  }

  /**
   * Obtenir des statistiques sur l'application
   */
  getAppStats() {
    const allCharacters = this.dataManager.getAll();
    const favorites = allCharacters.filter(c => c.isFavorite);
    
    return {
      totalCharacters: allCharacters.length,
      favoriteCharacters: favorites.length,
      uniqueTypes: [...new Set(allCharacters.map(c => c.type))].length,
      uniqueHometowns: [...new Set(allCharacters.map(c => c.hometown))].length,
      currentTheme: this.themeManager.getCurrentTheme(),
      lastUpdate: new Date().toISOString()
    };
  }

  /**
   * Exporter les données de l'application
   */
  exportData() {
    return {
      characters: this.dataManager.getAll(),
      theme: this.themeManager.exportConfig(),
      stats: this.getAppStats(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Réinitialiser l'application aux données par défaut
   */
  resetToDefaults() {
    if (confirm('Voulez-vous vraiment réinitialiser toutes les données ? Cette action est irréversible.')) {
      this.dataManager.resetToDefault(carsCharacters);
      this.themeManager.resetToDefault();
      this.notificationManager.success('Application réinitialisée aux valeurs par défaut');
      
      // Réinitialiser l'état
      this.state.searchQuery = '';
      this.state.selectedFilter = '';
      this.state.showFavoritesOnly = false;
      
      // Réinitialiser l'UI
      this.elements.searchInput.value = '';
      this.elements.typeFilter.value = '';
      this.hideCharacterDetails();
    }
  }
}

// Initialiser l'application quand le DOM est prêt
const app = new CarsApp();

// Exposer l'app globalement pour le debugging
window.CarsApp = app;

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
  console.error('Erreur globale:', e.error);
  if (app.notificationManager) {
    app.notificationManager.error('Une erreur inattendue s\'est produite');
  }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Promise rejetée:', e.reason);
  if (app.notificationManager) {
    app.notificationManager.error('Erreur lors d\'une opération asynchrone');
  }
});

export default app;