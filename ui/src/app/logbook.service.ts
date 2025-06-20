import { Injectable } from '@angular/core';
import { Tour, InternationaleFahrten } from './shared/models/tour';

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
      }

      return response.ok;
    } catch (error) {
      console.error('Error updating tour:', error);
      return false;
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

      console.log('Creating tour with data:', tourWithDefaults); // Debug log

      const response = await fetch(`${this.baseUrl}/${user}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourWithDefaults)
      });

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
      return undefined;
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