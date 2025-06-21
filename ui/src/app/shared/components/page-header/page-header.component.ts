import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-page-header',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-header-content">
      <ng-content></ng-content>
    </div>
  `,
    styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent {}