# Cars Character Manager

Application web de gestion des personnages du film **Cars** (Pixar), développée en **Vanilla JavaScript** avec Vite.
 
##Lancement rapide :

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Puis ouvrir http://localhost:3000 dans votre navigateur.

## Description

Application permettant de gérer une collection de personnages de l'univers Cars (Flash McQueen, Martin, Sally, Doc Hudson, etc.).

**Thème choisi** : Les habitants de Radiator Springs

## Fonctionnalités

### Gestion des personnages
- **Afficher** la liste des personnages en grille
- **Ajouter** de nouveaux personnages
- **Modifier** les personnages existants
- **Supprimer** des personnages (avec confirmation)
- **Favoris** : marquer/démarquer des personnages favoris

### Interface
- **Recherche** en temps réel (nom, type, ville)
- **Filtres** par type de véhicule
- **Filtre favoris**
- **Mode sombre/clair** avec bascule
- **Responsive** : mobile, tablette, desktop
- **Animations** CSS fluides
- **Persistance** automatique (LocalStorage)

## Technologies

- **HTML5, CSS3, JavaScript** (Vanilla JS)
- **Vite** (build tool)
- **CSS Grid & Flexbox** (responsive)
- **LocalStorage** (persistance)
- **Proxy JavaScript** (réactivité)

## Structure

```
src/
├── main.js              # Application principale
├── data/
│   ├── characters.json  # Données JSON
│   └── characters.js    # Import des données
├── utils/
│   ├── dataManager.js   # Proxy + LocalStorage + EventEmitter
│   └── themeManager.js  # Gestion thème clair/sombre
├── components/
│   ├── ui.js            # Cartes, détails, notifications
│   └── formManager.js   # Validation formulaire
└── styles/
    └── main.css         # Styles + animations
```

### Promotion : ISEN AP4 - 2025/2026  

> Groupe : 
>- Pierre Foulon
>- Sacha Bouton
>- Clément Paghent