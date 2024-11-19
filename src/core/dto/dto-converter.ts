import {FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";


export class DTOConverter {

  static convertPersonToDTO(formGroup: FormGroup, datePipe: DatePipe): any {
     let dto = {
      id: formGroup.get('id')?.value,
      name: formGroup.get('name')?.value,
      status: formGroup.get('status')?.value["key"],
      personAddress: formGroup.get('personAddress')?.value,
      personalDocs: formGroup.get('personalDocs')?.value,
      personalTelphone: formGroup.get('personalTelphone')?.value,
      personalEmail: formGroup.get('personalEmail')?.value,
    };
    dto.personalDocs.birthDate = datePipe.transform(dto.personalDocs.birthDate, 'yyyy-MM-dd')!;
    return dto;
  }

  static convertPositionToDTO(formGroup: FormGroup): any {
    let dto = {
     id: formGroup.get('id')?.value,
     name: formGroup.get('name')?.value,
     description: formGroup.get('description')?.value
   };
   return dto;
 }

  static convertPlanAccountToDTO(formGroup: FormGroup): any {
    let dto = {
      id: formGroup.get('id')?.value,
      description: formGroup.get('description')?.value,
      codeTree: formGroup.get('codeTree')?.value,
      type: formGroup.get('type')?.value["key"],
      children: []
    };
    return dto;
  }
}
