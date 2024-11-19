import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTreeComponent } from './register-tree.component';

describe('RegisterTreeComponent', () => {
  let component: RegisterTreeComponent;
  let fixture: ComponentFixture<RegisterTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
