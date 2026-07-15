import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {forkJoin, map} from 'rxjs';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {MenuItem} from 'primeng/api';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {LoadingComponent} from '../../shared/components/loading/loading.component';
import {CrudService} from '../../shared/services/crud/crud.service';
import {ToastService} from '../../shared/services/toast/toast.service';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {RequestData} from '../../shared/interfaces/request-data';

@Component({selector:'app-cells-foundation',imports:[SharedCommonModule,LoadingComponent,BreadcrumbModule,TableModule,TooltipModule],providers:[CrudService,ToastService],templateUrl:'./cells-foundation.component.html',styleUrl:'./cells-foundation.component.scss'})
export class CellsFoundationComponent implements OnInit {
 mode:'organization'|'team'|'settings'='organization'; loading=false; selectedCell:any=null; editingLevelId:string|null=null; editingUnitId:string|null=null;
 levels:any[]=[]; units:any[]=[]; leaderships:any[]=[]; members:any[]=[]; settings:any=null;
 breadcrumbHome:MenuItem={icon:'pi pi-home',routerLink:'/home/dashboard'}; breadcrumbItems:MenuItem[]=[];
 levelForm:FormGroup; unitForm:FormGroup; leadershipForm:FormGroup; memberForm:FormGroup; settingsForm:FormGroup;
 roles=['LEADER','VICE_LEADER','ASSISTANT_LEADER','TRAINEE_LEADER','SUPERVISOR','COORDINATOR','NETWORK_PASTOR','HOST','SECRETARY'].map(value=>({value,labelKey:`cells_role_${value.toLowerCase()}`}));
 memberRoles=['MEMBER','VISITOR_INTEGRATION','SUPPORT','SECRETARY'].map(value=>({value,labelKey:`cells_member_role_${value.toLowerCase()}`}));
 constructor(private fb:FormBuilder,private crud:CrudService,private route:ActivatedRoute,private toast:ToastService,public translateService:TranslateService){
  this.levelForm=fb.group({name:['',Validators.required],displayOrder:[1,Validators.required],active:[true]});
  this.unitForm=fb.group({name:['',Validators.required],description:[''],status:['ACTIVE'],levelType:[null,Validators.required],parentUnit:[null],responsible:[null]});
  this.leadershipForm=fb.group({person:[null,Validators.required],role:[null,Validators.required],startDate:[new Date().toISOString().slice(0,10),Validators.required],active:[true]});
  this.memberForm=fb.group({person:[null,Validators.required],entryDate:[new Date().toISOString().slice(0,10),Validators.required],status:['ACTIVE'],role:[null,Validators.required],primaryCell:[true],regularParticipant:[true],underFollowUp:[false],canReceiveResponsibilities:[true],origin:[''],notes:['']});
  this.settingsForm=fb.group({cellTerm:['Célula',Validators.required],allowMultipleCellsPerPerson:[false],allowMultipleLeadership:[false],requireReportApproval:[true],requireMultiplicationApproval:[true],allowVisitorsWithoutPerson:[true],absenceAlertCount:[3],visitsForIntegrationSuggestion:[3],lateReportDays:[2],defaultCapacity:[12]});
 }
 ngOnInit(){this.mode=this.route.snapshot.data['mode']??'organization';this.breadcrumbItems=[{label:this.t('cells_menu')},{label:this.t(`cells_${this.mode}`)}];this.mode==='organization'?this.loadOrganization():this.mode==='settings'?this.loadSettings():null;}
 opts(items:any[]){return items.map(x=>({...x,label:this.t(x.labelKey)}));}
 loadOrganization(){this.loading=true;forkJoin({levels:this.all('cellOrganizationLevelType'),units:this.all('cellOrganizationUnit')}).subscribe({next:r=>{this.levels=r.levels;this.units=r.units;this.loading=false;},error:e=>this.error(e)});}
 saveLevel(){if(this.levelForm.invalid)return;const request=this.editingLevelId?this.crud.onUpdate('cellOrganizationLevelType',this.editingLevelId,this.levelForm.value):this.crud.onSave('cellOrganizationLevelType',this.levelForm.value);this.persist(request,()=>{this.cancelLevelEdit();this.loadOrganization();});}
 editLevel(item:any){this.editingLevelId=item.id;this.levelForm.reset({name:item.name,displayOrder:item.displayOrder,active:item.active});}
 cancelLevelEdit(){this.editingLevelId=null;this.levelForm.reset({displayOrder:this.levels.length+1,active:true});}
 saveUnit(){if(this.unitForm.invalid)return;const request=this.editingUnitId?this.crud.onUpdate('cellOrganizationUnit',this.editingUnitId,this.unitForm.value):this.crud.onSave('cellOrganizationUnit',this.unitForm.value);this.persist(request,()=>{this.cancelUnitEdit();this.loadOrganization();});}
 editUnit(item:any){this.editingUnitId=item.id;this.unitForm.reset({name:item.name,description:item.description??'',status:item.status,levelType:item.levelType,parentUnit:item.parentUnit,responsible:item.responsible});}
 cancelUnitEdit(){this.editingUnitId=null;this.unitForm.reset({status:'ACTIVE'});}
 onCellSelected(){if(!this.selectedCell?.id)return;this.loading=true;forkJoin({leaderships:this.filtered('cellLeadership',`cell.id eq ${this.selectedCell.id}`),members:this.filtered('cellMember',`cell.id eq ${this.selectedCell.id}`)}).subscribe({next:r=>{this.leaderships=r.leaderships;this.members=r.members;this.loading=false;},error:e=>this.error(e)});}
 saveLeadership(){if(!this.selectedCell||this.leadershipForm.invalid)return;const v=this.leadershipForm.value;this.persist(this.crud.onSave('cellLeadership',{...v,cell:this.selectedCell,role:v.role?.value??v.role}),()=>{this.leadershipForm.reset({startDate:new Date().toISOString().slice(0,10),active:true});this.onCellSelected();});}
 saveMember(){if(!this.selectedCell||this.memberForm.invalid)return;const v=this.memberForm.value;this.persist(this.crud.onSave('cellMember',{...v,cell:this.selectedCell,role:v.role?.value??v.role}),()=>{this.memberForm.reset({entryDate:new Date().toISOString().slice(0,10),status:'ACTIVE',primaryCell:true,regularParticipant:true,underFollowUp:false,canReceiveResponsibilities:true});this.onCellSelected();});}
 endLeadership(item:any){this.persist(this.crud.onUpdate('cellLeadership',item.id,{...item,active:false,endDate:new Date().toISOString().slice(0,10)}),()=>this.onCellSelected());}
 endMember(item:any){this.persist(this.crud.onUpdate('cellMember',item.id,{...item,status:'INACTIVE',exitDate:new Date().toISOString().slice(0,10)}),()=>this.onCellSelected());}
 loadSettings(){this.loading=true;this.all('cellModuleSettings').subscribe({next:r=>{this.settings=r[0]??null;if(this.settings)this.settingsForm.patchValue(this.settings);this.loading=false;},error:e=>this.error(e)});}
 saveSettings(){if(this.settingsForm.invalid)return;const req=this.settings?this.crud.onUpdate('cellModuleSettings',this.settings.id,this.settingsForm.value):this.crud.onSave('cellModuleSettings',this.settingsForm.value);this.persist(req,()=>this.loadSettings());}
 private all(route:string){const q=new RequestData();q.size=500;q.offset=1;return this.crud.onGetAll(route,q).pipe(map(r=>r.contents??[]));}
 private filtered(route:string,filter:string){const q=new RequestData();q.size=500;q.offset=1;q.filter=filter;return this.crud.onGetAll(route,q).pipe(map(r=>r.contents??[]));}
 private persist(req:any,next:()=>void){this.loading=true;req.subscribe({next:()=>{this.toast.success({summary:this.t('common_message'),detail:this.t('common_message_success')});next();},error:(e:any)=>this.error(e)});}
 private error(e:any){this.loading=false;this.toast.error({summary:this.t('common_message'),detail:e?.error?.message??this.t('cells_operation_error')});}
 private t(k:string){return this.translateService.translate(k);}
}
