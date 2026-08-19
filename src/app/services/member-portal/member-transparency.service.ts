import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';

export type TransparencyMode = 'DISABLED' | 'FULL' | 'PARTIAL';
export type PlanVisibility = 'HIDDEN' | 'TOTAL_ONLY' | 'DETAILED';

export interface TransparencyPlanAccount {
  id: string;
  codeTree: string;
  description: string;
  financialNature: 'REVENUE' | 'EXPENSE';
  visibility: PlanVisibility;
}

export interface TransparencyConfiguration {
  mode: TransparencyMode;
  memberApprovalEnabled: boolean;
  planAccounts: TransparencyPlanAccount[];
}

@Injectable({providedIn: 'root'})
export class MemberTransparencyService {
  constructor(private readonly http: HttpClient) {}
  get(): Observable<TransparencyConfiguration> {
    return this.http.get<{configuration: TransparencyConfiguration}>('getMemberTransparencyConfiguration')
      .pipe(map(response => response.configuration));
  }
  update(configuration: TransparencyConfiguration): Observable<TransparencyConfiguration> {
    return this.http.post<{configuration: TransparencyConfiguration}>('updateMemberTransparencyConfiguration', {configuration})
      .pipe(map(response => response.configuration));
  }
}
