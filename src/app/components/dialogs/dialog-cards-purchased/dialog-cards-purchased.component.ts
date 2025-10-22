import { Component, computed, effect, EventEmitter, inject, input, Input, model, OnInit, Output, ViewChild } from '@angular/core';
import { ICard } from '../../../interfaces/ICard';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CardComponent } from "../../card/card.component";
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { IRound } from '../../../interfaces/IRound';
import { GuidPipe } from '../../../pipes/guid.pipe';
import { DateTimePipe } from '../../../pipes/date-time.pipe';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { CardsByRoundIdResource } from '../../../resource/card/cards-by-round-id.resource';
export interface DialogCardsPurchasedProps {
  round: IRound;
}
@Component({
  selector: 'app-dialog-cards-purchased',
  standalone: true,
  imports: [ScrollingModule,InfiniteScrollDirective, MatDialogModule, MatProgressSpinnerModule, CardComponent, GuidPipe,DateTimePipe],
  templateUrl: './dialog-cards-purchased.component.html',
  styleUrl: './dialog-cards-purchased.component.scss'
})
export class DialogCardsPurchasedComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<DialogCardsPurchasedComponent>);
  readonly data = inject<DialogCardsPurchasedProps>(MAT_DIALOG_DATA);

  private cardsByRoundIdResource: CardsByRoundIdResource = inject(CardsByRoundIdResource);
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
   readonly round = model(this.data.round);
  @Output() ok = new EventEmitter<void>();
  @Output() hide = new EventEmitter<void>();

  cards: ICard[] = [];
  page = 1;
  pageSize = 100;
  isLoading = false;
  loading = false;
  hasMore = true;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  constructor(  ) {
    effect(() => {
      var paged = this.cardsByRoundIdResource.resource.value()

      if (paged) {
        if (paged.rows?.length > 0) {
          var newCards = paged.rows as ICard[]
          this.cards = [...this.cards, ...newCards];
          this.page++;

        } else {
          this.hasMore = true;
        }
      }
      this.isLoading = false;
    })
  }
  ngOnInit(): void {
    this.loadNextPage();
  }
  closeDialog(): void {
    this.cards = []
    this.ok.emit();
    this.dialogRef.close();
  }

  loadMore() {
    if (this.isLoading || !this.hasMore) return;
    let round = this.round()
    if (round == null) {
      return;
    }
    this.isLoading = true;
    this.cardsByRoundIdResource.reload({roundId : round.id, page: this.page, size: this.pageSize});

  }
  onScroll() {
    const end = this.viewport.measureScrollOffset('bottom');
    if (end < 200 && !this.isLoading) {
      this.loadMore();
    }
  }
    loadNextPage() {
    this.loading = true;
    this.cardsByRoundIdResource.reload({roundId : this.round().id, page: this.page,size: this.pageSize});
    this.page++;
  }
}
