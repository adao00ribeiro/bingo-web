import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
 @Input() search = '';
  @Input() filtersDrawer = false;
  @Input() isSearching = false;
  @Input() canClear = false;
  @Output() searchChange = new EventEmitter<string>();
  @Output() filtersDrawerChange = new EventEmitter<boolean>();
  @Output() clean = new EventEmitter<void>();
}
