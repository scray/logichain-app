import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {TourDetailsComponent} from './tour-details/tour-details.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  },
  {
    path: 'details/:id',
    component: TourDetailsComponent,
    title: 'Home details',
  },
  { path: 'tour/:id', component: TourDetailsComponent }
];
export default routeConfig;