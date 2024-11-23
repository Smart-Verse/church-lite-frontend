import { Component } from '@angular/core';
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {FullCalendarModule} from "@fullcalendar/angular";
import {CalendarOptions} from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';


@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [
    LoadingComponent,
    FullCalendarModule
  ],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss'
})
export class SchedulerComponent  extends BaseComponent{

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    selectable: true,
    editable: true,
    droppable: true,
    plugins: [
      dayGridPlugin,
      interactionPlugin,
      timeGridPlugin
    ],
    timeZone: 'UTC',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    eventClick: (arg) => this.eventClick(arg),
    eventDrop: (arg) => this.eventDrop(arg),
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2024-11-01', color: '#000000' },
      { title: 'event 2', date: '2024-11-02' }
    ],
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Hoje',
      list: 'Lista'
    }
  };

  constructor(
    public readonly translateService: TranslateService,
  ) {
    super();
  }

  private handleDateClick(arg: any) {

  }

  private eventDrop(arg: any) {

  }

  private eventClick(arg: any) {

  }
}
