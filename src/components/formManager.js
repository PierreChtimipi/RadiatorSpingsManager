/**
 * Gestionnaire de validation de formulaire
 */
export class FormValidator {
  constructor() {
    this.rules = new Map();
    this.errors = new Map();
  }

  /**
   * Ajouter une règle de validation pour un champ
   */
  addRule(fieldName, validator, errorMessage) {
    if (!this.rules.has(fieldName)) {
      this.rules.set(fieldName, []);
    }
    this.rules.get(fieldName).push({
      validator,
      errorMessage
    });
  }

  /**
   * Règles de validation prédéfinies
   */
  static validators = {
    required: (value) => value && value.trim() !== '',
    minLength: (min) => (value) => !value || value.length >= min,
    maxLength: (max) => (value) => !value || value.length <= max,
    email: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    url: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    color: (value) => !value || /^#[0-9A-F]{6}$/i.test(value),
    pattern: (regex) => (value) => !value || regex.test(value)
  };

  /**
   * Valider un champ spécifique
   */
  validateField(fieldName, value) {
    this.clearFieldError(fieldName);

    const fieldRules = this.rules.get(fieldName);
    if (!fieldRules) return true;

    for (const rule of fieldRules) {
      if (!rule.validator(value)) {
        this.setFieldError(fieldName, rule.errorMessage);
        return false;
      }
    }

    return true;
  }

