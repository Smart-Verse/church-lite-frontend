import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export interface ApprovalCashClosing {id:string;cash:string;startDate:string;endDate:string;finalBalance:number;}
export interface FinancialStatement {id:string;title:string;description?:string;status:'DRAFT'|'OPEN'|'CLOSED';publishedAt?:string;closedAt?:string;cashClosings:ApprovalCashClosing[];revenue:number;expense:number;approvals:number;rejections:number;votes:number;approvalPercentage:number;alreadyVoted:boolean;}
export interface StatementSaveRequest {id?:string;title:string;description?:string;cashClosingIds:string[];}

@Injectable({providedIn:'root'})
export class MemberFinancialApprovalService {
  constructor(private readonly http:HttpClient){}
  closings():Observable<ApprovalCashClosing[]>{return this.http.get<ApprovalCashClosing[]>('memberApproval/cashClosings');}
  adminList():Observable<FinancialStatement[]>{return this.http.get<FinancialStatement[]>('memberApproval/statements');}
  save(request:StatementSaveRequest):Observable<FinancialStatement>{return this.http.post<FinancialStatement>('memberApproval/statements',request);}
  publish(id:string):Observable<FinancialStatement>{return this.http.put<FinancialStatement>(`memberApproval/statements/${id}/publish`,{});}
  close(id:string):Observable<FinancialStatement>{return this.http.put<FinancialStatement>(`memberApproval/statements/${id}/close`,{});}
  memberList():Observable<FinancialStatement[]>{return this.http.get<FinancialStatement[]>('member-api/financial-approvals');}
  vote(id:string,approved:boolean):Observable<FinancialStatement>{return this.http.post<FinancialStatement>(`member-api/financial-approvals/${id}/vote`,{approved});}
}
