import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import LedgerService from '../logbook.service';
import { Tour } from '../shared/models/tour';
import { Waypoint } from '../shared/models/waypoint';

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
              <th>Internationale Fahrt erlaubt</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let wp of tour?.waypoints ?? []; index as i">
              <td>{{ i + 1 }}</td>
              <td>{{ wp.latitude }}</td>
              <td>{{ wp.longitude }}</td>
              <td>{{ wp.timestamp }}</td>
              <td>
                <button class="button-3"
                [ngClass]="{'active': wp.internationaleFahrt[0].eu}"
                (click)="toggleFahrt(wp,'eu')">EU: {{wp.internationaleFahrt[0].eu ? 'Erlaubt' : 'Nicht erlaubt'}}</button>

                <button class="button-3"
                [ngClass]="{'active': wp.internationaleFahrt[0].schweiz}"
    (click)="toggleFahrt(wp, 'schweiz')">Schweiz: {{wp.internationaleFahrt[0].schweiz ? 'Erlaubt' : 'Nicht Erlaubt'}}</button>

                <button class="button-3"
                [ngClass]="{'active': wp.internationaleFahrt[0].nichtEu}"
    (click)="toggleFahrt(wp, 'nichtEu')"
                >Außerhalb der EU: {{wp.internationaleFahrt[0].nichtEu ? 'Erlaubt' : 'Nicht Erlaubt'}}</button>
            
            
            </td>

              
                
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
  toggleFahrt(wp: any, key: 'eu' | 'schweiz' | 'nichtEu') {
    if (wp?.internationaleFahrt?.[0]) {
      wp.internationaleFahrt[0][key] = !wp.internationaleFahrt[0][key];
    }
  }
  
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
    this.housingService.getTourById(tourId).then((tour) => {
      this.tour = tour;
    });
  }
}
