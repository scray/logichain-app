import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Task {
    label: string;
    completed?: boolean;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    template: `
        <aside class="sidebar">
            <div class="tasks-container">
                <h3 class="tasks-title">Aufgaben</h3>

                <div class="task-item" *ngFor="let task of tasks">
                    <span class="task-checkbox" [class.completed]="task.completed"></span>
                    <span class="task-label">{{task.label}}</span>
                </div>
            </div>
        </aside>
    `,
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    @Input() tasks: Task[] = [];
}