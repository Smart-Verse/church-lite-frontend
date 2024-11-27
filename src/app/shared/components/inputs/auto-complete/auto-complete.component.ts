import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

import {FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {FloatLabelModule} from "primeng/floatlabel";
import {TooltipModule} from "primeng/tooltip";
import {AppControlValueAccessor} from "../../../interfaces/app-control-value";
import {FieldsService} from "../../../services/fields/fields.service";
import {AutoCompleteModule} from "primeng/autocomplete";
import {CrudService} from "../../../services/crud/crud.service";
import {RequestData} from "../../../interfaces/request-data";
import {AutoFocusModule} from "primeng/autofocus";

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    TooltipModule,
    AutoFocusModule
  ],
  providers: [
    CrudService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AutoCompleteComponent,
      multi: true
    }
  ],
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.scss'
})
export class AutoCompleteComponent extends AppControlValueAccessor{

  @Input() optionLabel: string = "";
  @Input() route: string = "";
  @Input() defaultFilter: string = "";

  @Output() onSelectChange: EventEmitter<void> = new EventEmitter();

  public itens: any[] = [];

  constructor(
    private readonly fieldServiceInputText: FieldsService,
    private readonly crudService: CrudService
  ){
    super(fieldServiceInputText)
  }

  onFilter(value: any): void{
    var req = this.onRequestData(value);
    this.crudService.onGetAll(this.route, req).subscribe({
      next: (res) => {
        this.itens = res.contents;
      },
      error: (err) => {

      }
    })
  }

  onRequestData(value: any): RequestData{
    let req = new RequestData();
    req.size = 5;
    req.offset = 0;
    var filter = "";
    if(value.query !== ""){
      filter = ` and ${this.optionLabel} eq ${value.query}`
    }
    req.filter = (this.defaultFilter !== "" ? this.defaultFilter : "") + filter;
    return req;
  }

  onSelected(){
    this.onSelectChange.emit();
  }
}
