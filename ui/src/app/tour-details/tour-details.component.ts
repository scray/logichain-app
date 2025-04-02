import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import LedgerService from '../logbook.service';
import { Tour } from '../shared/models/tour';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  template: `
      <article>
      <section class="listing-features">
        <h2 class="section-heading">Waypoints of tour {{ tour?.tourId }}</h2>

        <table *ngIf="(tour?.waypoints?.length || 0) > 0">
          <thead>
            <tr>
              <th>#</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let wp of tour?.waypoints ?? []; index as i">
              <td>{{ i + 1 }}</td>
              <td>{{ wp.latitude }}</td>
              <td>{{ wp.longitude }}</td>
              <td>{{ wp.timestamp }}</td>
            </tr>
          </tbody>
        </table>

        <p *ngIf="(tour?.waypoints?.length || 0) === 0">
          No waypoints available for this tour.
        </p>
      </section>
    </article>
  `,
  styleUrls: ['./details.component.css'],
})

export class TourDetailsComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private ledgerService = inject(LedgerService);

  public get housingService() {
    return this.ledgerService;
  }
  public set housingService(value) {
    this.ledgerService = value;
  }

  tour: Tour | undefined;
  constructor() {
    const tourId = this.route.snapshot.params['id'];

    this.housingService.getTourById(tourId).then((tour) =>
       {      this.tour = tour;    });
  }
}