import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonMembersComponent } from './person-members.component';

describe('PersonMembersComponent', () => {
  let component: PersonMembersComponent;
  let fixture: ComponentFixture<PersonMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonMembersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
