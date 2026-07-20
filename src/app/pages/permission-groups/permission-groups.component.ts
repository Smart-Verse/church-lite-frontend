import {Component,OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError,forkJoin,of} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {TableModule} from 'primeng/table';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {ToastService} from '../../shared/services/toast/toast.service';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {SubscriptionService} from '../../shared/services/subscription/subscription.service';
interface ResourcePermission{resource:string;description:string;permissions:string[]}
interface Denial{id?:string;resource:string;permission:string}
interface Group{id?:string;name:string;description?:string;active:boolean;userIds:string[];members?:{id?:string;userId:string}[];denials:Denial[]}
interface User{id?:string;hash?:string;name:string;email:string}
@Component({
 selector:'app-permission-groups',
 imports:[SharedCommonModule,BreadcrumbModule,TableModule,IconFieldModule,InputIconModule,ToggleSwitchModule],
 templateUrl:'./permission-groups.component.html',
 styleUrl:'./permission-groups.component.scss'
})
export class PermissionGroupsComponent implements OnInit{
 readonly breadcrumbHome:MenuItem={icon:'pi pi-home',routerLink:'/home/dashboard'};
 breadcrumbItems:MenuItem[]=[];groups:Group[]=[];resources:ResourcePermission[]=[];users:User[]=[];
 selected?:Group;selectedUser?:User;loading=false;saving=false;search='';
 constructor(private http:HttpClient,private toast:ToastService,public translate:TranslateService,public subscription:SubscriptionService){}
 ngOnInit(){this.breadcrumbItems=[{label:this.translate.translate('menu_permissions')}];this.load();}
 get selectedUsers(){return this.selected?.userIds.map(id=>this.users.find(user=>(user.hash??user.id)===id)).filter((user):user is User=>!!user)??[];}
 hasPermission(resource:ResourcePermission,permission:string){return resource.permissions.includes(permission);}
 get statusOptions(){return [{label:this.translate.translate('status_active'),value:true},{label:this.translate.translate('status_inactive'),value:false}];}
 get filteredGroups():Group[]{const term=this.search.trim().toLocaleLowerCase();return term?this.groups.filter(group=>group.name.toLocaleLowerCase().includes(term)||(group.description??'').toLocaleLowerCase().includes(term)):this.groups;}
 load(){this.loading=true;forkJoin({
  groups:this.http.get<any>('permissionGroup',{params:{size:500,offset:1,filter:'',order:'',displayFields:'*'}}).pipe(catchError(()=>of({contents:[]}))),
  resources:this.http.get<{resources:ResourcePermission[]}>('getPermissionResources'),
  users:this.http.get<any>('userConfiguration',{params:{size:500,offset:1,filter:'',order:'',displayFields:'*'}}).pipe(catchError(()=>of({contents:[]})))
 }).subscribe({next:r=>{
   this.resources=r.resources?.resources??[];
   const catalog=new Set(this.resources.flatMap(item=>item.permissions.map(permission=>item.resource+'::'+permission)));
   this.groups=(r.groups?.contents??[]).map((group:any)=>({...group,userIds:(group.members??[]).map((member:any)=>member.userId),denials:(group.denials??[]).filter((denial:Denial)=>catalog.has(denial.resource+'::'+denial.permission))}));
   this.users=r.users?.contents??[];
   this.loading=false;
  },error:e=>this.error(e)});}
 create(){if(!this.subscription.canCreate('ACTIVE_PERMISSION_GROUP')){this.subscription.requestUpgrade();return;}this.selectedUser=undefined;this.selected={name:'',description:'',active:true,userIds:[],denials:[]};}
 edit(group:Group){this.selectedUser=undefined;this.selected={...group,userIds:[...group.userIds],denials:group.denials.map(d=>({...d}))};}
 cancel(){this.selectedUser=undefined;this.selected=undefined;}
 allowed(resource:string,permission:string){return !this.selected?.denials.some(d=>d.resource===resource&&d.permission===permission);}
 togglePermission(resource:string,permission:string,allowed:boolean){
  if(!this.selected)return;this.selected.denials=this.selected.denials.filter(d=>d.resource!==resource||d.permission!==permission);
  if(!allowed)this.selected.denials.push({resource,permission});
 }
 addUser(){
  const user=this.selectedUser;
  const id=user?.hash??user?.id;
  if(!user||!id||!this.selected||this.selected.userIds.includes(id))return;
  if(!this.users.some(item=>(item.hash??item.id)===id))this.users=[...this.users,user];
  this.selected.userIds=[...this.selected.userIds,id];
  this.selectedUser=undefined;
 }
 removeUser(user:User){const id=user.hash??user.id;if(!id||!this.selected)return;this.selected.userIds=this.selected.userIds.filter(value=>value!==id);}
 save(){if(!this.selected?.name.trim())return;this.saving=true;const payload={...this.selected,members:this.selected.userIds.map(userId=>this.selected?.members?.find(member=>member.userId===userId)??{userId})};const request=this.selected.id?this.http.put<Group>('permissionGroup/'+this.selected.id,payload):this.http.post<Group>('permissionGroup',payload);request.subscribe({next:()=>{this.saving=false;this.selected=undefined;this.load();this.toast.success({summary:this.translate.translate('common_message'),detail:this.translate.translate('permission_group_save_success')});},error:e=>this.error(e)});}
 remove(group:Group){if(!group.id)return;this.http.delete('permissionGroup/'+group.id).subscribe({next:()=>this.load(),error:e=>this.error(e)});}
 private error(error:any){this.loading=this.saving=false;const key=error?.error?.message;if(error?.status===403&&key==='permission_access_denied')return;this.toast.error({summary:this.translate.translate('common_message'),detail:key?this.translate.translate(key):this.translate.translate('permission_group_error')});}
}
