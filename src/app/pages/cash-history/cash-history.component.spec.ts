import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashHistoryComponent } from './cash-history.component';

describe('CashHistoryComponent', () => {
  let component: CashHistoryComponent;
  let fixture: ComponentFixture<CashHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
