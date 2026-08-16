import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GenerateScreenReportRequest,
  GenerateScreenReportResponse,
  ScreenReportsResponse,
} from './screen-report.models';

@Injectable({providedIn: 'root'})
export class ScreenReportService {
  constructor(private readonly http: HttpClient) {}

  getByScreen(screen: string): Observable<ScreenReportsResponse> {
    return this.http.get<ScreenReportsResponse>('getScreenReports', {
      params: new HttpParams().set('screen', screen),
    });
  }

  generate(request: GenerateScreenReportRequest): Observable<GenerateScreenReportResponse> {
    return this.http.post<GenerateScreenReportResponse>('generateScreenReport', request);
  }
}