  /**
   * Valider tous les champs
   */
  validateAll(formData) {
    let isValid = true;
    this.clearAllErrors();

    for (const [fieldName, value] of Object.entries(formData)) {
      if (!this.validateField(fieldName, value)) {
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Définir une erreur pour un champ
   */
  setFieldError(fieldName, errorMessage) {
    this.errors.set(fieldName, errorMessage);
  }

  /**
   * Effacer l'erreur d'un champ
   */
  clearFieldError(fieldName) {
    this.errors.delete(fieldName);
  }

  /**
   * Effacer toutes les erreurs
   */
  clearAllErrors() {
    this.errors.clear();
  }

  /**
   * Obtenir les erreurs
   */
  getErrors() {
    return Object.fromEntries(this.errors);
  }

  /**
   * Vérifier s'il y a des erreurs
   */
  hasErrors() {
    return this.errors.size > 0;
  }
}

/**
 * Gestionnaire de formulaire pour les personnages
 */
export class CharacterFormManager {
  constructor(formElement, options = {}) {
    this.form = formElement;
    this.validator = new FormValidator();
    this.currentCharacter = null;
    this.isEditMode = false;
    
    this.options = {
      onSubmit: null,
      onCancel: null,
      validateOnBlur: true,
      validateOnInput: false,
      ...options
    };

    this.init();
  }

  /**
   * Initialiser le gestionnaire de formulaire
   */
  init() {
    this.setupValidationRules();
    this.setupEventListeners();
    this.setupColorSync();
  }

  /**
   * Configurer les règles de validation
   */
  setupValidationRules() {
    const { validators } = FormValidator;

    // Nom du personnage
    this.validator.addRule('name', validators.required, 'Le nom est requis');
    this.validator.addRule('name', validators.minLength(2), 'Le nom doit contenir au moins 2 caractères');
    this.validator.addRule('name', validators.maxLength(50), 'Le nom ne peut pas dépasser 50 caractères');

    // Type de véhicule
    this.validator.addRule('type', validators.required, 'Le type de véhicule est requis');
    this.validator.addRule('type', validators.minLength(3), 'Le type doit contenir au moins 3 caractères');
    this.validator.addRule('type', validators.maxLength(100), 'Le type ne peut pas dépasser 100 caractères');

    // Couleur
    this.validator.addRule('color', validators.required, 'La couleur est requise');
    this.validator.addRule('color', validators.color, 'Format de couleur invalide (ex: #FF0000)');

    // Description
    this.validator.addRule('description', validators.required, 'La description est requise');
    this.validator.addRule('description', validators.minLength(10), 'La description doit contenir au moins 10 caractères');
    this.validator.addRule('description', validators.maxLength(500), 'La description ne peut pas dépasser 500 caractères');

    // URL d'image (optionnel)
    this.validator.addRule('imageUrl', validators.url, 'URL d\'image invalide');

    // Ville d'origine (optionnel)
    this.validator.addRule('hometown', validators.maxLength(100), 'La ville ne peut pas dépasser 100 caractères');

    // Spécialité (optionnel)
    this.validator.addRule('specialty', validators.maxLength(100), 'La spécialité ne peut pas dépasser 100 caractères');
  }

  /**
   * Configurer les écouteurs d'événements
   */
  setupEventListeners() {
    // Soumission du formulaire
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Bouton d'annulation
    const cancelBtn = this.form.querySelector('#cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.handleCancel();
      });
    }

    // Validation en temps réel
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      if (this.options.validateOnBlur) {
        input.addEventListener('blur', () => {
          this.validateSingleField(input);
        });
      }

      if (this.options.validateOnInput) {
        input.addEventListener('input', () => {
          this.validateSingleField(input);
        });
      }
    });
  }

  /**
   * Synchroniser le sélecteur de couleur avec le champ texte
   */
  setupColorSync() {
    const colorPicker = this.form.querySelector('#color');
    const colorText = this.form.querySelector('#color-text');

    if (colorPicker && colorText) {
      colorPicker.addEventListener('input', () => {
        colorText.value = colorPicker.value;
        this.validateSingleField(colorText);
      });

      colorText.addEventListener('input', () => {
        const value = colorText.value;
        if (/^#[0-9A-F]{6}$/i.test(value)) {
          colorPicker.value = value;
        }
      });
    }
  }

  /**
   * Valider un seul champ
   */
  validateSingleField(input) {
    const fieldName = input.name;
    const value = input.value;
    
    const isValid = this.validator.validateField(fieldName, value);
    this.displayFieldValidation(input, isValid);
  }

  /**
   * Afficher l'état de validation d'un champ
   */
  displayFieldValidation(input, isValid) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');

    if (isValid) {
      formGroup.classList.remove('error');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    } else {
      formGroup.classList.add('error');
      const errorMessage = this.validator.getErrors()[input.name];
      if (errorElement && errorMessage) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
      }
    }
  }

  /**
   * Afficher tous les erreurs de validation
   */
  displayAllValidationErrors() {
    const errors = this.validator.getErrors();
    
    Object.entries(errors).forEach(([fieldName, errorMessage]) => {
      const input = this.form.querySelector(`[name="${fieldName}"]`);
      if (input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        if (errorElement) {
          errorElement.textContent = errorMessage;
          errorElement.style.display = 'block';
        }
      }
    });
  }

  /**
   * Effacer toutes les erreurs visuelles
   */
  clearAllValidationErrors() {
    const formGroups = this.form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
      group.classList.remove('error');
      const errorElement = group.querySelector('.error-message');
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    });
  }

  /**
   * Obtenir les données du formulaire
   */
  getFormData() {
    const formData = new FormData(this.form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
      data[key] = value.trim();
    }

    // Traitement spécial pour la couleur
    if (data.color && !data.color.startsWith('#')) {
      data.color = '#' + data.color;
    }

    return data;
  }

  /**
   * Remplir le formulaire avec des données
   */
  populateForm(character) {
    this.currentCharacter = character;
    this.isEditMode = true;

    // Remplir les champs
    Object.entries(character).forEach(([key, value]) => {
      const input = this.form.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = value || '';
      }
    });

    // Synchroniser les champs de couleur
    const colorPicker = this.form.querySelector('#color');
    const colorText = this.form.querySelector('#color-text');
    if (colorPicker && character.color) {
      colorPicker.value = character.color;
    }
    if (colorText && character.color) {
      colorText.value = character.color;
    }

    // Mettre à jour le titre du modal
    this.updateModalTitle('Modifier le personnage');
    this.updateSubmitButton('Modifier');
  }

  /**
   * Réinitialiser le formulaire pour l'ajout
   */
  resetForAdd() {
    this.form.reset();
    this.currentCharacter = null;
    this.isEditMode = false;
    this.clearAllValidationErrors();

    // Valeurs par défaut
    const colorPicker = this.form.querySelector('#color');
    const colorText = this.form.querySelector('#color-text');
    if (colorPicker) {
      colorPicker.value = '#FF0000';
    }
    if (colorText) {
      colorText.value = '#FF0000';
    }

    this.updateModalTitle('Ajouter un personnage');
    this.updateSubmitButton('Ajouter');
  }

  /**
   * Mettre à jour le titre du modal
   */
  updateModalTitle(title) {
    const titleElement = document.querySelector('#modal-title');
    if (titleElement) {
      titleElement.textContent = title;
    }
  }

  /**
   * Mettre à jour le texte du bouton de soumission
   */
  updateSubmitButton(text) {
    const submitText = document.querySelector('#submit-text');
    if (submitText) {
      submitText.textContent = text;
    }
  }

  /**
   * Gérer la soumission du formulaire
   */
  handleSubmit() {
    const formData = this.getFormData();
    
    // Valider toutes les données
    const isValid = this.validator.validateAll(formData);
    
    if (isValid) {
      this.clearAllValidationErrors();
      
      // Préparer les données finales
      const characterData = {
        ...formData,
        id: this.isEditMode ? this.currentCharacter.id : undefined
      };
      
      // Appeler le callback de soumission
      if (this.options.onSubmit) {
        this.options.onSubmit(characterData, this.isEditMode);
      }
    } else {
      this.displayAllValidationErrors();
      
      // Faire défiler jusqu'à la première erreur
      const firstError = this.form.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }

  /**
   * Gérer l'annulation
   */
  handleCancel() {
    if (this.options.onCancel) {
      this.options.onCancel();
    }
  }

  /**
   * Désactiver le formulaire pendant le traitement
   */
  setLoading(loading) {
    const inputs = this.form.querySelectorAll('input, textarea, select, button');
    inputs.forEach(input => {
      input.disabled = loading;
    });

    const submitButton = this.form.querySelector('button[type="submit"]');
    if (submitButton) {
      const submitText = submitButton.querySelector('#submit-text');
      if (submitText) {
        submitText.textContent = loading ? 'Traitement...' : (this.isEditMode ? 'Modifier' : 'Ajouter');
      }
    }
  }

  /**
   * Obtenir le mode actuel
   */
  getMode() {
    return this.isEditMode ? 'edit' : 'add';
  }

  /**
   * Obtenir le personnage actuel (en mode édition)
   */
  getCurrentCharacter() {
    return this.currentCharacter;
  }
}