import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FieldsForm } from '../interfaces/fields-form';
import { Fields } from '../interfaces/fields';


@Injectable({
  providedIn: 'root'
})
export class FieldsService {

  private verifyFieldsValid = new Subject<void>();
  invokeVerifyValid = this.verifyFieldsValid.asObservable();


  constructor(
    private readonly formBuilder: FormBuilder, 
    private readonly http: HttpClient) { }


  verifyIsValid(){
    this.verifyFieldsValid.next();
  }

  public loadForm(entity: string, service: string): Observable<any>{
    return this.getMetadata(service);
  }

  private getMetadata(service: string) : Observable<any> {
    const params = {
      "metadata": "FIELDS"
    }
    return this.http.post<String>("anonymous/rest/"+service+"/metadata", params);
  }

  public createForm(entityMetadata: any): FieldsForm{
    const fieldsForm = new FieldsForm();
    fieldsForm.fields = [];
    fieldsForm.formgroup = this.formBuilder.group({});
    entityMetadata[0]?.entityFields.forEach((element: any) => {
      const fields = new Fields();
      fields.name = element.fieldName;
      fields.type = element.fieldProperties.fieldType;
      fields.size = element.frontendProperties.size;
      fields.enableFieldsFilter = element.frontendProperties.enableFieldsFilter;
      fields.guidance = element.frontendProperties.guidance;
      fields.order = element.frontendProperties.order;
      fields.hidden = element.frontendProperties.hidden;
      fields.label = element.frontendProperties.label;
      fields.reference = element.frontendProperties.reference;
      fields.required = element.fieldProperties.required;
      //fieldsForm.fields.push(fields);
      //fieldsForm.formgroup.addControl(element.fieldName, this.setValidators(fields));
    });

    return fieldsForm;
  }

  private setValidators(fields: Fields): FormControl{
    let formcontrol = new FormControl('');
    let validators: any = [];

    if(fields.required && !fields.hidden){
      validators.push(Validators.required);
    } 
    if(fields.type === 'email'){
      validators.push(Validators.email);
    }
    formcontrol.setValidators(validators);
    formcontrol.updateValueAndValidity();
    return formcontrol;
  }

  /*
    Cria um FormBuilder Padrão
  */
  public onCreateFormBuiderDynamic(fields: any[]): FormGroup{
    var form = this.formBuilder.group({});

    fields.forEach(e => {
      form.addControl(e.fieldName, this.onSetValidatoDynamic(fields));
    })
    return form;
  }

  private onSetValidatoDynamic(fields: any): FormControl{
    let formcontrol = new FormControl('');
    let validators: any = [];

    if(fields.required && !fields.hidden){
      validators.push(Validators.required);
    } 
    if(fields.type === 'email'){
      validators.push(Validators.email);
    }
    formcontrol.setValidators(validators);
    formcontrol.updateValueAndValidity();
    return formcontrol;
  }
}
