import {Component,OnInit} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {forkJoin,finalize} from 'rxjs';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {ToastService} from '../../shared/services/toast/toast.service';
import {ApprovalCashClosing,FinancialStatement,MemberFinancialApprovalService} from '../../services/member-portal/member-financial-approval.service';

@Component({selector:'app-member-approval-admin',imports:[SharedCommonModule],providers:[ToastService],templateUrl:'./member-approval-admin.component.html',styleUrl:'./member-approval-admin.component.scss'})
export class MemberApprovalAdminComponent implements OnInit{
 form:FormGroup;statements:FinancialStatement[]=[];closings:ApprovalCashClosing[]=[];loading=true;saving=false;
 constructor(fb:FormBuilder,private readonly service:MemberFinancialApprovalService,private readonly toast:ToastService){this.form=fb.group({title:['',Validators.required],description:[''],cashClosings:[[],Validators.required]});}
 ngOnInit():void{this.load();}
 load():void{this.loading=true;forkJoin({statements:this.service.adminList(),closings:this.service.closings()}).pipe(finalize(()=>this.loading=false)).subscribe({next:r=>{this.statements=r.statements;this.closings=r.closings;},error:e=>this.error(e)});}
 save():void{if(this.form.invalid){this.form.markAllAsTouched();return;}const v=this.form.getRawValue();this.saving=true;this.service.save({title:v.title,description:v.description,cashClosingIds:v.cashClosings.map((x:ApprovalCashClosing)=>x.id)}).pipe(finalize(()=>this.saving=false)).subscribe({next:()=>{this.form.reset({title:'',description:'',cashClosings:[]});this.success('Prestação de contas criada como rascunho.');this.load();},error:e=>this.error(e)});}
 publish(item:FinancialStatement):void{this.service.publish(item.id).subscribe({next:()=>{this.success('Prestação publicada no Portal do Membro.');this.load();},error:e=>this.error(e)});}
 close(item:FinancialStatement):void{this.service.close(item.id).subscribe({next:()=>{this.success('Votação encerrada.');this.load();},error:e=>this.error(e)});}
 private success(detail:string){this.toast.success({summary:'Tudo certo',detail});}private error(e:any){this.toast.error({summary:'Falha',detail:e.error?.message??'Não foi possível concluir a operação.'});}
}
