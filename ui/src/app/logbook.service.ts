import { Injectable } from '@angular/core';
import { Tour, InternationaleFahrten } from './shared/models/tour';
import { Waypoint } from './shared/models/waypoint';

@Injectable({
  providedIn: 'root',
})
export default class LedgerService {
  private baseUrl = 'http://localhost:8080/tour-app/tours';

  /**
   * Holt alle Tours für den gegebenen Benutzer
   */
  async getAllTours(user: string = 'alice'): Promise<Tour[]> {
    const response = await fetch(`${this.baseUrl}/${user}`);
    const tours: any[] = (await response.json()) ?? [];

    // Migration: boolean zu InternationaleFahrten Map
    return tours.map(t => ({
      ...t,
      internationaleFahrten: this.migrateInternationaleFahrten(t.internationaleFahrten)
    }));
  }

  /**
   * Holt eine einzelne Tour nach ID für den gegebenen Benutzer
   */
  async getTourById(user: string = 'alice', id: string): Promise<Tour | undefined> {
    const response = await fetch(`${this.baseUrl}/${user}/${id}`);
    if (!response.ok) {
      return undefined;
    }
    const tour: any = (await response.json()) ?? undefined;
    if (!tour) {
      return undefined;
    }

    return {
      ...tour,
      internationaleFahrten: this.migrateInternationaleFahrten(tour.internationaleFahrten)
    };
  }

  /**
   * Aktualisiert eine Tour mit neuen internationalen Fahrten
   */
  async updateTourInternationaleFahrten(user: string = 'alice', tourId: string, internationaleFahrten: InternationaleFahrten): Promise<boolean> {
    try {
      console.log(`Updating tour ${tourId} with internationale Fahrten:`, internationaleFahrten);

      const url = `${this.baseUrl}/${user}/${tourId}/international`;
      console.log('PUT request to:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(internationaleFahrten)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.type === 'USER_NOT_AUTHORIZED') {
            throw new Error('AUTHORIZATION_ERROR: ' + errorData.message);
          } else if (errorData.message) {
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          // Falls kein JSON, verwende den Fehlertext direkt
          if (errorText.includes('not authorized')) {
            throw new Error('AUTHORIZATION_ERROR: ' + errorText);
          }
        }

        throw new Error('Fehler beim Aktualisieren der Tour');
      }

      return true;
    } catch (error: any) {
      console.error('Error updating tour:', error);
      throw error;
    }
  }

  /**
   * Erstellt eine neue Tour
   */
  async createTour(user: string = 'alice', tour: Tour): Promise<Tour | undefined> {
    try {
      // Sicherstellen, dass internationaleFahrten gesetzt ist
      const tourWithDefaults: Tour = {
        ...tour,
        internationaleFahrten: tour.internationaleFahrten ?? this.getDefaultInternationaleFahrten()
      };

      console.log('Creating tour with data:', tourWithDefaults);

      const response = await fetch(`${this.baseUrl}/${user}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourWithDefaults)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.type === 'USER_NOT_AUTHORIZED') {
            throw new Error('AUTHORIZATION_ERROR: ' + errorData.message);
          } else if (errorData.message) {
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          // Falls kein JSON, verwende den Fehlertext direkt
          if (errorText.includes('not authorized')) {
            throw new Error('AUTHORIZATION_ERROR: ' + errorText);
          }
        }

        throw new Error('Fehler beim Erstellen der Tour');
      }

      if (response.ok) {
        const createdTour = await response.json();
        // Sicherstellen, dass die zurückgegebene Tour auch die Defaults hat
        return {
          ...createdTour,
          internationaleFahrten: this.migrateInternationaleFahrten(createdTour.internationaleFahrten)
        };
      }
      return undefined;
    } catch (error) {
      console.error('Error creating tour:', error);
      throw error;
    }
  }

  /**
   * Fügt einen Waypoint zu einer Tour hinzu
   */
  async addWaypoint(user: string = 'alice', tourId: string, waypoint: Waypoint): Promise<boolean> {
    try {
      console.log(`Adding waypoint to tour ${tourId}:`, waypoint);

      const url = `${this.baseUrl}/${user}/${tourId}`;
      console.log('PUT request to:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(waypoint)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);

        try {
          const errorData = JSON.parse(errorText);

          // Autorisierungsfehler
          if (errorData.type === 'USER_NOT_AUTHORIZED') {
            throw new Error('AUTHORIZATION_ERROR: ' + errorData.message);
          }

          // Geografische Validierungsfehler
          if (errorData.type === 'LOCATION_NOT_ALLOWED') {
            throw new Error('LOCATION_ERROR: ' + errorData.message);
          }

          if (errorData.message) {
            throw new Error(errorData.message);
          }
        } catch (parseError) {
          // Falls kein JSON, prüfe ob es ein bekannter Fehlertext ist
          if (errorText.includes('not authorized')) {
            throw new Error('AUTHORIZATION_ERROR: ' + errorText);
          }
          throw new Error('Fehler beim Hinzufügen des Waypoints: ' + errorText);
        }
      }

      return true;
    } catch (error: any) {
      console.error('Error adding waypoint:', error);
      // Werfe den Fehler weiter, damit die Komponente ihn behandeln kann
      throw error;
    }
  }

  /**
   * Migriert alte boolean-Werte zu neuer Map-Struktur
   */
  private migrateInternationaleFahrten(value: any): InternationaleFahrten {
    // Falls es bereits die neue Map-Struktur ist
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Prüfe ob es die erwarteten Keys hat
      if ('eu' in value || 'eu_ch' in value || 'inland' in value) {
        return {
          eu: value.eu ?? false,
          eu_ch: value.eu_ch ?? false,
          inland: value.inland ?? true
        };
      }
    }

    // Falls es ein boolean ist (alte Struktur)
    if (typeof value === 'boolean') {
      return {
        eu: value,
        eu_ch: value,
        inland: !value
      };
    }

    // Default fallback
    return this.getDefaultInternationaleFahrten();
  }

  private getDefaultInternationaleFahrten(): InternationaleFahrten {
    return {
      eu: false,
      eu_ch: false,
      inland: true
    };
  }
}