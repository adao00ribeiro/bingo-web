import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GameCardComponent } from '../game-card/game-card.component';
import { CardSkeletonComponent } from '../card-skeleton/card-skeleton.component';
import { CommonModule } from '@angular/common';
import { IScratchGameOverrideResponse } from '../../../interfaces/response/scratch/IScratchGameOverrideResponse';

@Component({
  selector: 'app-search-results',
  imports: [CommonModule, GameCardComponent, CardSkeletonComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnChanges, OnDestroy, AfterViewInit{
 @Input() loading = false;
  @Input() games: IScratchGameOverrideResponse[] = [];
  @Output() play = new EventEmitter<string | number>();
  @Output() clean = new EventEmitter<void>();
  @ViewChild('sentinel') sentinelRef?: ElementRef<HTMLDivElement>;

  pageSize = 48;
  page = 1;
  isPaging = false;
  skeletons = Array(8).fill(0);

  private _io: IntersectionObserver | null = null;
  private _pagingTimer: ReturnType<typeof setTimeout> | null = null;

  get visibleGames(): IScratchGameOverrideResponse[] {
    return (this.games || []).slice(0, this.page * this.pageSize);
  }

  get hasMore(): boolean {
    return this.visibleGames.length < (this.games?.length || 0);
  }

  ngAfterViewInit(): void {
    this.setupObserver();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['games'] || changes['loading']) {
      this.page = 1;
      setTimeout(() => this.setupObserver(), 0);
    }
  }

  ngOnDestroy(): void {
    this.teardownObserver();
    if (this._pagingTimer) clearTimeout(this._pagingTimer);
  }

  setupObserver(): void {
    this.teardownObserver();
    if (this.loading || !this.hasMore) return;
    const el = this.sentinelRef?.nativeElement;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    this._io = new IntersectionObserver(
      (entries) => {
        if (entries?.[0]?.isIntersecting) this.loadMore();
      },
      { root: null, rootMargin: '600px 0px', threshold: 0.01 }
    );
    this._io.observe(el);
  }

  teardownObserver(): void {
    if (this._io) {
      try { this._io.disconnect(); } catch {}
      this._io = null;
    }
  }

  loadMore(): void {
    if (this.isPaging || !this.hasMore) return;
    this.isPaging = true;
    if (this._pagingTimer) clearTimeout(this._pagingTimer);
    this._pagingTimer = setTimeout(() => {
      this.page += 1;
      this.isPaging = false;
      setTimeout(() => this.setupObserver(), 0);
    }, 120);
  }

  trackById(_: number, item: IScratchGameOverrideResponse): string | number {
    return item.id;
  }
}
