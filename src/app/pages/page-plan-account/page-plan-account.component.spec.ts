import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePlanAccountComponent } from './page-plan-account.component';

describe('PagePlanAccountComponent', () => {
  let component: PagePlanAccountComponent;
  let fixture: ComponentFixture<PagePlanAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePlanAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagePlanAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
