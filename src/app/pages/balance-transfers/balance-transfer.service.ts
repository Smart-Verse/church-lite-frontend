import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export interface TransferAccount { id:string; descricao:string; tipo:'BANK'|'CASH'; banco?:string; conta?:string; aberto:boolean; saldo:number; }
export interface TransferHistory { transferId:string; dateTransaction:string; description:string; observation?:string; value:number; source:{id:string;description:string;typeCash:string}; destination:{id:string;description:string;typeCash:string}; reversible:boolean; }
export interface TransferSnapshot { accounts:TransferAccount[]; transfers:TransferHistory[]; }

@Injectable({providedIn:'root'})
export class BalanceTransferService {
  constructor(private readonly http:HttpClient) {}
  load():Observable<TransferSnapshot> { return this.http.get<TransferSnapshot>('getBalanceTransfers'); }
  create(body:unknown):Observable<unknown> { return this.http.post('createBalanceTransfer', body); }
  reverse(transferId:string):Observable<unknown> { return this.http.post('reverseBalanceTransfer', {transferId}); }
}
