# 🏎️ Cars Character Manager

Application web de gestion des personnages du film **Cars** (Pixar), développée en **Vanilla JavaScript** avec Vite.

## 🚀 Lancement rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Puis ouvrir **http://localhost:3000** dans votre navigateur.

## � Description

Application permettant de gérer une collection de personnages de l'univers Cars (Flash McQueen, Martin, Sally, Doc Hudson, etc.).

**Thème choisi** : Les habitants de Radiator Springs

## ✨ Fonctionnalités

### Gestion des personnages
- ✅ **Afficher** la liste des personnages en grille
- ✅ **Ajouter** de nouveaux personnages
- ✅ **Modifier** les personnages existants
- ✅ **Supprimer** des personnages (avec confirmation)
- ✅ **Favoris** : marquer/démarquer des personnages favoris

### Interface
- 🔍 **Recherche** en temps réel (nom, type, ville)
- 🏷️ **Filtres** par type de véhicule
- ⭐ **Filtre favoris**
- 🌓 **Mode sombre/clair** avec bascule
- 📱 **Responsive** : mobile, tablette, desktop
- 🎨 **Animations** CSS fluides
- 💾 **Persistance** automatique (LocalStorage)

## � Technologies

- **HTML5, CSS3, JavaScript ES6+** (Vanilla JS uniquement)
- **Vite** (build tool)
- **CSS Grid & Flexbox** (responsive)
- **LocalStorage** (persistance)
- **Proxy JavaScript** (réactivité)

## 📁 Structure

```
src/
├── main.js              # Application principale
├── data/
│   ├── characters.json  # Données JSON (12 personnages)
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

## 💡 Concepts techniques mis en œuvre

- **Manipulation DOM** : `createElement`, `appendChild`, `querySelector`
- **Proxy JavaScript** : Synchronisation automatique données ↔ DOM
- **EventEmitter** : Pattern Observer pour communication entre composants
- **LocalStorage** : Persistance des données avec `JSON.stringify/parse`
- **Validation formulaire** : Règles réutilisables et validation temps réel
- **CSS Variables** : Thème dynamique clair/sombre
- **Animations CSS** : `@keyframes`, transitions fluides
- **Responsive Design** : CSS Grid (`auto-fill`, `minmax`) + Flexbox + Media Queries

## � Licence

Projet éducatif - Cours de Développement Web - Octobre 2025  
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