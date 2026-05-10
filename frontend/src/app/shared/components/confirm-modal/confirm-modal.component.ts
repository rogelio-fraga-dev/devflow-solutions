import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open()) {
      <div class="modal-overlay" (click)="cancel.emit()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>{{ title() }}</h3>
          <p>{{ message() }}</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" (click)="cancel.emit()">Cancelar</button>
            <button class="btn btn-danger" (click)="confirm.emit()">{{ confirmLabel() }}</button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmModalComponent {
  open         = input(false);
  title        = input('Confirmar');
  message      = input('Tem certeza?');
  confirmLabel = input('Confirmar');
  confirm      = output<void>();
  cancel       = output<void>();
}
