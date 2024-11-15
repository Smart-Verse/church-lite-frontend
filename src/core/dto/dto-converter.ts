import {FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";


export class DTOConverter {

  static convertPersonToDTO(formGroup: FormGroup, datePipe: DatePipe): any {
     let person = {
      id: formGroup.get('id')?.value,
      name: formGroup.get('name')?.value,
      status: formGroup.get('status')?.value["key"],
      personAddress: formGroup.get('personAddress')?.value,
      personalDocs: formGroup.get('personalDocs')?.value,
      personalTelphone: formGroup.get('personalTelphone')?.value,
      personalEmail: formGroup.get('personalEmail')?.value,
    };
    person.personalDocs.birthDate = datePipe.transform(person.personalDocs.birthDate, 'yyyy-MM-dd')!;
    return person;
  }
}
