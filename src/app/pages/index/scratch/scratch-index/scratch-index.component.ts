import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ScratchHelperService } from '../../../../services/scratch/scratch-helper.service';
import { IScratchGameOverrideResponse } from '../../../../interfaces/response/scratch/IScratchGameOverrideResponse';
import { ScratchGameOverrideResource } from '../../../../resource/scratch/scratch-game-override.resource';
import { PunterMeResource } from '../../../../resource/punter/punter-me.resource';
import { HeaderComponent } from "../../../../components/scratch/header/header.component";
import { SearchResultsComponent } from "../../../../components/scratch/search-results/search-results.component";
import { HomeSectionsComponent } from "../../../../components/scratch/home-sections/home-sections.component";
import { FilterDrawerComponent } from '../../../../components/scratch/filter-drawer/filter-drawer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scratch-index',
  imports: [CommonModule,HeaderComponent, SearchResultsComponent, HomeSectionsComponent,FilterDrawerComponent],
  templateUrl: './scratch-index.component.html',
  styleUrl: './scratch-index.component.scss',
})
export class ScratchIndexComponent {

  protected readonly punterMeResource = inject(PunterMeResource);
   protected readonly scratchGameOverrideResource = inject(ScratchGameOverrideResource);
   scratchGameOverrides = computed(() => this.scratchGameOverrideResource.resource.value()?.rows || undefined);

  allGames: IScratchGameOverrideResponse[] = [];
  filteredGames: IScratchGameOverrideResponse[] = [];
  recentGames: IScratchGameOverrideResponse[] = [];
  lastPlayedGames: IScratchGameOverrideResponse[] = [];
  enabledScratch: boolean = false;
  loading = true;
  loadingSearch = false;
  refreshing = false;
  search = '';
  filtersDrawer = false;

  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  get isSearching(): boolean {
    return !!(this.search || '').trim();
  }

  get canClear(): boolean {
    return !!(this.search || '').trim();
  }

  constructor(
    private scratchcardService: ScratchHelperService,
    private router: Router
  ) {

  effect(() => {
      var user = this.punterMeResource.resource.value();
      var teste = this.scratchGameOverrideResource.resource.value()?.rows;

      if(!user){
        return
      }
      this.enabledScratch = user.onlineHouse.settings.enabledScratch
      if (!this.enabledScratch) {
        this.router.navigate(['/']);
      }
      if(teste?.length !=0){
       this.loadGames();
      }
    })


  }

  async ngOnInit(): Promise<void> {
    this.restoreFilters();
    this.scratchGameOverrideResource.reload({page:1 , size:5000});

  }

  ngOnDestroy(): void {
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
  }

  onSearchChange(value: string): void {
    this.search = value;
    this.loadingSearch = true;
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => this.applySearch(), 400);
  }

  async loadGames(): Promise<void> {
    this.loading = true;
    try {
      const all = this.scratchGameOverrides();

      if(!all){
        return;
      }
      this.allGames = all;

      // Novidades: 12 mais recentes por data
      this.recentGames = [...all]
        .sort((a, b) => {
          const da = new Date(a.createdAt  || 0).getTime();
          const db = new Date(b.createdAt || 0).getTime();
          return db - da;
        })
        .slice(0, 12);

      // Recém jogados: via sessionStorage
      try {
        const ids = this.scratchcardService.getLastPlayed();
        const map = new Map(all.map(g => [String(g.id), g]));
        this.lastPlayedGames = ids.map(id => map.get(String(id))).filter((g): g is IScratchGameOverrideResponse => !!g);
      } catch {
        this.lastPlayedGames = [];
      }
    } catch {
      this.allGames = [];
      this.recentGames = [];
      this.lastPlayedGames = [];
    } finally {
      this.loading = false;
    }
  }

  applySearch(): void {
    const term = (this.search || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (!term) {
      this.filteredGames = [];
      this.loadingSearch = false;
      return;
    }

    this.filteredGames = this.allGames.filter(g => {
      const name = String(g.title  || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return name.includes(term);
    });

    this.loadingSearch = false;
  }

  cleanFilters(): void {
    this.search = '';
    this.filteredGames = [];
    this.loadingSearch = false;
    this.filtersDrawer = false;
    this.scratchcardService.clearFilters();
  }

  saveFilters(): void {
    this.scratchcardService.saveFilters(this.search);
  }

  restoreFilters(): void {
    const saved = this.scratchcardService.restoreFilters();
    this.search = saved.search || '';
  }

  async hardRefresh(): Promise<void> {
    if (this.refreshing) return;
    this.refreshing = true;
    this.cleanFilters();
    await this.loadGames();
    this.refreshing = false;
  }

  redirect(gameId: string | number): void {
    this.scratchcardService.saveLastPlayed(gameId);
    this.router.navigate(['/scratch', gameId]);
  }
}
