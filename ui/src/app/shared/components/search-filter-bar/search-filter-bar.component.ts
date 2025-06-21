import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-search-filter-bar',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule],
    template: `
        <div class="search-filter-container">
            <div class="search-box">
                <mat-icon>search</mat-icon>
                <input
                        type="text"
                        placeholder="Suche Touren"
                        [(ngModel)]="searchTerm"
                        (ngModelChange)="onSearchChange()"
                />
            </div>
            <div class="filter-box" (click)="onFilterClick()">
                <mat-icon>filter_list</mat-icon>
                <span>Filtern</span>
            </div>
        </div>
    `,
    styleUrls: ['./search-filter-bar.component.css']
})
export class SearchFilterBarComponent {
    @Output() searchChanged = new EventEmitter<string>();
    @Output() filterClicked = new EventEmitter<void>();

    searchTerm: string = '';

    onSearchChange() {
        this.searchChanged.emit(this.searchTerm);
    }

    onFilterClick() {
        this.filterClicked.emit();
    }
}