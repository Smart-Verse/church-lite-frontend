import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {BaseComponent} from '../../shared/common/base-component/base-component';
import {FieldsService} from '../../shared/services/fields/fields.service';
import {ToastService} from '../../shared/services/toast/toast.service';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {Appointment, EventType} from '../../services/appointments/appointments.service';
import {AppointmentsConfig} from './appointments.config';

export type AppointmentDialogAction =
  | { action: 'SAVE'; appointment: Appointment }
  | { action: 'CANCEL_EVENT'; appointment: Appointment }
  | { action: 'DELETE'; appointment: Appointment };

@Component({
  selector: 'app-appointments',
  imports: [SharedCommonModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent extends BaseComponent implements OnInit {
  formGroup: FormGroup;
  eventTypes: EventType[] = [];
  weekDays = [
    {value: 'SUNDAY', label: 'Domingo'},
    {value: 'MONDAY', label: 'Segunda'},
    {value: 'TUESDAY', label: 'Terça'},
    {value: 'WEDNESDAY', label: 'Quarta'},
    {value: 'THURSDAY', label: 'Quinta'},
    {value: 'FRIDAY', label: 'Sexta'},
    {value: 'SATURDAY', label: 'Sábado'}
  ];
  selectedWeekDays = new Set<string>();
  isExisting = false;

  private readonly configuration = new AppointmentsConfig();

  constructor(
    public readonly ref: DynamicDialogRef,
    public readonly config: DynamicDialogConfig,
    private readonly fieldsService: FieldsService,
    public readonly translateService: TranslateService,
    private readonly toastService: ToastService
  ) {
    super();
    this.formGroup = this.fieldsService.onCreateFormBuiderDynamic(this.configuration.fields);
  }

  ngOnInit(): void {
    this.eventTypes = this.config.data?.eventTypes ?? [];
    const appointment = this.config.data?.appointment;
    this.isExisting = Boolean(appointment?.id);

    if (appointment) {
      const selectedEventType = this.eventTypes.find(item => item.id === appointment.eventsType?.id);
      this.formGroup.patchValue({
        ...appointment,
        eventsType: selectedEventType ?? appointment.eventsType,
        initialDate: this.toDate(appointment.initialDate),
        finalDate: this.toDate(appointment.finalDate),
        recurrenceEndDate: this.toDate(appointment.recurrenceEndDate)
      });
      (appointment.recurrenceDays ?? '')
        .split(',')
        .filter(Boolean)
        .forEach((day: string) => this.selectedWeekDays.add(day));
    } else {
      this.formGroup.patchValue({
        userConfiguration: this.config.data?.user,
        initialDate: this.toDate(this.config.data?.initialDate),
        finalDate: this.toDate(this.config.data?.finalDate),
        status: 'SCHEDULED',
        recurrenceType: 'NONE'
      });
    }
  }

  get weekly(): boolean {
    return this.formGroup.get('recurrenceType')?.value === 'WEEKLY';
  }

  toggleWeekDay(day: string, checked: boolean): void {
    checked ? this.selectedWeekDays.add(day) : this.selectedWeekDays.delete(day);
  }

  onSave(): void {
    if (!this.formGroup.valid) {
      this.invalid('Preencha os campos obrigatórios');
      return;
    }
    if (this.weekly && (!this.formGroup.get('recurrenceEndDate')?.value || this.selectedWeekDays.size === 0)) {
      this.invalid('Informe a data final e pelo menos um dia da recorrência');
      return;
    }

    const appointment = this.configuration.convertToDTO(
      this.formGroup,
      Array.from(this.selectedWeekDays)
    );
    this.ref.close({action: 'SAVE', appointment} satisfies AppointmentDialogAction);
  }

  cancelEvent(): void {
    const appointment = this.configuration.convertToDTO(this.formGroup, Array.from(this.selectedWeekDays));
    appointment.status = 'CANCELLED';
    this.ref.close({action: 'CANCEL_EVENT', appointment} satisfies AppointmentDialogAction);
  }

  deleteEvent(): void {
    const appointment = this.configuration.convertToDTO(this.formGroup, Array.from(this.selectedWeekDays));
    this.ref.close({action: 'DELETE', appointment} satisfies AppointmentDialogAction);
  }

  onCancel(): void {
    this.ref.close(null);
  }

  private invalid(message: string): void {
    this.toastService.warn({summary: 'Agenda', detail: message});
    this.fieldsService.verifyIsValid();
  }

  private toDate(value?: string | Date): Date | null {
    if (!value) return null;
    if (value instanceof Date) return new Date(value);
    return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value);
  }
}
