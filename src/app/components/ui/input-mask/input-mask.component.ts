import {Component, Input} from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule} from '@angular/forms';


@Component({
  selector: 'app-input-mask',
  standalone: true,
  imports: [NgxMaskDirective, NgxMaskPipe,FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './input-mask.component.html',
  styleUrl: './input-mask.component.scss'
})
export class InputMaskComponent {
  @Input() label!: string ;
  @Input() mask!: string ;
  @Input() type!: string ;
  @Input() placeholder!: string ;
  value: string ="" ;
}
