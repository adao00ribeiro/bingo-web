import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, inject, input, Input, OnInit, Output, QueryList, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DynamicPipe } from '../../pipes/dynamic.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IPaged } from '../../interfaces/IPaged';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    DynamicPipe,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})

export class TableComponent<T extends object> implements OnInit, AfterViewInit {
  @Input() columnMappings: { key: string; displayName: string, pipe?: string }[] = [];
  @Input() data: IPaged | undefined = undefined;
  @Output() pageChange = new EventEmitter<{ page: number; size: number }>();
  //@Output() changeRefresh: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ContentChildren(TemplateRef) columnTemplatesList!: QueryList<TemplateRef<any>>;
  columnTemplates: { [key: string]: TemplateRef<any> } = {};
  dataSource = new MatTableDataSource<T>();
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef)

  displayedColumns: string[] = [];
  totalItems: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;

  ngOnInit() {

    this.initializeColumnsAndData();
    this.displayedColumns = this.columnMappings.map(col => col.key);

    this.dataSource.filterPredicate = (data: T, filter: string) => {
      const formattedFilter = filter.trim().toLowerCase();

      // Concatena todos os valores relevantes da linha em uma única string pesquisável
      const searchableData = this.columnMappings
        .map(col => {
          let value = this.getValue(data, col.key);
          // Se houver um pipe associado, aplicamos a transformação
          if (col.pipe) {
            const dynamicPipe = new DynamicPipe(); // Criamos uma instância do pipe
            value = dynamicPipe.transform(value, col.pipe); // Aplicamos o pipe correto
          }

          return value;
        })
        .join(' ')
        .toLowerCase();

      return searchableData.includes(formattedFilter);
    };
  }
  ngAfterContentInit() {
    this.columnTemplatesList.forEach((template) => {
      const columnName = (template as any)._declarationTContainer?.attrs?.[1]; // Obtém o nome da coluna
      if (columnName) {
        this.columnTemplates[columnName] = template;
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['columnMappings']) {
      this.initializeColumnsAndData();
    }
    if (changes['totalItems']) {
      console.log('Total de itens atualizado:', this.totalItems);
      this.cdr.detectChanges(); // Força a atualização da view
    }
  }

  getValue(element: any, path: string): any {
    return path.split('.').reduce((obj, key) =>
      (obj && obj[key] !== undefined) ? obj[key] : null, element);
  }
  ngAfterViewInit() {
    this.initializeColumnsAndData();
    this.dataSource.sort = this.sort;
    this.handleEmit();
    if (this.sort) {
      this.dataSource.sortingDataAccessor = (item, property) => {
        return this.getValue(item, property);
      };
    }
    this.cdr.detectChanges();
  }
  private initializeColumnsAndData() {
    if (this.data?.items?.length) {
      this.displayedColumns = this.columnMappings.map(column => column.key);
      this.dataSource.data = this.data.items;
      this.totalItems = this.data.totalCount
    }
  }
  getPipe(columnKey: string): string | null {
    const column = this.columnMappings.find(col => col.key === columnKey);
    return column?.pipe || null;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  handleEmit() {
    this.pageChange.emit({ page: this.pageIndex + 1, size: this.pageSize });
  }
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.handleEmit();
  }
  handleClick() {
   this.handleEmit();
  }
}
