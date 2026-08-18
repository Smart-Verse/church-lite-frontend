import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedCommonModule } from '../../shared/common/shared-common.module';

@Component({selector:'app-member-access-confirm',imports:[SharedCommonModule],template:`<main class="confirm"><i [class]="authorized ? 'pi pi-check-circle' : 'pi pi-spin pi-spinner'"></i><h1>{{authorized ? 'Acesso confirmado!' : 'Confirmando seu acesso...'}}</h1><p>{{authorized ? 'Sua conta está pronta para entrar no Portal do Membro.' : 'Aguarde só um instante.'}}</p>@if(authorized){<p-button label="Ir para o login" icon="pi pi-sign-in" (onClick)="login()"/>}</main>`,styles:[`:host{display:grid;min-height:100dvh;place-items:center;background:var(--app-page-background)}.confirm{text-align:center;color:var(--p-text-color)}i{font-size:3rem;color:var(--p-primary-color)}h1{margin:.8rem 0 .3rem}p{color:var(--p-text-muted-color);margin:0 0 1.2rem}`]})
export class MemberAccessConfirmComponent implements OnInit {
  authorized=false;
  constructor(private http:HttpClient,private route:ActivatedRoute,private router:Router){}
  ngOnInit():void{this.http.get<{authorize:boolean}>(`verifyURL?token=${this.route.snapshot.paramMap.get('token')}`).subscribe(response=>this.authorized=response.authorize);}
  login():void{this.router.navigate(['/login']);}
}
