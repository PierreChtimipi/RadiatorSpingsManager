/**
 * Données des personnages du film Cars
 * Chaque personnage contient : id, nom, type, couleur, description, ville d'origine, et URL d'image
 */
export const carsCharacters = [
  {
    id: 1,
    name: "Flash McQueen",
    type: "Voiture de course",
    color: "#FF0000",
    description: "Flash McQueen est une voiture de course rouge numéro 95. Ambitieux et déterminé, il apprend l'importance de l'amitié et de l'humilité à Radiator Springs.",
    hometown: "Radiator Springs",
    imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop",
    specialty: "Course sur circuit",
    isFavorite: false,
    year: 2006
  },
  {
    id: 2,
    name: "Martin", 
    type: "Dépanneuse",
    color: "#8B4513",
    description: "Martin est une dépanneuse rouillée au grand cœur. Meilleur ami de Flash, il est toujours prêt à aider malgré son moteur capricieux.",
    hometown: "Radiator Springs",
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
    specialty: "Dépannage et marche arrière",
    isFavorite: false,
    year: 2006
  },
  {
    id: 3,
    name: "Sally Carrera",
    type: "Porsche 911",
    color: "#4169E1",
    description: "Sally est une Porsche bleue élégante, avocate devenue propriétaire du Cozy Cone Motel. Elle aide Flash à découvrir les valeurs de Radiator Springs.",
    hometown: "Radiator Springs", 
    imageUrl: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop",
    specialty: "Droit et hospitalité",
    isFavorite: false,
    year: 2006
  },
  {
    id: 4,
    name: "Doc Hudson",
    type: "Hudson Hornet 1951",
    color: "#2F4F4F",
    description: "Doc Hudson est le médecin et juge de Radiator Springs, mais aussi l'ancien champion Fabulous Hudson Hornet. Mentor de Flash McQueen.",
    hometown: "Radiator Springs",
    imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop",
    specialty: "Médecine et course",
    isFavorite: false,
    year: 2006
  },
  {
    id: 5,
    name: "Flo",
    type: "Show car des années 50",
    color: "#FF69B4",
    description: "Flo est la propriétaire du V8 Café, connue pour ses milkshakes et son caractère bien trempé. Épouse de Ramone.",
    hometown: "Radiator Springs",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    specialty: "Cuisine et service",
    isFavorite: false,
    year: 2006
  },
  {
    id: 6,
    name: "Ramone",
    type: "Chevrolet Impala 1959",
    color: "#800080",
    description: "Ramone est un lowrider passionné de customisation. Il change de couleur selon son humeur et tient le magasin de carrosserie.",
    hometown: "Radiator Springs",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    specialty: "Peinture et customisation",
    isFavorite: false,
    year: 2006
  },
  {
    id: 7,
    name: "Luigi",
    type: "Fiat 500",
    color: "#FFFF00",
    description: "Luigi est le propriétaire du magasin de pneus Casa Della Tires. Passionné de course automobile, surtout les Ferrari italiennes.",
    hometown: "Radiator Springs",
    imageUrl: "https://images.unsplash.com/photo-1583747091849-ad948d080622?w=400&h=300&fit=crop",
    specialty: "Vente de pneus",
    isFavorite: false,
    year: 2006
  },
  {
    id: 8,
    name: "Guido",
    type: "Chariot élévateur Alza/Tutto",
    color: "#0000FF",
    description: "Guido est l'assistant de Luigi et le plus rapide changeur de pneus du monde. Il ne parle qu'italien mais comprend tout.",
    hometown: "Radiator Springs",
    imageUrl: "https://images.unsplash.com/photo-1558563438-6d8b97f1ae73?w=400&h=300&fit=crop",
    specialty: "Changement de pneus express",
    isFavorite: false,
    year: 2006
  }
];

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