import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CheckboxOption {
    id: string;
    label: string;
    description: string;
    checked: boolean;
}

@Component({
    selector: 'app-checkbox-group',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="checkbox-container">
      <div class="checkbox-item" *ngFor="let option of options">
        <div>
          <div class="checkbox-header">
            <input 
              type="checkbox"
              [id]="option.id"
              [checked]="option.checked"
              (change)="onCheckboxChange(option.id, $event)"
            />
            <label [for]="option.id" class="checkbox-label">{{option.label}}</label>
          </div>
          <div class="checkbox-description">{{option.description}}</div>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./checkbox-group.component.css']
})
export class CheckboxGroupComponent {
    @Input() options: CheckboxOption[] = [];
    @Output() optionChanged = new EventEmitter<{id: string, checked: boolean}>();

    onCheckboxChange(id: string, event: Event) {
        const checkbox = event.target as HTMLInputElement;
        this.optionChanged.emit({ id, checked: checkbox.checked });
    }
}