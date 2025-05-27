
import { Routes } from '@angular/router';

import { HomeComponent }        from './home/home.component';
import { TourListComponent }    from './tours/tour-list.component';
import { TourDetailsComponent } from './tour-details/tour-details.component';

export const routes: Routes = [
  { path: '',          component: HomeComponent },
  { path: 'tours',     component: TourListComponent },
  { path: 'tours/:id', component: TourDetailsComponent },
  { path: '**',        redirectTo: '' }
];
