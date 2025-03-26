import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import HousingService from '../logbook.service';
import { Tour } from '../shared/models/tour';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  imports: [CommonModule, MatTableModule,   MatTableModule, MatSortModule],
  template: `
    <section>
      <h2>Tours</h2>
      <table mat-table [dataSource]="housingLocationList" matSort class="mat-elevation-z8">

        <!-- Tour ID Column -->
        <ng-container matColumnDef="tourId">
          <th mat-header-cell *matHeaderCellDef> Name </th>
          <td mat-cell *matCellDef="let tour"> {{ tour.tourId }} </td>
        </ng-container>

        <!-- Start Time Column -->
        <ng-container matColumnDef="startTime">
          <th mat-header-cell *matHeaderCellDef> Start </th>
          <td mat-cell *matCellDef="let tour"> {{ tour.startTime * 1000 | date:'yyyy-MM-dd HH:mm' }} </td>
        </ng-container>

        <!-- End Time Column -->
        <ng-container matColumnDef="endTime">
          <th mat-header-cell *matHeaderCellDef> End </th>
          <td mat-cell *matCellDef="let tour"> {{ tour.endTime * 1000 | date:'yyyy-MM-dd HH:mm' }} </td>
        </ng-container>


        <!-- Header and Row Declarations -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"
          (click)="goToDetails(row.tourId)"
          class="clickable-row">
        ></tr>
      </table>
    </section>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  housingLocationList: Tour[] = [];  
  displayedColumns: string[] = ['tourId', 'startTime', 'endTime'];
  housingService: HousingService = inject(HousingService);  
  router: Router = inject(Router);

  constructor() {    
    this.housingService.getAllTours().then((housingLocationList: Tour[]) => 
      {      this.housingLocationList = housingLocationList;  });  
  }

  goToDetails(id: string) {
    this.router.navigate(['/tour', id]);
  }
}