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
        <h2 class="section-heading">Waypoints of tour {{tour?.tourId}}</h2>
      </section>
    </article>
  `,
  styleUrls: ['./details.component.css'],
})

export class TourDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
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