import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import LedgerService from '../../../logbook.service';
import { Waypoint } from '../../models/waypoint';

@Component({
    selector: 'app-add-waypoint',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, MatSnackBarModule],
    template: `
    <div class="add-waypoint-section">
      <h3>Waypoint hinzufügen</h3>
      
      <div class="waypoint-form">
        <div class="form-group">
          <label>Breitengrad (Latitude)</label>
          <input 
            type="number" 
            [(ngModel)]="latitude" 
            placeholder="z.B. 52.520008"
            step="0.000001"
            min="-90"
            max="90"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label>Längengrad (Longitude)</label>
          <input 
            type="number" 
            [(ngModel)]="longitude" 
            placeholder="z.B. 13.404954"
            step="0.000001"
            min="-180"
            max="180"
            class="form-input"
          />
        </div>
        
        <div class="form-actions">
          <button 
            class="btn btn-primary" 
            (click)="addWaypoint()"
            [disabled]="isAdding || !isValidCoordinate()"
          >
            <mat-icon *ngIf="!isAdding">add_location</mat-icon>
            <span *ngIf="!isAdding">Waypoint hinzufügen</span>
            <span *ngIf="isAdding">Wird hinzugefügt...</span>
          </button>
          
          <button 
            class="btn btn-secondary" 
            (click)="testLocations()"
            [disabled]="isAdding"
          >
            <mat-icon>science</mat-icon>
            Test-Locations
          </button>
        </div>
      </div>
      
      <!-- Test Location Buttons -->
      <div class="test-locations" *ngIf="showTestLocations">
        <h4>Test-Koordinaten:</h4>
        <div class="test-buttons">
          <button 
            class="test-btn"
            (click)="setTestLocation('berlin')"
            title="Berlin, Deutschland"
          >
            🇩🇪 Berlin
          </button>
          <button 
            class="test-btn"
            (click)="setTestLocation('paris')"
            title="Paris, Frankreich"
          >
            🇫🇷 Paris
          </button>
          <button 
            class="test-btn"
            (click)="setTestLocation('zurich')"
            title="Zürich, Schweiz"
          >
            🇨🇭 Zürich
          </button>
          <button 
            class="test-btn"
            (click)="setTestLocation('london')"
            title="London, UK (nicht mehr EU)"
          >
            🇬🇧 London
          </button>
          <button 
            class="test-btn"
            (click)="setTestLocation('cairo')"
            title="Kairo, Ägypten (außerhalb Europa)"
          >
            🇪🇬 Kairo
          </button>
        </div>
      </div>
      
      <!-- Error Display -->
      <div class="error-message" *ngIf="errorMessage">
        <mat-icon>error</mat-icon>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  `,
    styleUrls: ['./add-waypoint.component.css']
})
export class AddWaypointComponent {
    @Input() tourId!: string;
    @Input() userId: string = 'alice';
    @Output() waypointAdded = new EventEmitter<Waypoint>();

    latitude?: number;
    longitude?: number;
    isAdding = false;
    showTestLocations = false;
    errorMessage = '';

    testCoordinates = {
        berlin: { lat: 52.520008, lon: 13.404954, name: 'Berlin, Deutschland' },
        paris: { lat: 48.8566, lon: 2.3522, name: 'Paris, Frankreich' },
        zurich: { lat: 47.3769, lon: 8.5417, name: 'Zürich, Schweiz' },
        london: { lat: 51.5074, lon: -0.1278, name: 'London, UK' },
        cairo: { lat: 30.0444, lon: 31.2357, name: 'Kairo, Ägypten' }
    };

    constructor(
        private ledgerService: LedgerService,
        private snackBar: MatSnackBar
    ) {}

    isValidCoordinate(): boolean {
        return this.latitude !== undefined &&
            this.longitude !== undefined &&
            this.latitude >= -90 &&
            this.latitude <= 90 &&
            this.longitude >= -180 &&
            this.longitude <= 180;
    }

    async addWaypoint() {
        if (!this.isValidCoordinate()) return;

        this.isAdding = true;
        this.errorMessage = '';

        const waypoint: Waypoint = {
            latitude: this.latitude!,
            longitude: this.longitude!,
            timestamp: Math.floor(Date.now() / 1000)
        };

        try {
            const success = await this.ledgerService.addWaypoint(this.userId, this.tourId, waypoint);

            if (success) {
                this.snackBar.open('Waypoint erfolgreich hinzugefügt!', 'OK', {
                    duration: 3000,
                    panelClass: ['success-snackbar']
                });

                this.waypointAdded.emit(waypoint);

                // Reset form
                this.latitude = undefined;
                this.longitude = undefined;
            }
        } catch (error: any) {
            console.error('Error adding waypoint:', error);

            // Zeige spezifische Fehlermeldung
            if (error.message) {
                this.errorMessage = error.message;
                this.snackBar.open(error.message, 'OK', {
                    duration: 5000,
                    panelClass: ['error-snackbar']
                });
            } else {
                this.errorMessage = 'Fehler beim Hinzufügen des Waypoints';
                this.snackBar.open('Fehler beim Hinzufügen des Waypoints', 'OK', {
                    duration: 3000,
                    panelClass: ['error-snackbar']
                });
            }
        } finally {
            this.isAdding = false;
        }
    }

    testLocations() {
        this.showTestLocations = !this.showTestLocations;
    }

    setTestLocation(location: keyof typeof this.testCoordinates) {
        const coords = this.testCoordinates[location];
        this.latitude = coords.lat;
        this.longitude = coords.lon;
        this.errorMessage = '';

        this.snackBar.open(`Test-Location: ${coords.name}`, 'OK', {
            duration: 2000
        });
    }
}