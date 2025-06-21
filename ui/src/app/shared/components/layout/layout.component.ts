import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent, Task } from '../sidebar/sidebar.component';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, SidebarComponent, PageHeaderComponent],
    template: `
        <div class="layout-with-sidebar">
            <!-- Sidebar -->
            <app-sidebar [tasks]="sidebarTasks"></app-sidebar>

            <!-- Content Area -->
            <div class="content-area">
                <!-- Orange Header -->
                <div class="topbar-orange">
                    <app-page-header>
                        <ng-content select="[header]"></ng-content>
                    </app-page-header>
                </div>

                <!-- Main Content -->
                <div class="main-content">
                    <ng-content select="[content]"></ng-content>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
    @Input() sidebarTasks: Task[] = [];
}