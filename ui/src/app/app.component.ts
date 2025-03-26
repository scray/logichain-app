import {Component} from '@angular/core';
import {HomeComponent} from './home/home.component';
import {RouterLink, RouterOutlet} from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'homes';
}