import {Injectable} from '@angular/core';
import { Tour } from './shared/models/tour';
@Injectable({
  providedIn: 'root',
})
export default class LedgerService {
  url = 'http://logichain-backend-001.s-node.de:8080/tour-app/tours/allice';

  async getAllTours(): Promise<Tour[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }
  async getTourById(id: string): Promise<Tour | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return (await data.json()) ?? {};
  }
}