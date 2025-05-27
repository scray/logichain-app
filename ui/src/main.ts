

import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { provideRouter }                                           from '@angular/router';
import { AppComponent }                                           from './app/app.component';
import { routes as routeConfig }                                  from './app/routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideProtractorTestingSupport(),
    provideRouter(routeConfig)
  ]
})
.catch((err) => console.error(err));
