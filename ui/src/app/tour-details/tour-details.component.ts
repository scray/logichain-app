import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import LedgerService from '../logbook.service';
import { Tour } from '../shared/models/tour';
import { InternationaleFahrten } from '../shared/models/internationale-fahrten';
import { Task } from '../shared/components/sidebar/sidebar.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { CheckboxGroupComponent, CheckboxOption } from '../shared/components/checkbox-group/checkbox-group.component';
import { AddWaypointComponent } from '../shared/components/add-waypoint/add-waypoint.component';
import { Waypoint } from '../shared/models/waypoint';
import { DocumentUploadComponent } from '../shared/components/document-upload/document-upload.component';
import { DocumentService } from '../document.service';
import { Document } from '../shared/models/document';

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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    LayoutComponent,
    CheckboxGroupComponent,
    AddWaypointComponent,
    DocumentUploadComponent
  ],
  templateUrl: './tour-details.component.html',
  styleUrls: ['./details.component.css']
})
export class TourDetailsComponent implements OnInit {
  tourId!: string;
  tour?: Tour;
  displayWaypoints: DisplayWP[] = [];
  displayedColumns: string[] = ['idx','lon','lat','timestamp'];
  documents: Document[] = [];
  isSaving: boolean = false;

  sidebarTasks: Task[] = [
    { label: 'Tour 3 bearbeiten' },
    { label: 'Tour 6 anpassen' },
    { label: 'Tour 4 löschen' },
    { label: 'Schweiz Tour 1' },
    { label: 'EU Ausland Tour 3' }
  ];

  // Checkbox Optionen für internationale Fahrten
  get checkboxOptions(): CheckboxOption[] {
    return [
      {
        id: 'eu',
        label: 'EU',
        description: 'Fahrt innerhalb der EU',
        checked: this.internationals.eu
      },
      {
        id: 'eu_ch',
        label: 'EU + Schweiz',
        description: 'Fahrt innerhalb EU und Schweiz',
        checked: this.internationals.eu_ch
      },
      {
        id: 'inland',
        label: 'Inland',
        description: 'Nur Inland Fahrt',
        checked: this.internationals.inland
      }
    ];
  }

  // Direkte Bindung an die Tour-Daten
  get internationals(): InternationaleFahrten {
    return this.tour?.internationaleFahrten ?? {
      eu: false,
      eu_ch: false,
      inland: true
    };
  }

  constructor(
      private route: ActivatedRoute,
      private ledger: LedgerService,
      private location: Location,
      private snackBar: MatSnackBar,
      private documentService: DocumentService
  ) {
    console.log('TourDetailsComponent constructor called');
  }

