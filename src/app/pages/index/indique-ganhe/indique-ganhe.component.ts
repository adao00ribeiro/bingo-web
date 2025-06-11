import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { PunterService } from '../../../services/punter/punter.service';
import { IIndicateTagResponse } from '../../../interfaces/IIndicateTagResponse';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
  ],
  templateUrl: './indique-ganhe.component.html',
  styleUrl: './indique-ganhe.component.scss'
})
export class IndiqueGanheComponent implements OnInit {
  private punterService: PunterService = inject(PunterService);
  indicateTag: string = '';

  constructor() { }

  ngOnInit(): void {
    this.punterService.GetIndicateTag().subscribe({
      next: (data: IIndicateTagResponse) => {
        this.indicateTag = data.indicateTag;
      },
      error: (err) => {
        console.log(">> err: ", err)
      },
      complete: () => {
        console.log(">> complete: ")
      }
    })
  }
}
