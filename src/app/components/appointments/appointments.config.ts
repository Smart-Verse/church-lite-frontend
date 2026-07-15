import { FormGroup } from '@angular/forms';
import { Appointment } from '../../services/appointments/appointments.service';

export class AppointmentsConfig {
  fields: any[] = [
    { fieldName: 'id', required: false, hidden: true, type: 'string' },
    { fieldName: 'eventsType', required: true, hidden: false, type: 'string' },
    { fieldName: 'userConfiguration', required: true, hidden: true, type: 'string' },
    { fieldName: 'initialDate', required: true, hidden: false, type: 'string' },
    { fieldName: 'finalDate', required: true, hidden: false, type: 'string' },
    { fieldName: 'local', required: true, hidden: false, type: 'string' },
    { fieldName: 'description', required: false, hidden: false, type: 'string' },
    { fieldName: 'status', required: true, hidden: true, type: 'string' },
    { fieldName: 'recurrenceType', required: true, hidden: false, type: 'string' },
    { fieldName: 'recurrenceDays', required: false, hidden: true, type: 'string' },
    { fieldName: 'recurrenceEndDate', required: false, hidden: false, type: 'string' },
    { fieldName: 'recurrenceGroupId', required: false, hidden: true, type: 'string' }
  ];

  convertToDTO(formGroup: FormGroup, recurrenceDays: string[]): Appointment {
    const value = formGroup.getRawValue();
    return {
      ...value,
      status: value.status ?? 'SCHEDULED',
      recurrenceType: value.recurrenceType ?? 'NONE',
      recurrenceDays: value.recurrenceType === 'WEEKLY' ? recurrenceDays.join(',') : null,
      recurrenceEndDate: value.recurrenceType === 'WEEKLY' ? value.recurrenceEndDate : null
    };
  }
}
