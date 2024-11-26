import {FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";


export class DTOConverter {

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
