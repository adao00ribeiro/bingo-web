import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelBallsComponent } from './panel-balls.component';

describe('PanelBallsComponent', () => {
  let component: PanelBallsComponent;
  let fixture: ComponentFixture<PanelBallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelBallsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanelBallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
