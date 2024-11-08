import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterChurchComponent } from './register-church.component';

describe('RegisterChurchComponent', () => {
  let component: RegisterChurchComponent;
  let fixture: ComponentFixture<RegisterChurchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterChurchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterChurchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
