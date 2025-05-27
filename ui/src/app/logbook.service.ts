import { Injectable } from '@angular/core';
import { Tour } from './shared/models/tour';

@Injectable({
  providedIn: 'root',
})
export default class LedgerService {
  private baseUrl = 'http://logichain-backend-001.s-node.de:8080/tour-app/tours';

  /**
   * Holt alle Tours für den gegebenen Benutzer
   */
  async getAllTours(user: string = 'alice'): Promise<Tour[]> {
    const response = await fetch(`${this.baseUrl}/${user}`);
    const tours: Tour[] = (await response.json()) ?? [];

    // Default für das optionale Flag sicherstellen
    return tours.map(t => ({
      ...t,
      internationaleFahrten: t.internationaleFahrten ?? false
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
    const tour: Tour = (await response.json()) ?? undefined;
    if (!tour) {
      return undefined;
    }

    return {
      ...tour,
      internationaleFahrten: tour.internationaleFahrten ?? false
    };
  }
}
