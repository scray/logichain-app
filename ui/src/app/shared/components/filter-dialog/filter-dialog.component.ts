import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  driver?: string;
  vehicleId?: string;
  internationalType?: 'all' | 'eu' | 'eu_ch' | 'inland';
}

@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="filter-overlay" *ngIf="isOpen" (click)="onOverlayClick($event)">
      <div class="filter-dialog" @slideIn>
        <div class="filter-header">
          <h3>Filter</h3>
          <button class="close-btn" (click)="close()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <div class="filter-content">
          <!-- Datumsbereich -->
          <div class="filter-section">
            <label class="filter-label">Zeitraum</label>
            <div class="date-range">
              <input 
                type="date" 
                [(ngModel)]="filters.startDate"
                class="date-input"
                placeholder="Von"
              />
              <span class="date-separator">bis</span>
              <input 
                type="date" 
                [(ngModel)]="filters.endDate"
                class="date-input"
                placeholder="Bis"
              />
            </div>
          </div>
          
          <!-- Fahrer -->
          <div class="filter-section">
            <label class="filter-label">Fahrer</label>
            <select [(ngModel)]="filters.driver" class="filter-select">
              <option value="">Alle Fahrer</option>
              <option *ngFor="let driver of availableDrivers" [value]="driver">
                {{driver}}
              </option>
            </select>
          </div>
          
          <!-- Fahrzeug -->
          <div class="filter-section">
            <label class="filter-label">Fahrzeug</label>
            <select [(ngModel)]="filters.vehicleId" class="filter-select">
              <option value="">Alle Fahrzeuge</option>
              <option *ngFor="let vehicle of availableVehicles" [value]="vehicle">
                {{vehicle}}
              </option>
            </select>
          </div>
          
          <!-- Internationale Fahrten -->
          <div class="filter-section">
            <label class="filter-label">Fahrttyp</label>
            <div class="radio-group">
              <label class="radio-item">
                <input 
                  type="radio" 
                  name="internationalType" 
                  value="all"
                  [(ngModel)]="filters.internationalType"
                />
                <span>Alle Fahrten</span>
              </label>
              <label class="radio-item">
                <input 
                  type="radio" 
                  name="internationalType" 
                  value="inland"
                  [(ngModel)]="filters.internationalType"
                />
                <span>Nur Inland</span>
              </label>
              <label class="radio-item">
                <input 
                  type="radio" 
                  name="internationalType" 
                  value="eu"
                  [(ngModel)]="filters.internationalType"
                />
                <span>EU Fahrten</span>
              </label>
              <label class="radio-item">
                <input 
                  type="radio" 
                  name="internationalType" 
                  value="eu_ch"
                  [(ngModel)]="filters.internationalType"
                />
                <span>EU + Schweiz</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="filter-footer">
          <button class="btn btn-secondary" (click)="resetFilters()">
            Zurücksetzen
          </button>
          <button class="btn btn-primary" (click)="applyFilters()">
            Anwenden
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent {
  @Input() isOpen = false;
  @Input() availableDrivers: string[] = [];
  @Input() availableVehicles: string[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() filtersApplied = new EventEmitter<FilterOptions>();
  
  filters: FilterOptions = {
    internationalType: 'all'
  };
  
  close() {
    this.isOpen = false;
    this.closed.emit();
  }
  
  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('filter-overlay')) {
      this.close();
    }
  }
  
  resetFilters() {
    this.filters = {
      internationalType: 'all'
    };
  }
  
  applyFilters() {
    this.filtersApplied.emit({...this.filters});
    this.close();
  }
}