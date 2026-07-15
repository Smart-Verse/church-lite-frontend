import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardAgendaResponse, DashboardFinancialResponse, DashboardFilters } from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  financial(filters: DashboardFilters): Observable<DashboardFinancialResponse> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) params = params.set(key, String(value));
    });
    return this.http.get<DashboardFinancialResponse>('getDashboardFinancial', { params });
  }

  agenda(): Observable<DashboardAgendaResponse> {
    return this.http.get<DashboardAgendaResponse>('getDashboardAgenda');
  }
}
