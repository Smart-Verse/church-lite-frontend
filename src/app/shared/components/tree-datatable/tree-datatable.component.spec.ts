import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeDatatableComponent } from './tree-datatable.component';

describe('TreeDatatableComponent', () => {
  let component: TreeDatatableComponent;
  let fixture: ComponentFixture<TreeDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeDatatableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreeDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
