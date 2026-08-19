import {Component, HostListener, OnInit} from '@angular/core';
import {catchError, forkJoin, of} from 'rxjs';
import {DialogService} from 'primeng/dynamicdialog';
import {BreadcrumbModule} from "primeng/breadcrumb";
import {MenuItem} from "primeng/api";
import {DayPilot, DayPilotModule} from '@daypilot/daypilot-lite-angular';
import {BaseComponent} from '../../shared/common/base-component/base-component';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {ToastService} from '../../shared/services/toast/toast.service';
import {UserConfigurationService} from '../../services/user-configuration/user-configuration.service';
import {
  Appointment,
  AppointmentsService,
  EventType
} from '../../services/appointments/appointments.service';
import {
  AppointmentDialogAction,
  AppointmentsComponent
} from '../../components/appointments/appointments.component';

@Component({
  selector: 'app-scheduler',
  imports: [SharedCommonModule, DayPilotModule, BreadcrumbModule],
  providers: [DialogService],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss'
})
export class SchedulerComponent extends BaseComponent implements OnInit {
  private appointments: Appointment[] = [];
  private eventTypes: EventType[] = [];
  private user: { id: string } | null = null;
  readonly breadcrumbHome: MenuItem = {icon: "pi pi-home", routerLink: "/home/dashboard"};
  readonly breadcrumbItems: MenuItem[] = [{label: this.translateService.translate("scheduler")}];

  get totalAppointments(): number {
    return this.appointments.filter(item => item.status !== "CANCELLED").length;
  }

  get upcomingAppointments(): number {
    const now = new Date();
    const limit = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return this.appointments.filter(item => {
      const date = new Date(item.initialDate);
      return item.status !== "CANCELLED" && date >= now && date <= limit;
    }).length;
  }

  get availableEventTypes(): EventType[] {
    return this.eventTypes.slice(0, 6);
  }

  calendarView: "Month" | "Week" | "Day" = "Month";
  calendarDate = DayPilot.Date.today().toString("yyyy-MM-dd");
  dayPilotEvents: DayPilot.EventData[] = [];

  monthConfig: DayPilot.MonthConfig = {
    locale: "pt-br", eventHeight: 26, cellHeaderHeight: 32, headerHeight: 38, eventBorderRadius: 6,
    timeRangeSelectedHandling: "Enabled", eventMoveHandling: "Update", eventResizeHandling: "Update",
    onTimeRangeSelected: args => this.openDayPilotRange(args.start, args.end, true),
    onEventClick: args => this.openDayPilotEvent(args.e.id()),
    onEventMoved: args => this.updateDayPilotEvent(args.e.id(), args.newStart, args.newEnd),
    onEventResized: args => this.updateDayPilotEvent(args.e.id(), args.newStart, args.newEnd)
  };

  dayConfig: DayPilot.CalendarConfig = {
    viewType: "Week", locale: "pt-br", timeFormat: "Clock24Hours", businessBeginsHour: 6, businessEndsHour: 23,
    cellDuration: 30, cellHeight: 28, height: 610, headerHeight: 42, eventBorderRadius: 7, durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled", eventMoveHandling: "Update", eventResizeHandling: "Update",
    onTimeRangeSelected: args => this.openDayPilotRange(args.start, args.end),
    onEventClick: args => this.openDayPilotEvent(args.e.id()),
    onEventMoved: args => this.updateDayPilotEvent(args.e.id(), args.newStart, args.newEnd),
    onEventResized: args => this.updateDayPilotEvent(args.e.id(), args.newStart, args.newEnd)
  };

