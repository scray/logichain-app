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
import { Task }               from '../shared/components/sidebar/sidebar.component';
import { LayoutComponent }    from '../shared/components/layout/layout.component';
import { SearchFilterBarComponent } from '../shared/components/search-filter-bar/search-filter-bar.component';
import { FilterDialogComponent, FilterOptions } from '../shared/components/filter-dialog/filter-dialog.component';

interface TourRow {
    number:    string;
    title:     string;
    driver:    string;
    date:      string;
    vehicleId: string;
    // Für Filterung
    startTime: number;
    internationaleFahrten?: any;
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
        MatTableModule,
        LayoutComponent,
        SearchFilterBarComponent,
        FilterDialogComponent
    ],
    templateUrl: './tour-list.component.html',
    styleUrls:  ['./tour-list.component.css']
})
export class TourListComponent implements OnInit {
    displayedColumns: string[] = ['number','title','driver','date','vehicleId'];
    dataSource: TourRow[] = [];
    filteredDataSource: TourRow[] = [];

    showFilterDialog = false;
    availableDrivers: string[] = [];
    availableVehicles: string[] = [];
    activeFilters: FilterOptions = {};

    // Tasks für die Sidebar
    sidebarTasks: Task[] = [
        { label: 'Tour 3 bearbeiten' },
        { label: 'Tour 6 anpassen' },
        { label: 'Tour 1 validieren' },
        { label: 'Tour 4 anreichern' },
        { label: 'Tour 5 anreichern' }
    ];

    constructor(private ledger: LedgerService) {}

    async ngOnInit() {
        try {
            const tours: Tour[] = await this.ledger.getAllTours();
            this.dataSource = tours.map(t => ({
                number:    t.tourId,
                title:     `Tour ${t.tourId}`,
                driver:    t.userId,
                date:      new Date(t.startTime).toLocaleDateString('de-DE'),
                vehicleId: t.vehiceId ?? '',
                startTime: t.startTime,
                internationaleFahrten: t.internationaleFahrten
            }));

            // Extrahiere verfügbare Fahrer und Fahrzeuge
            this.availableDrivers = [...new Set(this.dataSource.map(t => t.driver))].sort();
            this.availableVehicles = [...new Set(this.dataSource.map(t => t.vehicleId).filter(v => v))].sort();

            this.filteredDataSource = [...this.dataSource];
        } catch (err) {
            console.error('Konnte Touren nicht laden:', err);
            this.dataSource = [];
            this.filteredDataSource = [];
        }
    }

    onSearchChanged(searchTerm: string) {
        this.applyAllFilters(searchTerm);
    }

    onFilterClicked() {
        this.showFilterDialog = true;
    }

    onFilterDialogClosed() {
        this.showFilterDialog = false;
    }

    onFiltersApplied(filters: FilterOptions) {
        this.activeFilters = filters;
        this.applyAllFilters();
    }

    private applyAllFilters(searchTerm: string = '') {
        let filtered = [...this.dataSource];

        // Suchfilter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(tour =>
                tour.number.toLowerCase().includes(search) ||
                tour.title.toLowerCase().includes(search) ||
                tour.driver.toLowerCase().includes(search) ||
                tour.vehicleId.toLowerCase().includes(search)
            );
        }

        // Datumsfilter
        if (this.activeFilters.startDate) {
            const startDate = new Date(this.activeFilters.startDate).getTime();
            filtered = filtered.filter(tour => tour.startTime >= startDate);
        }

        if (this.activeFilters.endDate) {
            const endDate = new Date(this.activeFilters.endDate).getTime() + 86400000; // +1 Tag
            filtered = filtered.filter(tour => tour.startTime <= endDate);
        }

        // Fahrer Filter
        if (this.activeFilters.driver) {
            filtered = filtered.filter(tour => tour.driver === this.activeFilters.driver);
        }

        // Fahrzeug Filter
        if (this.activeFilters.vehicleId) {
            filtered = filtered.filter(tour => tour.vehicleId === this.activeFilters.vehicleId);
        }

        // Internationale Fahrten Filter
        if (this.activeFilters.internationalType && this.activeFilters.internationalType !== 'all') {
            filtered = filtered.filter(tour => {
                const intl = tour.internationaleFahrten;
                if (!intl) return false;

                switch(this.activeFilters.internationalType) {
                    case 'inland':
                        return intl.inland === true;
                    case 'eu':
                        return intl.eu === true;
                    case 'eu_ch':
                        return intl.eu_ch === true;
                    default:
                        return true;
                }
            });
        }

        this.filteredDataSource = filtered;
    }
}