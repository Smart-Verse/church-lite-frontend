import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {MenuItem} from 'primeng/api';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {LoadingComponent} from '../../shared/components/loading/loading.component';
import {CrudService} from '../../shared/services/crud/crud.service';
import {ToastService} from '../../shared/services/toast/toast.service';
import {TranslateService} from '../../shared/services/translate/translate.service';

@Component({selector:'app-cell',imports:[SharedCommonModule,LoadingComponent,BreadcrumbModule],providers:[CrudService,ToastService],templateUrl:'./cell.component.html',styleUrl:'./cell.component.scss'})
export class CellComponent implements OnInit {
  form: FormGroup; id: string | null = null; loading=false; saving=false;
  readonly breadcrumbHome: MenuItem={icon:'pi pi-home',routerLink:'/home/dashboard'}; breadcrumbItems:MenuItem[]=[];
  readonly types=['MIXED','YOUTH','TEENS','CHILDREN','COUPLES','MEN','WOMEN','FAMILY','UNIVERSITY','SENIORS','OTHER'].map(value=>({value,labelKey:`cells_type_${value.toLowerCase()}`}));
  readonly statuses=['PLANNED','ACTIVE','INACTIVE','SUSPENDED','MULTIPLYING','MULTIPLIED','CLOSED'].map(value=>({value,labelKey:`cells_status_${value.toLowerCase()}`}));
  readonly weekdays=Array.from({length:7},(_,value)=>({value,labelKey:`weekday_${value}`}));
  constructor(private fb:FormBuilder,private crud:CrudService,private route:ActivatedRoute,private router:Router,private toast:ToastService,public translateService:TranslateService){
    this.form=this.fb.group({code:['',Validators.required],name:['',Validators.required],description:[''],type:['MIXED',Validators.required],status:['PLANNED',Validators.required],organizationUnit:[null],meetingDay:[null],meetingTime:[''],startDate:['',Validators.required],capacity:[null],memberGoal:[null],visitorGoal:[null],multiplicationGoal:[null],expectedMultiplicationDate:[null],address:[''],neighborhood:[''],city:[null],latitude:[null],longitude:[null],notes:['']});
  }
  ngOnInit(){this.id=this.route.snapshot.paramMap.get('id');this.breadcrumbItems=[{label:this.t('cells_menu')},{label:this.t('cells_list'),routerLink:'/home/register/cells'},{label:this.t(this.id&&this.id!=='new'?'entity_edit':'entity_new')}];if(this.id&&this.id!=='new')this.load();}
  options(items:any[]){return items.map(item=>({...item,label:this.t(item.labelKey)}));}
  save(){if(this.form.invalid){this.form.markAllAsTouched();this.toast.warn({summary:this.t('common_message'),detail:this.t('common_message_invalid_fields')});return;}this.saving=this.loading=true;const payload=this.payload();const req=this.id&&this.id!=='new'?this.crud.onUpdate('cell',this.id,payload):this.crud.onSave('cell',payload);req.subscribe({next:()=>{this.toast.success({summary:this.t('common_message'),detail:this.t('common_message_success')});this.cancel();},error:e=>{this.saving=this.loading=false;this.toast.error({summary:this.t('common_message'),detail:e?.error?.message??this.t('cells_save_error')});}});}
  cancel(){this.router.navigate(['/home/register/cells']);}
  private payload(){const value=this.form.value;return {...value,type:value.type?.value??value.type,status:value.status?.value??value.status,meetingDay:value.meetingDay?.value??value.meetingDay};}
  private load(){this.loading=true;this.crud.onGet('cell',this.id).subscribe({next:data=>{this.form.patchValue({...data,type:this.types.find(x=>x.value===data.type),status:this.statuses.find(x=>x.value===data.status),meetingDay:this.weekdays.find(x=>x.value===data.meetingDay)});this.loading=false;},error:e=>{this.loading=false;this.toast.error({summary:this.t('common_message'),detail:e?.error?.message??this.t('cells_load_error')});}});}
  private t(key:string){return this.translateService.translate(key);}
}
