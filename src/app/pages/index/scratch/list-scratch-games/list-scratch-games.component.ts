import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PunterMeResource } from '../../../../resource/punter/punter-me.resource';
import { ScratchSellerGameResource } from '../../../../resource/scratch/scratch-seller-game.resource';
import { CurrencyPipe } from '../../../../pipes/currency.pipe';

@Component({
  selector: 'app-list-scratch-games',
  imports: [CurrencyPipe],
  templateUrl: './list-scratch-games.component.html',
  styleUrl: './list-scratch-games.component.scss'
})
export class ListScratchGamesComponent implements OnInit {
  enabledScratch: boolean = false;
  private router: Router = inject(Router);
  protected readonly punterMeResource = inject(PunterMeResource);
  protected readonly scratchSellerGameResource = inject(ScratchSellerGameResource);
  scratchSellerGames = computed(() => this.scratchSellerGameResource.resource.value()?.rows || undefined);


  constructor() {

    effect(() => {
      var user = this.punterMeResource.resource.value();
      this.enabledScratch = user.seller.settings.enabledScratch
      if (!this.enabledScratch) {
        this.router.navigate(['/']);
      }
    })
  }
  ngOnInit(): void {
   this.scratchSellerGameResource.reload();
  }
  play(scratchSellerGameId:string){
      this.router.navigate(['/scratch' , scratchSellerGameId]);
  }
  getMaxPayout(payoutTable?: { multiplier: number; prize: number }[]): number {
  if (!payoutTable || payoutTable.length === 0) return 0;
  return Math.max(...payoutTable.map(p => p.prize));
}
}
