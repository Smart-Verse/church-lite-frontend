import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {finalize} from 'rxjs';
import {TableModule} from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {MenuItem} from 'primeng/api';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {AccountBalancesComponent, AccountBalanceItem} from '../../shared/components/account-balances/account-balances.component';
import {ToastService} from '../../shared/services/toast/toast.service';
import {BalanceTransferService, TransferHistory} from './balance-transfer.service';

@Component({
  selector:'app-balance-transfers',
  imports:[SharedCommonModule, TableModule, ConfirmDialogModule, BreadcrumbModule, AccountBalancesComponent],
  providers:[ConfirmationService],
  templateUrl:'./balance-transfers.component.html',
  styleUrl:'./balance-transfers.component.scss'
})
export class BalanceTransfersComponent implements OnInit {
  loading=true; saving=false; history:TransferHistory[]=[]; accounts:AccountBalanceItem[]=[];
  readonly breadcrumbHome:MenuItem={icon:'pi pi-home',routerLink:'/home/dashboard'};
  readonly breadcrumbItems:MenuItem[]=[{label:'Financeiro'},{label:'Movimentações'},{label:'Transferências'}];
  readonly form=this.fb.group({source:[null as any, Validators.required],destination:[null as any, Validators.required],value:[null as number|null,[Validators.required,Validators.min(.01)]],date:[new Date(),Validators.required],description:['',Validators.required],observation:['']});

  constructor(private readonly fb:FormBuilder, private readonly service:BalanceTransferService,
              private readonly toast:ToastService, private readonly confirmation:ConfirmationService) {}
  ngOnInit():void { this.load(); }
  load():void {
    this.loading=true;
    this.service.load().pipe(finalize(()=>this.loading=false)).subscribe({next:data=>{
      this.history=data.transfers;
      this.accounts=data.accounts.map(item=>({id:item.id,description:item.descricao,detail:item.tipo==='BANK'?[item.banco,item.conta].filter(Boolean).join(' · '):null,balance:item.saldo,type:item.tipo,open:item.aberto}));
    },error:()=>this.toast.error({summary:'Transferências',detail:'Não foi possível carregar os dados.'})});
  }
  submit():void {
    this.form.markAllAsTouched(); if(this.form.invalid)return;
    const raw=this.form.getRawValue(); this.saving=true;
    this.service.create({sourceId:raw.source.id,destinationId:raw.destination.id,value:raw.value,dateTransaction:this.localDate(raw.date!),description:raw.description,observation:raw.observation})
      .pipe(finalize(()=>this.saving=false)).subscribe({next:()=>{this.toast.success({summary:'Transferência realizada',detail:'Os dois saldos foram atualizados.'});this.clearForm();this.load();},error:err=>this.toast.error({summary:'Não foi possível transferir',detail:err?.error?.message || 'Verifique os dados informados.'})});
  }
  reverse(item:TransferHistory):void {
    this.confirmation.confirm({header:'Estornar transferência',message:`Remover a transferência de ${this.money(item.value)}?`,icon:'pi pi-exclamation-triangle',acceptLabel:'Estornar',rejectLabel:'Cancelar',accept:()=>this.service.reverse(item.transferId).subscribe({next:()=>{this.toast.success({summary:'Transferência estornada',detail:'As duas movimentações foram removidas.'});this.load();},error:err=>this.toast.error({summary:'Não foi possível estornar',detail:err?.error?.message || 'Confira o saldo e a sessão dos caixas.'})})});
  }
  money(value:number):string { return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value); }
  private clearForm():void {
    this.form.reset({source:null,destination:null,value:null,description:'',observation:'',date:new Date()});
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
  }
  private localDate(date:Date):string { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
}
