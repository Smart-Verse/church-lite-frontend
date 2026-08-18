import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {MemberFinancialPortal} from './member-finance.models';
@Injectable({providedIn:'root'}) export class MemberFinanceService { constructor(private readonly http:HttpClient){} get():Observable<MemberFinancialPortal>{return this.http.get<MemberFinancialPortal>('member-api/transparency');} }
