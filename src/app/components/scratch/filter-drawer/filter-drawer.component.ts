import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-drawer',
  imports: [CommonModule],
  templateUrl: './filter-drawer.component.html',
  styleUrl: './filter-drawer.component.scss',
})
export class FilterDrawerComponent {
@Input() value = false;
  @Input() canClear = false;
  @Output() valueChange = new EventEmitter<boolean>();
  @Output() clean = new EventEmitter<void>();

  close(): void {
    this.valueChange.emit(false);
  }

  onClean(): void {
    this.clean.emit();
    this.close();
  }
}
