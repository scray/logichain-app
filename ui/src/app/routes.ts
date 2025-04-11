import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TourDetailsComponent } from './tour-details/tour-details.component';

const routeConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home'
  },

  {
    path: 'details/:id',
    component: TourDetailsComponent,
    title: 'Tour Details'
  },
  { path: 'tour/:id', component: TourDetailsComponent }

];

export default routeConfig;
