export class ApiService {
  static async fetchCharacters() {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // charger le fichier JSON local
      const response = await fetch('/src/data/characters.json');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API: Personnages chargés', data.length);
      return data;
    } catch (error) {
      console.error('Erreur API:', error);
      return [];
    }
  }

  // Simuler une sauvegarde API
  static async saveCharacters(characters) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('API: Sauvegarde simulée de', characters.length, 'personnages');
      return { success: true, count: characters.length };
    } catch (error) {
      console.error('Erreur sauvegarde API:', error);
      return { success: false, error };
    }
  }
}
