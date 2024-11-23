import {
  ControlValueAccessor,
  FormGroup,

} from "@angular/forms";
import {Component, ElementRef, input, Input, OnInit, ViewChild} from "@angular/core";
import {FieldsService} from "../services/fields/fields.service";


@Component({
  template: '',
})
export abstract class AppControlValueAccessor implements ControlValueAccessor, OnInit {
  public value: any = null;
  public isValid: boolean = true;
  @ViewChild('inputElement', { static: false }) inputElement!: ElementRef;

  @Input() focus: boolean = false;
  @Input() disabled: boolean = false;
  @Input() label: string = "";
  @Input() type: string = "";
  @Input() guidance: string = "";
  @Input() field?: FormGroup
  @Input() name: string = "";

  constructor(private readonly fieldService: FieldsService) {
  }

    ngOnInit(): void {
      this.fieldService.invokeVerifyValid.subscribe(() => {
        this.onValid();
      })
    }

    writeValue(value: any): void {
      this.value = value === '' ? null : value;
    }

    registerOnChange(fn: any): void {
      this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
      this.onTouch = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
      //throw new Error('Method not implemented.');
    }

    onChange = (value: any) => {
      this.value = value === '' ? null : value;
    };

    onTouch = () => {};

    onValid(){
      let validator = this.field?.get(this.name)?.valid;
      this.isValid = validator === undefined ? true : validator;
      this.writeValue(this.value);
    }
}
