/**
 * Service de stockage local pour la persistance des données
 */
export class StorageService {
  static KEYS = {
    CHARACTERS: 'cars_characters',
    THEME: 'cars_theme',
    FAVORITES: 'cars_favorites',
    PREFERENCES: 'cars_preferences'
  };

  /**
   * Sauvegarder des données dans le localStorage
   */
  static save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  }

  /**
   * Charger des données depuis le localStorage
   */
  static load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      return defaultValue;
    }
  }

  /**
   * Supprimer des données du localStorage
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
  }

  /**
   * Vérifier si une clé existe
   */
  static exists(key) {
    return localStorage.getItem(key) !== null;
  }
}

/**
 * Gestionnaire d'événements personnalisés pour la communication entre composants
 */
export class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  /**
   * S'abonner à un événement
   */
  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(callback);
  }

  /**
   * Se désabonner d'un événement
   */
  off(eventName, callback) {
    if (this.events.has(eventName)) {
      const callbacks = this.events.get(eventName);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Émettre un événement
   */
  emit(eventName, data = null) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Erreur dans le callback de l'événement ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * S'abonner à un événement une seule fois
   */
  once(eventName, callback) {
    const wrappedCallback = (data) => {
      callback(data);
      this.off(eventName, wrappedCallback);
    };
    this.on(eventName, wrappedCallback);
  }
}

/**
 * Système de Proxy pour synchroniser automatiquement les données avec le DOM
 */
export class ReactiveDataManager {
  constructor(initialData = []) {
    this.eventEmitter = new EventEmitter();
    
    // Capturer 'this' pour l'utiliser dans les handlers du Proxy
    const self = this;
    
    // Créer un proxy pour détecter automatiquement les changements
    this.data = new Proxy(initialData, {
      get: (target, property) => {
        // Retourner la valeur normale pour les propriétés existantes
        if (property in target || typeof property === 'symbol') {
          return target[property];
        }
        
        // Méthodes personnalisées du gestionnaire de données
        if (property === 'add') {
          return self.addItem.bind(self);
        }
        if (property === 'update') {
          return self.updateItem.bind(self);
        }
        if (property === 'remove') {
          return self.removeItem.bind(self);
        }
        if (property === 'clear') {
          return self.clearAll.bind(self);
        }
        if (property === 'filter') {
          return self.filterItems.bind(self);
        }
        if (property === 'search') {
          return self.searchItems.bind(self);
        }
        if (property === 'on') {
          return self.eventEmitter.on.bind(self.eventEmitter);
        }
        if (property === 'off') {
          return self.eventEmitter.off.bind(self.eventEmitter);
        }
        if (property === 'emit') {
          return self.eventEmitter.emit.bind(self.eventEmitter);
        }
        
        return target[property];
      },
      
      set: (target, property, value) => {
        const oldValue = target[property];
        target[property] = value;
        
        // Émettre l'événement de changement
        self.eventEmitter.emit('change', {
          type: 'set',
          property,
          oldValue,
          newValue: value,
          target: target
        });
        
        // Sauvegarder automatiquement
        self.saveToStorage();
        
        return true;
      },
      
      deleteProperty: (target, property) => {
        const oldValue = target[property];
        delete target[property];
        
        // Émettre l'événement de changement
        self.eventEmitter.emit('change', {
          type: 'delete',
          property,
          oldValue,
          target: target
        });
        
        // Sauvegarder automatiquement
        self.saveToStorage();
        
        return true;
      }
    });
  }

  /**
   * S'abonner à un événement
   */
  on(eventName, callback) {
    return this.eventEmitter.on(eventName, callback);
  }

  /**
   * Se désabonner d'un événement
   */
  off(eventName, callback) {
    return this.eventEmitter.off(eventName, callback);
  }

  /**
   * Émettre un événement
   */
  emit(eventName, data) {
    return this.eventEmitter.emit(eventName, data);
  }

  /**
   * Alias pour addItem (compatibilité avec le Proxy)
   */
  add(item) {
    return this.addItem(item);
  }

  /**
   * Alias pour updateItem (compatibilité avec le Proxy)
   */
  update(id, updates) {
    return this.updateItem(id, updates);
  }

  /**
   * Alias pour removeItem (compatibilité avec le Proxy)
   */
  remove(id) {
    return this.removeItem(id);
  }

  /**
   * Alias pour clearAll (compatibilité avec le Proxy)
   */
  clear() {
    return this.clearAll();
  }

  /**
   * Alias pour filterItems (compatibilité avec le Proxy)
   */
  filter(predicate) {
    return this.filterItems(predicate);
  }

  /**
   * Alias pour searchItems (compatibilité avec le Proxy)
   */
  search(query, fields = []) {
    return this.searchItems(query, fields);
  }

  /**
   * Ajouter un élément
   */
  addItem(item) {
    const newItem = {
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    
    this.data.push(newItem);
    
    this.eventEmitter.emit('itemAdded', newItem);
    this.eventEmitter.emit('change', {
      type: 'add',
      item: newItem,
      target: this.data
    });
    
    return newItem;
  }

  /**
   * Mettre à jour un élément
   */
  updateItem(id, updates) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    const oldItem = { ...this.data[index] };
    this.data[index] = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.eventEmitter.emit('itemUpdated', {
      oldItem,
      newItem: this.data[index]
    });
    
    this.eventEmitter.emit('change', {
      type: 'update',
      id,
      oldItem,
      newItem: this.data[index],
      target: this.data
    });
    
    return this.data[index];
  }

  /**
   * Supprimer un élément
   */
  removeItem(id) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    const removedItem = this.data[index];
    this.data.splice(index, 1);
    
    this.eventEmitter.emit('itemRemoved', removedItem);
    this.eventEmitter.emit('change', {
      type: 'remove',
      item: removedItem,
      target: this.data
    });
    
    return removedItem;
  }

  /**
   * Vider toutes les données
   */
  clearAll() {
    const oldData = [...this.data];
    this.data.length = 0;
    
    this.eventEmitter.emit('cleared', oldData);
    this.eventEmitter.emit('change', {
      type: 'clear',
      oldData,
      target: this.data
    });
  }

  /**
   * Filtrer les éléments
   */
  filterItems(predicate) {
    return this.data.filter(predicate);
  }

  /**
   * Rechercher dans les éléments
   */
  searchItems(query, fields = []) {
    if (!query) return [...this.data];
    
    const lowercaseQuery = query.toLowerCase();
    
    return this.data.filter(item => {
      // Si aucun champ spécifié, rechercher dans tous les champs string
      if (fields.length === 0) {
        return Object.values(item).some(value => 
          typeof value === 'string' && 
          value.toLowerCase().includes(lowercaseQuery)
        );
      }
      
      // Rechercher dans les champs spécifiés
      return fields.some(field => {
        const value = item[field];
        return typeof value === 'string' && 
               value.toLowerCase().includes(lowercaseQuery);
      });
    });
  }

  /**
   * Obtenir un élément par ID
   */
  getById(id) {
    return this.data.find(item => item.id === id);
  }

  /**
   * Obtenir tous les éléments
   */
  getAll() {
    return [...this.data];
  }

  /**
   * Générer un ID unique
   */
  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Sauvegarder dans le localStorage
   */
  saveToStorage() {
    StorageService.save(StorageService.KEYS.CHARACTERS, this.data);
  }

  /**
   * Charger depuis le localStorage
   */
  loadFromStorage() {
    const savedData = StorageService.load(StorageService.KEYS.CHARACTERS, []);
    if (savedData.length > 0) {
      // Vider les données actuelles et charger les données sauvegardées
      this.data.length = 0;
      savedData.forEach(item => this.data.push(item));
      
      // Émettre l'événement de chargement
      this.eventEmitter.emit('loaded', savedData);
    }
  }

  /**
   * Réinitialiser avec des données par défaut
   */
  resetToDefault(defaultData) {
    this.data.length = 0;
    defaultData.forEach(item => this.data.push(item));
    this.saveToStorage();
    
    this.eventEmitter.emit('reset', defaultData);
    this.eventEmitter.emit('change', {
      type: 'reset',
      data: defaultData,
      target: this.data
    });
  }

  /**
   * Valider les données
   */
  validate(item, rules = {}) {
    const errors = {};
    
    // Règles de validation de base
    if (rules.required) {
      rules.required.forEach(field => {
        if (!item[field] || (typeof item[field] === 'string' && item[field].trim() === '')) {
          errors[field] = `Le champ ${field} est requis`;
        }
      });
    }
    
    if (rules.minLength) {
      Object.entries(rules.minLength).forEach(([field, min]) => {
        if (item[field] && item[field].length < min) {
          errors[field] = `Le champ ${field} doit contenir au moins ${min} caractères`;
        }
      });
    }
    
    if (rules.maxLength) {
      Object.entries(rules.maxLength).forEach(([field, max]) => {
        if (item[field] && item[field].length > max) {
          errors[field] = `Le champ ${field} ne peut pas dépasser ${max} caractères`;
        }
      });
    }
    
    if (rules.unique) {
      rules.unique.forEach(field => {
        const exists = this.data.some(existing => 
          existing.id !== item.id && existing[field] === item[field]
        );
        if (exists) {
          errors[field] = `Cette valeur pour ${field} existe déjà`;
        }
      });
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}