import {CommonModule} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {FloatLabelModule} from 'primeng/floatlabel';
import {MultiSelectModule} from 'primeng/multiselect';
import {AppControlValueAccessor} from '../../../interfaces/app-control-value';
import {RequestData} from '../../../interfaces/request-data';
import {CrudService} from '../../../services/crud/crud.service';
import {FieldsService} from '../../../services/fields/fields.service';

@Component({selector: 'app-multi-select', imports: [CommonModule, FormsModule, ReactiveFormsModule, FloatLabelModule, MultiSelectModule], providers: [CrudService, {provide: NG_VALUE_ACCESSOR, useExisting: MultiSelectComponent, multi: true}], templateUrl: './multi-select.component.html', styleUrl: './multi-select.component.scss'})
export class MultiSelectComponent extends AppControlValueAccessor implements OnInit {
  @Input() options: any[] = [];
  @Input() optionLabel = 'name';
  @Input() dataKey = 'id';
  @Input() route = '';
  @Input() defaultFilter = '';
  @Input() filter = true;
  @Input() display: 'comma' | 'chip' = 'chip';
  @Input() pageSize = 100;

  constructor(fields: FieldsService, private readonly crud: CrudService) { super(fields); }

  override ngOnInit(): void {
    if (!this.route) return;
    const request = new RequestData();
    request.offset = 0;
    request.size = this.pageSize;
    request.filter = this.defaultFilter;
    this.crud.onGetAll(this.route, request).subscribe({next: response => this.options = response.contents ?? [], error: () => this.options = []});
  }
}
