import {AfterViewInit,Component,ElementRef,EventEmitter,Inject,Input,OnChanges,OnDestroy,Output,PLATFORM_ID,SimpleChanges,ViewChild} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {TranslateService} from '../../services/translate/translate.service';
import {Column} from '../datatable/datatable';
export interface MobileTreeAction { data:any; action:'add'|'edit'|'delete'; }
@Component({selector:'app-mobile-tree-list',imports:[ButtonModule],templateUrl:'./mobile-tree-list.component.html',styleUrl:'./mobile-tree-list.component.scss'})
export class MobileTreeListComponent implements AfterViewInit,OnChanges,OnDestroy {
 @Input() nodes:any[]=[]; @Input() fields:Column[]=[]; @Input() loading=false; @Input() hasMore=false;
 @Output() loadMore=new EventEmitter<void>(); @Output() treeAction=new EventEmitter<MobileTreeAction>(); @ViewChild('sentinel') sentinel?:ElementRef<HTMLElement>;
 private expanded=new Set<unknown>(); private observer?:IntersectionObserver; private requesting=false;
 constructor(public translateService:TranslateService,@Inject(PLATFORM_ID) private platformId:object){}
 get visibleRows():any[]{return this.flatten(this.nodes)}
 ngOnChanges(changes:SimpleChanges){if(changes['loading']&&!this.loading){this.requesting=false;if(isPlatformBrowser(this.platformId))setTimeout(()=>this.requestNext())}}
 ngAfterViewInit(){if(!isPlatformBrowser(this.platformId)||!this.sentinel)return;this.observer=new IntersectionObserver(e=>{if(e.some(x=>x.isIntersecting))this.requestNext()},{rootMargin:'240px 0px'});this.observer.observe(this.sentinel.nativeElement)}
 ngOnDestroy(){this.observer?.disconnect()}
 toggle(n:any){const k=this.key(n);this.expanded.has(k)?this.expanded.delete(k):this.expanded.add(k)}
 isExpanded(n:any){return this.expanded.has(this.key(n))}
 hasChildren(n:any){return (n?.children?.length??0)>0}
 value(d:any,f:string){return f.split('.').reduce((v,k)=>v?.[k],d)??''}
 emit(data:any,action:MobileTreeAction['action']){this.treeAction.emit({data,action})}
 private requestNext(){if(!isPlatformBrowser(this.platformId)||!window.matchMedia('(max-width: 768px)').matches||this.loading||this.requesting||!this.hasMore)return;this.requesting=true;this.loadMore.emit()}
 private flatten(nodes:any[],level=0):any[]{return nodes.flatMap(n=>[{node:n,level},...(this.isExpanded(n)?this.flatten(n.children??[],level+1):[])])}
 private key(n:any){return n?.data?.id??n}
}
