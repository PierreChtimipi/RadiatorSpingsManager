# 🏎️ Cars Character Manager

Une application web moderne de gestion des personnages du film Cars, développée en JavaScript vanilla avec Vite.

## 📋 Description

Cette application permet de gérer une collection de personnages de l'univers Cars avec les fonctionnalités suivantes :

- **Affichage d'une liste de personnages** avec cartes visuelles
- **Ajout, modification et suppression** de personnages
- **Système de favoris** pour marquer ses personnages préférés
- **Recherche et filtrage** avancés
- **Validation de formulaire** complète
- **Mode sombre/clair** avec bascule automatique
- **Animations fluides** pour toutes les interactions
- **Design responsive** (mobile, tablette, desktop)
- **Persistance des données** avec LocalStorage
- **Système Proxy** pour la synchronisation temps réel

## 🚀 Technologies Utilisées

- **JavaScript ES6+** (Vanilla JS, pas de frameworks)
- **Vite** pour le bundling et le développement
- **CSS Grid & Flexbox** pour le layout responsive
- **CSS Custom Properties** pour la gestion des thèmes
- **LocalStorage API** pour la persistance
- **Proxy API** pour la réactivité des données
- **DOM API** pour les interactions
- **CSS Animations** pour les transitions

## 🏗️ Architecture du Projet

```
projet_web/
├── index.html                 # Page principale
├── package.json              # Configuration npm
├── vite.config.js            # Configuration Vite
├── src/
│   ├── main.js               # Point d'entrée et orchestration
│   ├── styles/
│   │   └── main.css          # Styles principaux avec thèmes
│   ├── data/
│   │   └── characters.js     # Données des personnages Cars
│   ├── utils/
│   │   ├── dataManager.js    # Système Proxy et gestion des données
│   │   └── themeManager.js   # Gestionnaire de thèmes
│   └── components/
│       ├── ui.js             # Composants d'interface utilisateur
│       └── formManager.js    # Validation et gestion des formulaires
```

## 🎨 Fonctionnalités Principales

### 🎭 Gestion des Personnages
- **Visualisation** : Cartes avec image, nom, type, couleur, description
- **Ajout/Modification** : Formulaire complet avec validation
- **Suppression** : Confirmation avant suppression
- **Favoris** : Marquage et filtrage des personnages préférés

### 🔍 Recherche et Filtres
- **Recherche textuelle** dans le nom, type, ville et spécialité
- **Filtre par type** de véhicule
- **Filtre favoris** uniquement
- **Recherche en temps réel** avec debouncing

### 🎨 Interface Utilisateur
- **Design moderne** inspiré de l'univers Cars
- **Mode sombre/clair** avec détection automatique des préférences système
- **Animations fluides** pour toutes les interactions
- **Responsive design** pour tous les écrans
- **Notifications toast** pour les feedbacks

### 💾 Persistance des Données
- **Sauvegarde automatique** dans LocalStorage
- **Synchronisation en temps réel** avec Proxy
- **Gestion des préférences** utilisateur
- **Données par défaut** au premier lancement

## 🛠️ Installation et Lancement

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner ou télécharger le projet
cd projet_web

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Ou pour build de production
npm run build
```

### Lancement sans Node.js
Le projet peut également être ouvert directement dans un navigateur moderne en ouvrant le fichier `index.html`, mais certaines fonctionnalités (comme les modules ES6) nécessitent un serveur web.

## 🎯 Utilisation

### Navigation de Base
- **Ajouter un personnage** : Cliquer sur "➕ Nouveau personnage"
- **Modifier un personnage** : Cliquer sur l'icône ✏️ sur une carte
- **Supprimer un personnage** : Cliquer sur l'icône 🗑️ et confirmer
- **Marquer comme favori** : Cliquer sur l'étoile ⭐/☆
- **Voir les détails** : Cliquer sur une carte de personnage

### Recherche et Filtres
- **Rechercher** : Taper dans la barre de recherche
- **Filtrer par type** : Utiliser le menu déroulant
- **Voir les favoris** : Cliquer sur "⭐ Favoris uniquement"
- **Effacer la recherche** : Cliquer sur ✖️

### Raccourcis Clavier
- **Ctrl + N** : Nouveau personnage
- **Ctrl + F** : Focus sur la recherche
- **Ctrl + D** : Basculer le thème
- **Échap** : Fermer les modals

## 🏗️ Architecture Technique

### Système Proxy pour la Réactivité
```javascript
// Le Proxy intercepte automatiquement tous les changements
const dataManager = new ReactiveDataManager();
dataManager.add(character);  // ➡️ Mise à jour automatique du DOM
dataManager.update(id, updates);  // ➡️ Re-rendu des composants
```

### Gestion des Thèmes
```javascript
// Détection automatique des préférences système
const themeManager = new ThemeManager();
themeManager.toggleTheme();  // ➡️ Bascule avec transition fluide
```

### Validation de Formulaire
```javascript
// Validation en temps réel avec règles personnalisables
const validator = new FormValidator();
validator.addRule('name', validators.required, 'Le nom est requis');
```

### Composants Modulaires
```javascript
// Composants réutilisables avec options
const card = new CharacterCard(character, {
  onClick: showDetails,
  onEdit: editCharacter
});
```

## 🎨 Personnalisation

### Variables CSS
Les couleurs et espacements sont définis via des variables CSS personnalisables :

```css
:root {
  --primary-color: #FF6B35;
  --secondary-color: #4ECDC4;
  --accent-color: #FFE66D;
  /* ... */
}

[data-theme="dark"] {
  --bg-primary: #1A1A2E;
  --text-primary: #FFFFFF;
  /* ... */
}
```

### Données de Personnages
Les personnages par défaut peuvent être modifiés dans `src/data/characters.js` :

```javascript
export const carsCharacters = [
  {
    id: 1,
    name: "Flash McQueen",
    type: "Voiture de course",
    color: "#FF0000",
    // ...
  }
];
```

## 📱 Responsive Design

L'application s'adapte automatiquement aux différentes tailles d'écran :

- **Desktop** (>768px) : Grille multi-colonnes avec sidebar
- **Tablette** (768px) : Grille ajustée
- **Mobile** (<768px) : Colonne unique, navigation simplifiée

## ⚡ Optimisations des Performances

- **Debouncing** sur la recherche pour éviter les appels excessifs
- **Lazy loading** des images avec placeholder
- **Animations CSS** optimisées avec `transform` et `opacity`
- **Event delegation** pour les interactions
- **LocalStorage** optimisé avec gestion d'erreurs

## 🐛 Gestion d'Erreurs

- **Try/catch** sur toutes les opérations critiques
- **Validation** côté client avec messages d'erreur clairs
- **Fallbacks** pour les images et données manquantes
- **Notifications** pour informer l'utilisateur

## 🧪 Tests et Validation

Le projet respecte les contraintes demandées :

✅ **JavaScript Vanilla** (aucun framework)  
✅ **Manipulation DOM** via l'API DOM native  
✅ **Proxy** pour la synchronisation des données  
✅ **Gestion d'événements** complète  
✅ **LocalStorage** pour la persistance  
✅ **Mode sombre/clair** avec bascule  
✅ **Animations CSS** fluides  
✅ **Responsive Design** Grid/Flexbox  
✅ **Validation de formulaire** robuste  
✅ **Thème original** (Cars)  

## 📄 Licence

Ce projet est développé dans le cadre d'un exercice pédagogique sur les technologies web modernes.

---

**Développé avec ❤️ et beaucoup de ☕ pour l'univers de Cars ! 🏎️**