  get calendarTitle(): string {
    const date = new Date(this.calendarDate + "T12:00:00");
    if (this.calendarView === "Day") return new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(date);
    if (this.calendarView === "Week") {
      const start = new Date(date);
      start.setDate(date.getDate() - date.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return start.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short"
      }) + " – " + end.toLocaleDateString("pt-BR", {day: "2-digit", month: "short", year: "numeric"});
    }
    return new Intl.DateTimeFormat("pt-BR", {month: "long", year: "numeric"}).format(date);
  }


  constructor(
    public readonly translateService: TranslateService,
    private readonly appointmentsService: AppointmentsService,
    private readonly userConfigurationService: UserConfigurationService,
    private readonly dialogService: DialogService,
    private readonly toast: ToastService
  ) {
    super();
  }

  ngOnInit(): void {
    this.load();
  }

  setCalendarView(view: "Month" | "Week" | "Day"): void {
    this.calendarView = view;
    this.syncDayPilotView();
  }

  moveCalendar(direction: -1 | 1): void {
    const date = new Date(this.calendarDate + "T12:00:00");
    if (this.calendarView === "Month") date.setMonth(date.getMonth() + direction);
    else date.setDate(date.getDate() + direction * (this.calendarView === "Week" ? 7 : 1));
    this.calendarDate = this.toDateKey(date);
    this.syncDayPilotView();
  }

  goToToday(): void {
    this.calendarDate = this.toDateKey(new Date());
    this.syncDayPilotView();
  }

  private syncDayPilotView(): void {
    this.monthConfig = {...this.monthConfig, startDate: this.calendarDate};
    this.dayConfig = {
      ...this.dayConfig,
      startDate: this.calendarDate,
      viewType: this.calendarView === "Day" ? "Day" : "Week"
    };
  }

  private openDayPilotRange(start: DayPilot.Date, end: DayPilot.Date, allDay = false): void {
    const initialDate = start.toDate();
    const finalDate = end.toDate();
    if (allDay) {
      initialDate.setHours(9, 0, 0, 0);
      finalDate.setTime(initialDate.getTime() + 60 * 60 * 1000);
    }
    this.openDialog(undefined, initialDate, finalDate);
  }

  private openDayPilotEvent(id: string | number): void {
    const appointment = this.appointments.find(item => String(item.id) === String(id));
    if (appointment) this.openDialog(appointment);
  }

  private updateDayPilotEvent(id: string | number, start: DayPilot.Date, end: DayPilot.Date): void {
    const current = this.appointments.find(item => String(item.id) === String(id));
    if (!current) return;
    const appointment = {
      ...current,
      initialDate: this.toLocalISOString(start.toDate()),
      finalDate: this.toLocalISOString(end.toDate())
    };
    this.showLoading = true;
    this.appointmentsService.update(appointment).subscribe({
      next: () => this.load(),
      error: error => {
        this.showLoading = false;
        this.showError(error, "Não foi possível reagendar o compromisso");
        this.refreshCalendar();
      }
    });
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  newAppointment(): void {
    const start = new Date();
    start.setMinutes(0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    this.openDialog(undefined, start, end);
  }

  private load(): void {
    this.showLoading = true;
    forkJoin({
      appointments: this.appointmentsService.getAppointments().pipe(
        catchError(error => {
          this.showError(error, 'Não foi possível carregar os compromissos');
          return of({contents: [] as Appointment[]});
        })
      ),
      eventTypes: this.appointmentsService.getEventTypes().pipe(
        catchError(error => {
          this.showError(error, 'Não foi possível carregar os tipos de evento');
          return of({contents: [] as EventType[]});
        })
      ),
      user: this.userConfigurationService.getUser().pipe(
        catchError(error => {
          this.showError(error, 'Não foi possível carregar o usuário');
          return of({output: null});
        })
      )
    }).subscribe(result => {
      this.appointments = result.appointments?.contents ?? [];
      this.eventTypes = result.eventTypes?.contents ?? [];
      this.user = result.user?.output ?? null;
      this.refreshCalendar();
      this.showLoading = false;
    });
  }

  private refreshCalendar(): void {
    this.dayPilotEvents = this.appointments.map(appointment => ({
      id: appointment.id!,
      text: appointment.status === "CANCELLED" ? "Cancelado: " + (appointment.eventsType?.name ?? "Evento") : (appointment.eventsType?.name ?? "Evento"),
      start: appointment.initialDate,
      end: appointment.finalDate,
      backColor: appointment.status === "CANCELLED" ? "#6b7280" : (appointment.eventsType?.color || "#8b5cf6"),
      borderColor: "transparent",
      fontColor: "#ffffff",
      cssClass: appointment.status === "CANCELLED" ? "scheduler-event--cancelled" : ""
    }));
    this.syncDayPilotView();
  }

  private openDialog(appointment?: Appointment, start?: Date, end?: Date): void {
    if (!this.user) {
      this.toast.warn({summary: 'Agenda', detail: 'Usuário ainda não foi carregado'});
      return;
    }
    if (!appointment && this.eventTypes.length === 0) {
      this.toast.warn({summary: 'Agenda', detail: 'Cadastre um tipo de evento antes de criar compromissos'});
      return;
    }

    const ref = this.dialogService.open(AppointmentsComponent, {
      header: appointment ? 'Compromisso' : 'Novo compromisso',
      width: 'min(92vw, 760px)',
      modal: true,
      closable: true,
      data: {
        appointment,
        eventTypes: this.eventTypes,
        user: this.user,
        initialDate: start,
        finalDate: end
      }
    });

    if (!ref) return;
    ref.onClose.subscribe((result: AppointmentDialogAction | null) => {
      if (!result) return;
      this.handleDialogAction(result);
    });
  }

  private handleDialogAction(result: AppointmentDialogAction): void {
    this.showLoading = true;

    if (result.action === 'DELETE') {
      this.appointmentsService.delete(result.appointment.id!).subscribe({
        next: () => this.onSuccess('Compromisso excluído'),
        error: error => this.onFailure(error, 'Não foi possível excluir o compromisso')
      });
      return;
    }

    if (result.action === 'CANCEL_EVENT' || result.appointment.id) {
      this.appointmentsService.update(result.appointment).subscribe({
        next: () => this.onSuccess(
          result.action === 'CANCEL_EVENT' ? 'Compromisso cancelado' : 'Compromisso atualizado'
        ),
        error: error => this.onFailure(error, 'Não foi possível atualizar o compromisso')
      });
      return;
    }

    this.appointmentsService.create(result.appointment).subscribe({
      next: response => {
        const validStatus = response.status === 200 || response.status === 201;
        const createdAppointments = response.body?.appointments;
        const validBody = Array.isArray(createdAppointments) && createdAppointments.length > 0;

        if (!validStatus || !validBody) {
          this.onFailure(
            {error: {message: 'O servidor não confirmou a criação do compromisso'}},
            'Não foi possível criar o compromisso'
          );
          return;
        }

        this.onSuccess('Compromisso criado');
      },
      error: error => this.onFailure(error, 'Não foi possível criar o compromisso')
    });
  }

  private onSuccess(message: string): void {
    this.toast.success({summary: 'Agenda', detail: message});
    this.load();
  }

  private onFailure(error: any, fallback: string): void {
    this.showLoading = false;
    this.showError(error, fallback);
  }

  private showError(error: any, fallback: string): void {
    this.toast.error({
      summary: 'Agenda',
      detail: error?.error?.message ?? fallback
    });
  }

  private toLocalISOString(date: Date): string {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 19);
  }
}
