// Import du service API
import { ApiService } from './apiService.js';

// ===== localStorage =====
export class StorageService {
  static KEYS = {
    CHARACTERS: 'cars_characters'
  };

  // Sauvegarder dans localStorage
  static async save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      // Simuler un appel API pour la sauvegarde
      await ApiService.saveCharacters(data);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  }

  // Charger depuis localStorage
  static load(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur chargement:', error);
      return [];
    }
  }

  // Charger depuis API (pour démonstration de fetch)
  static async loadFromApi() {
    try {
      return await ApiService.fetchCharacters();
    } catch (error) {
      console.error('Erreur chargement API:', error);
      return [];
    }
  }
}

// ===== Gestionnaire d'événements =====
export class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  // S'abonner à un événement
  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(callback);
  }

  // Émettre un événement
  emit(eventName, data) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).forEach(callback => callback(data));
    }
  }
}

// ===== gestion des données =====
export class ReactiveDataManager {
  constructor() {
    this.eventEmitter = new EventEmitter();
    // Utiliser un Proxy pour observer les changements sur le tableau
    this.data = new Proxy([], {
      set: (target, property, value) => {
        target[property] = value;
        // Émettre un événement quand le tableau change
        this.eventEmitter.emit('dataChanged', { property, value });
        return true;
      }
    });
  }

  // S'abonner aux changements
  on(eventName, callback) {
    this.eventEmitter.on(eventName, callback);
  }

  // Générer un ID unique
  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  // Alias pour les méthodes (pour compatibilité)
  add(item) {
    return this.addItem(item);
  }

  update(id, updates) {
    return this.updateItem(id, updates);
  }

  remove(id) {
    return this.removeItem(id);
  }

  // Ajouter un personnage
  addItem(item) {
    const newItem = {
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    
    this.data.push(newItem);
    this.saveToStorage();
    
    this.eventEmitter.emit('itemAdded', newItem);
    this.eventEmitter.emit('change', { type: 'add', item: newItem });
    
    return newItem;
  }

  // Modifier un personnage
  updateItem(id, updates) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    const oldItem = { ...this.data[index] };
    this.data[index] = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    this.eventEmitter.emit('itemUpdated', { oldItem, newItem: this.data[index] });
    this.eventEmitter.emit('change', { type: 'update', item: this.data[index] });
    
    return this.data[index];
  }

  // Supprimer un personnage
  removeItem(id) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    const removedItem = this.data[index];
    this.data.splice(index, 1);
    
    this.saveToStorage();
    
    this.eventEmitter.emit('itemRemoved', removedItem);
    this.eventEmitter.emit('change', { type: 'remove', item: removedItem });
    
    return removedItem;
  }

  // Rechercher des personnages
  search(query, fields = ['name', 'type', 'hometown']) {
    if (!query) return [...this.data];
    
    const lowercaseQuery = query.toLowerCase();
    return this.data.filter(item => {
      return fields.some(field => {
        const value = item[field];
        return value && value.toLowerCase().includes(lowercaseQuery);
      });
    });
  }

  // Filtrer les personnages
  filter(predicate) {
    return this.data.filter(predicate);
  }

  // Obtenir un personnage par ID
  getById(id) {
    return this.data.find(item => item.id === id);
  }

  // Obtenir tous les personnages
  getAll() {
    return [...this.data];
  }

  // Sauvegarder dans localStorage
  saveToStorage() {
    StorageService.save(StorageService.KEYS.CHARACTERS, this.data);
  }

  // Charger depuis localStorage
  loadFromStorage() {
    const savedData = StorageService.load(StorageService.KEYS.CHARACTERS);
    if (savedData.length > 0) {
      // Copier les données dans le Proxy
      savedData.forEach(item => this.data.push(item));
      this.eventEmitter.emit('loaded', savedData);
    }
  }

  // Charger depuis l'API (utilise fetch)
  async loadFromApi() {
    const apiData = await StorageService.loadFromApi();
    if (apiData.length > 0) {
      // Copier les données dans le Proxy
      this.data.length = 0; // Vider
      apiData.forEach(item => this.data.push(item));
      this.eventEmitter.emit('loaded', apiData);
      return apiData;
    }
    return [];
  }

  // Réinitialiser avec les données par défaut
  resetToDefault(defaultData) {
    // Vider et remplir le Proxy
    this.data.length = 0;
    defaultData.forEach(item => this.data.push(item));
    this.saveToStorage();
    this.eventEmitter.emit('reset', defaultData);
    this.eventEmitter.emit('change', { type: 'reset', data: defaultData });
  }
}