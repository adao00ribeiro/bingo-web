import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListScratchGamesComponent } from './list-scratch-games.component';

describe('ListScratchGamesComponent', () => {
  let component: ListScratchGamesComponent;
  let fixture: ComponentFixture<ListScratchGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListScratchGamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListScratchGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
