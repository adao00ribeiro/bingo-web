import {AfterViewInit, ChangeDetectorRef, Component, inject, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { DynamicPipe } from '../../pipes/dynamic.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CurrencyPipe } from '../../pipes/currency.pipe';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,DynamicPipe,MatTableModule, MatPaginatorModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T extends object> implements OnInit, AfterViewInit{
  @Input() columnMappings: { key: string; displayName: string , pipe?: string }[] = [];
  @Input() data: T[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<T>();
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef)
  displayedColumns: string[] = [];
  ngOnInit() {
   this.initializeColumnsAndData();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['columnMappings']) {
      this.initializeColumnsAndData();
    }
  }
  ngAfterViewInit() {
    this.dataSource.data = this.data;
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }
  private initializeColumnsAndData() {
    if (this.data.length) {
      this.displayedColumns = this.columnMappings.map(column => column.key);
      this.dataSource.data = this.data;
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
}
