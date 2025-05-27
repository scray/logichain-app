// src/app/tour-details/tour-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule }            from '@angular/forms';
import { MatToolbarModule }       from '@angular/material/toolbar';
import { MatIconModule }          from '@angular/material/icon';
import { MatButtonModule }        from '@angular/material/button';
import { MatCheckboxModule }      from '@angular/material/checkbox';
import { MatTableModule }         from '@angular/material/table';

import LedgerService               from '../logbook.service';
import { Tour }                    from '../shared/models/tour';
import { Waypoint }                from '../shared/models/waypoint';

interface DisplayWP {
  idx: number;
  lon: number;
  lat: number;
  timestamp: string;
}

@Component({
  selector: 'app-tour-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule
  ],
  templateUrl: './tour-details.component.html',
  styleUrls:  ['./details.component.css']
})
export class TourDetailsComponent implements OnInit {
  tourId!: string;
  tour?: Tour;
  displayWaypoints: DisplayWP[] = [];

  // ← Hier fehlt die Definition
  displayedColumns: string[] = ['idx','lon','lat','timestamp'];

  internationals = {
    eu: false,
    eu_ch: false,
    inland: false
  };

  constructor(
      private route: ActivatedRoute,
      private ledger: LedgerService,
      private location: Location
  ) {}

  async ngOnInit() {
    this.tourId = this.route.snapshot.paramMap.get('id')!;
    this.tour = await this.ledger.getTourById('alice', this.tourId);
    if (!this.tour) return;

    this.displayWaypoints = this.tour.waypoints.map((wp, i) => ({
      idx: i + 1,
      lon: wp.longitude,
      lat: wp.latitude,
      timestamp: new Date(wp.timestamp).toLocaleString()
    }));

    const intl = this.tour.internationaleFahrten ?? false;
    this.internationals = {
      eu:      intl,
      eu_ch:   intl,
      inland: !intl
    };
  }

  goBack(): void {
    this.location.back();
  }
}
