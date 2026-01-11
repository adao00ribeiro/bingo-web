
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ITopCardInfo } from '../../../interfaces/ITopCardInfo';

interface TableData {
  cupom: number;
  doador: string;
  faltam: number[];
}
@Component({
  selector: 'app-table-almost-there',
  imports: [MatTableModule],
  templateUrl: './table-almost-there.component.html',
  styleUrl: './table-almost-there.component.scss'
})
export class TableAlmostThereComponent implements OnChanges {
  @Input() toplist: ITopCardInfo[] = [];

  datatable: TableData[] = [];

  columns = [
    {
      name: "name",
      required: true,
      label: "CUPOM",
      align: "left",
      field: "cupom"
    },
    {
      name: "doador",
      label: "DOADOR",
      field: "doador",
      align: "left"
    },
    {
      name: "faltam",
      label: "FALTAM",
      field: "faltam"
    }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['toplist']) {
      this.updateDataTable();
    }
  }

  formatNumber(number: number | undefined): string {
    if (number === undefined) {
      return "";
    }
    return String(number).padStart(2, "0");
  }

  updateDataTable(): void {

    this.datatable = this.toplist.map(({ card, missingNumbers }) => ({
      cupom: card.code,
      doador: card.name.split(" ")[0],
      faltam: missingNumbers,
    }));
  }
}
