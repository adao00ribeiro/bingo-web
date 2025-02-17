import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button-menu',
  standalone: true,
  imports: [MatButtonModule,MatIconModule],
  templateUrl: './button-menu.component.html',
  styleUrl: './button-menu.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ButtonMenuComponent {
  @Input() descricao!: string;
  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    this.onClick.emit();
  }
}