  async ngOnInit() {
    console.log('ngOnInit called');
    try {
      this.tourId = this.route.snapshot.paramMap.get('id')!;
      console.log('Loading tour with ID:', this.tourId);

      this.documents = await this.documentService.getDocuments('alice', this.tourId);
      console.log('Documents loaded:', this.documents);

      this.tour = await this.ledger.getTourById('alice', this.tourId);

      if (!this.tour) {
        console.error('Tour not found');
        this.snackBar.open('Tour nicht gefunden!', 'OK', {
          duration: 3000
        });
        return;
      }

      console.log('Tour loaded:', this.tour);
      console.log('Internationale Fahrten:', this.tour.internationaleFahrten);

      // Waypoints vorbereiten
      if (this.tour.waypoints && this.tour.waypoints.length > 0) {
        this.displayWaypoints = this.tour.waypoints.map((wp, i) => ({
          idx: i + 1,
          lon: wp.longitude,
          lat: wp.latitude,
          timestamp: new Date(wp.timestamp * 1000).toLocaleString('de-DE')
        }));
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      this.documents = [];
      console.error('Error loading tour:', error);
      this.snackBar.open('Fehler beim Laden der Tour!', 'OK', {
        duration: 3000
      });
    }
  }

  // Format date helper
  formatDate(timestamp: number | undefined): string {
    if (!timestamp) return 'Datum';
    return new Date(timestamp).toLocaleDateString('de-DE');
  }

  // Format date with time
  formatDateTime(timestamp: number | undefined): string {
    if (!timestamp) return 'Keine Zeit';
    return new Date(timestamp).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Calculate route duration
  getRouteDuration(): string {
    if (!this.tour || !this.tour.waypoints || this.tour.waypoints.length < 2) {
      return 'Keine Dauer';
    }

    const firstWaypoint = this.tour.waypoints[0];
    const lastWaypoint = this.tour.waypoints[this.tour.waypoints.length - 1];

    const durationMs = (lastWaypoint.timestamp - firstWaypoint.timestamp) * 1000;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} Minuten`;
  }

  // Handler für Checkbox-Gruppe
  onCheckboxGroupChange(event: {id: string, checked: boolean}) {
    console.log(`Checkbox ${event.id} changed to ${event.checked}`);
    this.onInternationalChange(event.id as keyof InternationaleFahrten, event.checked);
  }

  // Handler für Checkbox-Änderungen
  onInternationalChange(type: keyof InternationaleFahrten, value: boolean) {
    if (!this.tour) {
      console.error('No tour loaded');
      return;
    }

    console.log(`Changing ${type} to ${value}`);

    // Erstelle eine Kopie der aktuellen internationaleFahrten
    const newInternationalefahrten: InternationaleFahrten = {
      ...this.internationals,
      [type]: value
    };

    // Logik für gegenseitige Ausschlüsse
    if ((type === 'eu' || type === 'eu_ch') && value) {
      newInternationalefahrten.inland = false;
    } else if (type === 'inland' && value) {
      newInternationalefahrten.eu = false;
      newInternationalefahrten.eu_ch = false;
    }

    // Update the tour object
    this.tour = {
      ...this.tour,
      internationaleFahrten: newInternationalefahrten
    };

    console.log('Updated internationaleFahrten:', this.tour.internationaleFahrten);
  }

  // Event Handler für Docs
  async onDocumentUploaded(document: Document) {
    console.log('Document uploaded:', document);

    // Tour neu laden um die aktualisierten Dokumente anzuzeigen
    try {
      this.documents = await this.documentService.getDocuments('alice', this.tourId);

      this.snackBar.open('Dokument erfolgreich hochgeladen!', 'OK', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    } catch (error) {
      console.error('Error reloading documents:', error);
    }
  }

  onDocumentDeleted(fileName: string) {
    console.log('Document deleted:', fileName);
    // Liste ist bereits im Component aktualisiert
  }

  // Speichern der Änderungen
  async saveChanges() {
    console.log('saveChanges called');

    if (!this.tour) {
      console.error('No tour loaded');
      return;
    }

    if (this.isSaving) {
      console.log('Already saving, skipping');
      return;
    }

    console.log('Saving changes for tour:', this.tourId);
    console.log('InternationaleFahrten to save:', this.tour.internationaleFahrten);

    this.isSaving = true;

    try {
      const success = await this.ledger.updateTourInternationaleFahrten(
          'alice',
          this.tourId,
          this.tour.internationaleFahrten!
      );

      if (success) {
        console.log('Successfully saved changes');
        this.snackBar.open('Änderungen erfolgreich gespeichert!', 'OK', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      } else {
        throw new Error('Update failed - API returned false');
      }
    } catch (error: any) {
      console.error('Error saving changes:', error);

      let errorMessage = 'Fehler beim Speichern der Änderungen!';

      if (error.message) {
        if (error.message.includes('AUTHORIZATION_ERROR:')) {
          // Extrahiere die Fehlermeldung nach AUTHORIZATION_ERROR:
          errorMessage = error.message.replace('AUTHORIZATION_ERROR: ', '');
        } else {
          // Verwende die direkte Fehlermeldung
          errorMessage = error.message;
        }
      }

      this.snackBar.open(errorMessage, 'OK', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isSaving = false;
    }
  }

  goBack(): void {
    console.log('goBack called');
    this.location.back();
  }

  async onWaypointAdded(waypoint: Waypoint) {
    console.log('Waypoint added:', waypoint);

    // Tour neu laden um die aktualisierten Waypoints anzuzeigen
    try {
      this.tour = await this.ledger.getTourById('alice', this.tourId);

      if (this.tour && this.tour.waypoints) {
        this.displayWaypoints = this.tour.waypoints.map((wp, i) => ({
          idx: i + 1,
          lon: wp.longitude,
          lat: wp.latitude,
          timestamp: new Date(wp.timestamp * 1000).toLocaleString('de-DE')
        }));
      }

      this.snackBar.open('Tour erfolgreich aktualisiert!', 'OK', {
        duration: 2000,
        panelClass: ['success-snackbar']
      });
    } catch (error) {
      console.error('Error reloading tour:', error);
    }
  }
}