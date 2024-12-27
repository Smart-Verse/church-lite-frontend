import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsTypeComponent } from './events-type.component';

describe('EventsTypeComponent', () => {
  let component: EventsTypeComponent;
  let fixture: ComponentFixture<EventsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
