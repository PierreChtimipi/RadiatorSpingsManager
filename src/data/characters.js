/**
 * Service pour charger les données des personnages depuis le fichier JSON
 * Ce module utilise l'API Fetch pour charger les données
 */

// Import du fichier JSON (Vite gère l'import JSON automatiquement)
import charactersData from './characters.json';

/**
 * Données des personnages du film Cars
 * Chaque personnage contient : id, nom, type, couleur, description, ville d'origine, et URL d'image
 */
export const carsCharacters = charactersData;

/**
 * Fonctions utilitaires pour gérer les données des personnages
 */
export class CarsDataManager {
  constructor() {
    this.characters = [...carsCharacters];
    this.nextId = Math.max(...this.characters.map(c => c.id)) + 1;
  }

  /**
   * Obtenir tous les personnages
   */
  getAllCharacters() {
    return [...this.characters];
  }

  /**
   * Obtenir un personnage par ID
   */
  getCharacterById(id) {
    return this.characters.find(character => character.id === id);
  }

  /**
   * Ajouter un nouveau personnage
   */
  addCharacter(characterData) {
    const newCharacter = {
      id: this.nextId++,
      isFavorite: false,
      year: new Date().getFullYear(),
      ...characterData
    };
    this.characters.push(newCharacter);
    return newCharacter;
  }

  /**
   * Modifier un personnage existant
   */
  updateCharacter(id, updates) {
    const index = this.characters.findIndex(c => c.id === id);
    if (index !== -1) {
      this.characters[index] = { ...this.characters[index], ...updates };
      return this.characters[index];
    }
    return null;
  }

  /**
   * Supprimer un personnage
   */
  deleteCharacter(id) {
    const index = this.characters.findIndex(c => c.id === id);
    if (index !== -1) {
      return this.characters.splice(index, 1)[0];
    }
    return null;
  }

  /**
   * Basculer le statut favori d'un personnage
   */
  toggleFavorite(id) {
    const character = this.getCharacterById(id);
    if (character) {
      character.isFavorite = !character.isFavorite;
      return character;
    }
    return null;
  }

  /**
   * Obtenir les personnages favoris
   */
  getFavoriteCharacters() {
    return this.characters.filter(character => character.isFavorite);
  }

  /**
   * Rechercher des personnages par nom ou type
   */
  searchCharacters(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.characters.filter(character => 
      character.name.toLowerCase().includes(lowercaseQuery) ||
      character.type.toLowerCase().includes(lowercaseQuery) ||
      character.hometown.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Filtrer par type de véhicule
   */
  filterByType(type) {
    if (!type) return this.characters;
    return this.characters.filter(character => 
      character.type.toLowerCase().includes(type.toLowerCase())
    );
  }
}