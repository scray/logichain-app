// src/app/tours/tour-list.component.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule }       from '@angular/router';
import { MatToolbarModule }   from '@angular/material/toolbar';
import { MatIconModule }      from '@angular/material/icon';
import { MatButtonModule }    from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatTableModule }     from '@angular/material/table';

import LedgerService          from '../logbook.service';
import { Tour }               from '../shared/models/tour';

interface TourRow {
    number:    string;
    title:     string;
    driver:    string;
    date:      string;
    vehicleId: string;
}

@Component({
    selector: 'app-tour-list',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule
    ],
    templateUrl: './tour-list.component.html',
    styleUrls:  ['./tour-list.component.css']
})
export class TourListComponent implements OnInit {
    displayedColumns: string[] = ['number','title','driver','date','vehicleId'];
    dataSource: TourRow[] = [];

    constructor(private ledger: LedgerService) {}

    async ngOnInit() {
        try {
            const tours: Tour[] = await this.ledger.getAllTours();
            this.dataSource = tours.map(t => ({
                number:    t.tourId,
                title:     `Tour ${t.tourId}`,
                driver:    t.userId,
                date:      new Date(t.startTime).toLocaleDateString('de-DE'),
                vehicleId: t.vehiceId ?? ''
            }));
        } catch (err) {
            console.error('Konnte Touren nicht laden:', err);
            this.dataSource = [];
        }
    }
}
