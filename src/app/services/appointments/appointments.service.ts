import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export type AppointmentStatus = 'SCHEDULED' | 'CANCELLED';
export type RecurrenceType = 'NONE' | 'WEEKLY';

export interface EventType {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Appointment {
  id?: string;
  eventsType: EventType;
  userConfiguration: { id: string };
  initialDate: string;
  finalDate: string;
  local: string;
  description?: string;
  status: AppointmentStatus;
  recurrenceType: RecurrenceType;
  recurrenceDays?: string | null;
  recurrenceEndDate?: string | null;
  recurrenceGroupId?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  constructor(private readonly http: HttpClient) {}

  getAppointments(): Observable<{ contents: Appointment[] }> {
    return this.http.get<{ contents: Appointment[] }>(
      'appointments?size=1000&offset=1&filter=&order=&displayFields=*'
    );
  }

  getEventTypes(): Observable<{ contents: EventType[] }> {
    return this.http.get<{ contents: EventType[] }>(
      'eventsType?size=1000&offset=1&filter=&order=&displayFields=*'
    );
  }

  create(appointment: Appointment): Observable<HttpResponse<{ appointments: Appointment[] }>> {
    return this.http.post<{ appointments: Appointment[] }>(
      'createRecurringAppointments',
      { appointment },
      { observe: 'response' }
    );
  }

  update(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`appointments/${appointment.id}`, appointment);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`appointments/${id}`);
  }
}
