import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';

export interface ApprovalCashClosing {id:string;cash:string;startDate:string;endDate:string;finalBalance:number;}
export interface FinancialStatement {id:string;title:string;description?:string;status:'DRAFT'|'OPEN'|'CLOSED';publishedAt?:string;closedAt?:string;cashClosings:ApprovalCashClosing[];revenue:number;expense:number;approvals:number;rejections:number;votes:number;approvalPercentage:number;alreadyVoted:boolean;}
export interface StatementSaveRequest {id?:string;title:string;description?:string;cashClosingIds:string[];}

@Injectable({providedIn:'root'})
export class MemberFinancialApprovalService {
  constructor(private readonly http:HttpClient){}
  closings():Observable<ApprovalCashClosing[]>{return this.http.get<{cashClosings:ApprovalCashClosing[]}>('getMemberApprovalCashClosings').pipe(map(response=>response.cashClosings));}
  adminList():Observable<FinancialStatement[]>{return this.http.get<{statements:FinancialStatement[]}>('getMemberFinancialStatements').pipe(map(response=>response.statements));}
  save(request:StatementSaveRequest):Observable<FinancialStatement>{return this.http.post<{statement:FinancialStatement}>('saveMemberFinancialStatement',request).pipe(map(response=>response.statement));}
  publish(id:string):Observable<FinancialStatement>{return this.http.post<{statement:FinancialStatement}>('publishMemberFinancialStatement',{id}).pipe(map(response=>response.statement));}
  close(id:string):Observable<FinancialStatement>{return this.http.post<{statement:FinancialStatement}>('closeMemberFinancialStatement',{id}).pipe(map(response=>response.statement));}
  memberList():Observable<FinancialStatement[]>{return this.http.get<{statements:FinancialStatement[]}>('getMemberFinancialApprovals').pipe(map(response=>response.statements));}
  vote(id:string,approved:boolean):Observable<FinancialStatement>{return this.http.post<{statement:FinancialStatement}>('voteMemberFinancialApproval',{id,approved}).pipe(map(response=>response.statement));}
}
