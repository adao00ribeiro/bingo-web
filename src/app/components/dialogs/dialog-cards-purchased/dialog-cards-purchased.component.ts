import { Component, computed, effect, EventEmitter, inject, input, Input, model, Output, ViewChild } from '@angular/core';
import { ICard } from '../../../interfaces/ICard';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CardComponent } from "../../card/card.component";
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CardsByPunterResourceService } from '../../../resource/card/cards-by-punter-resource.service';
import { IRound } from '../../../interfaces/IRound';
import { GuidPipe } from '../../../pipes/guid.pipe';
import { DatePipe } from '@angular/common';
import { DateTimePipe } from '../../../pipes/date-time.pipe';
export interface DialogCardsPurchasedProps {
  round: IRound;
}
@Component({
  selector: 'app-dialog-cards-purchased',
  standalone: true,
  imports: [ScrollingModule, MatDialogModule, MatProgressSpinnerModule, CardComponent, GuidPipe,DateTimePipe],
  templateUrl: './dialog-cards-purchased.component.html',
  styleUrl: './dialog-cards-purchased.component.scss'
})
export class DialogCardsPurchasedComponent {
  readonly dialogRef = inject(MatDialogRef<DialogCardsPurchasedComponent>);
  readonly data = inject<DialogCardsPurchasedProps>(MAT_DIALOG_DATA);

  private cardsByPunterResourceService: CardsByPunterResourceService = inject(CardsByPunterResourceService);
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
   readonly round = model(this.data.round);
  @Output() ok = new EventEmitter<void>();
  @Output() hide = new EventEmitter<void>();

  cards: ICard[] = [];
  page = 1;
  perPage = 100;
  isLoading = false;
  hasMore = true;

  constructor(  ) {
    effect(() => {
      var paged = this.cardsByPunterResourceService.resource.value()

      if (paged) {
        if (paged.items?.length > 0) {
          var newCards = paged.items as ICard[]
          this.cards = [...this.cards, ...newCards];
          this.page++;

        } else {
          this.hasMore = true;
        }
      }
      this.isLoading = false;
    })
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
    this.cardsByPunterResourceService.reload(round.id, this.page, this.perPage);

  }
  onScroll() {
    const end = this.viewport.measureScrollOffset('bottom');
    if (end < 200 && !this.isLoading) {
      this.loadMore();
    }
  }
}
