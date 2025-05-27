import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule }            from '@angular/forms';
import { MatToolbarModule }       from '@angular/material/toolbar';
import { MatIconModule }          from '@angular/material/icon';
import { MatButtonModule }        from '@angular/material/button';
import { MatCheckboxModule }      from '@angular/material/checkbox';
import { MatTableModule }         from '@angular/material/table';

interface Waypoint {
  idx: number;
  name: string;
  lon: string;
  lat: string;
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
  title = 'Tour 1';
  driver = 'Meier';
  date = '1.1.2025';
  vehicle = 'PKW-13';
  internationals = {
    eu: true,
    eu_ch: true,
    inland: false
  };
  waypoints: Waypoint[] = [];
  displayedColumns = ['idx','name','lon','lat','timestamp'];

  constructor(
    private route: ActivatedRoute,
    private location: Location       // ← Location injizieren
  ) {}

  ngOnInit() {
    this.tourId = this.route.snapshot.paramMap.get('id')!;
    this.waypoints = [
      {idx:1, name:'Freiburg',    lon:'1.211', lat:'1.2311', timestamp:'1.1.2025,14:30'},
      {idx:2, name:'Offenburg',   lon:'1.211', lat:'1.2311', timestamp:'1.1.2025,15:30'},
      {idx:3, name:'Karlsruhe',   lon:'1.211', lat:'1.2311', timestamp:'1.1.2025,16:30'},
      {idx:4, name:'Frankfurt',   lon:'1.211', lat:'1.2311', timestamp:'1.1.2025,17:30'},
      {idx:5, name:'Hamburg',     lon:'1.211', lat:'1.2311', timestamp:'1.1.2025,18:30'}
    ];
  }

  goBack(): void {
    this.location.back();   // ← ruft Browser-History auf
  }
}
