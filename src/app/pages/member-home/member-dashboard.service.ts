import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {MemberDashboard} from './member-dashboard.models';

@Injectable({providedIn: 'root'})
export class MemberDashboardService {
  constructor(private readonly http: HttpClient) {
  }

  get(): Observable<MemberDashboard> {
    return this.http.get<{ dashboard: MemberDashboard }>('getMemberDashboard')
      .pipe(map(response => response.dashboard));
  }
}
