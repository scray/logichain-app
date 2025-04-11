import {Component} from '@angular/core';
import {HomeComponent} from './home/home.component';
import {RouterLink, RouterOutlet} from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink,],
  template: `
 <header class="topbar">
      <div class="brand">LogiChain Web App</div>
      <nav>
        <a routerLink="/home">Home</a>
        <a routerLink="/tours">Tours</a>
      </nav>
    </header>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'homes';
}