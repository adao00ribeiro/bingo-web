import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAlmostThereComponent } from './table-almost-there.component';

describe('TableAlmostThereComponent', () => {
  let component: TableAlmostThereComponent;
  let fixture: ComponentFixture<TableAlmostThereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableAlmostThereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableAlmostThereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
