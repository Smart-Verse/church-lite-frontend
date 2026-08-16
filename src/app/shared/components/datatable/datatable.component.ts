import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule  } from 'primeng/table';
import { DataTable } from './datatable';
import { DrawerModule } from 'primeng/drawer';
import {RequestData} from "../../interfaces/request-data";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { TranslateService } from '../../services/translate/translate.service';
import {TooltipModule} from 'primeng/tooltip';
import { Router } from '@angular/router';
import { ScreenReportButtonComponent } from '../screen-report-button/screen-report-button.component';


export enum Action {
  DELETE,
  EDIT,
  ADD
}

@Component({
    selector: 'app-datatable',
    imports: [
    ButtonModule,
    TableModule,
    DrawerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PaginatorModule,
    ConfirmDialogModule,
    FormsModule,
    SelectModule,
    TooltipModule,
    ScreenReportButtonComponent
],
    providers: [
        ConfirmationService,
        DatePipe
    ],
    templateUrl: './datatable.component.html',
    styleUrl: './datatable.component.scss'
})
export class DatatableComponent implements OnChanges, AfterViewInit, OnDestroy {


  sidebarVisible: boolean = false;
  quickSearch: string = "";
  filterValues: Record<string, string> = {};
  appliedFilter: string = "";
  readonly tableStyle = {width: "100%", "min-width": "42rem"};
  @Input() config: DataTable = new DataTable();
  @Input() loading: boolean = false;
  @Input() createDisabled: boolean = false;
  @Input() createDisabledReason: string = '';
  @ViewChild('mobileSentinel') mobileSentinel?: ElementRef<HTMLElement>;

  @Output() onRegister: EventEmitter<any> = new EventEmitter();
  @Output() onRefresh: EventEmitter<RequestData> = new EventEmitter();
  private mobileObserver?: IntersectionObserver;
  private requestingNextPage = false;

  constructor(
    private confirmationService: ConfirmationService,
    public readonly translateService: TranslateService,
    private datePipe: DatePipe,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ){
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["config"] && !changes["config"].firstChange) {
      this.quickSearch = "";
      this.filterValues = {};
      this.appliedFilter = "";
      this.sidebarVisible = false;
    }
    if (changes["loading"] && !this.loading) {
      this.requestingNextPage = false;
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.loadNextMobilePage());
      }
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.mobileSentinel) return;
    this.mobileObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) this.loadNextMobilePage();
    }, {rootMargin: '240px 0px'});
    this.mobileObserver.observe(this.mobileSentinel.nativeElement);
  }

  ngOnDestroy(): void { this.mobileObserver?.disconnect(); }

  onRowData(row: any, header: string, col: any){
    const keys = header.split(".");
    let value = keys.reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : null), row);
    return this.onCustomValue(value,col);
  }

  onCustomValue(value: any, col: any): any{
    if(col.customValue){
      switch (col.customValue){
        case "MONEY":
          value = parseFloat(value).toFixed(2);
          break;
        case "DATE":
          value = this.datePipe.transform(value, 'dd/MM/yyyy')!;
          break;
        default:
          break;
      }
    }
    return value
  }

  pageChange($event: PaginatorState) {
    var data = new RequestData();
    data.size = $event.rows;
    data.offset = $event.page ? $event.page + 1 : 0;
    data.filter = this.appliedFilter;
    this.onRefresh.emit(data);
  }

  private loadNextMobilePage(): void {
    if (!isPlatformBrowser(this.platformId)
      || !window.matchMedia('(max-width: 768px)').matches
      || this.loading || this.requestingNextPage
      || this.config.values.length >= this.config.totalRecords) return;
    const data = new RequestData();
    data.size = this.config.size;
    data.offset = this.config.page + 1;
    data.filter = this.appliedFilter;
    data.append = true;
    this.requestingNextPage = true;
    this.onRefresh.emit(data);
  }

  onShowFilters() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onRegisterData(item: any, action: Action){
    if (action === Action.ADD && this.createDisabled) return;
    let obj = {
      data: item,
      action: action
    }
    this.onRegister.emit(obj);
  }

  onRefreshData(){
    this.quickSearch = "";
    this.filterValues = {};
    this.appliedFilter = "";
    this.sidebarVisible = false;
    this.onRefresh.emit(new RequestData());
  }

  onApplyFilters(): void {
    this.appliedFilter = this.buildFilter();
    this.sidebarVisible = false;
    const request = new RequestData();
    request.filter = this.appliedFilter;
    this.onRefresh.emit(request);
  }

  onQuickSearch(): void {
    const value = this.sanitizeFilterValue(this.quickSearch);
    this.filterValues = {};
    const field = this.config.filters[0]?.field;
    this.appliedFilter = value && field ? field + " eq " + value : "";
    const request = new RequestData();
    request.filter = this.appliedFilter;
    this.onRefresh.emit(request);
  }

  private buildFilter(): string {
    return this.config.filters
      .map(filter => {
        const value = this.sanitizeFilterValue(this.filterValues[filter.field] ?? "");
        if (!value) return "";
        return filter.operator === "nullability"
          ? filter.field + " " + value
          : filter.field + " eq " + value;
      })
      .filter(Boolean)
      .join(" and ");
  }

  private sanitizeFilterValue(value: string): string {
    return value.trim().replace(/\s+(and|or)\s+/gi, " ");
  }

  translatedOptions(options?: {label: string; value: string}[]): {label: string; value: string}[] {
    return (options ?? []).map(option => ({...option, label: this.translateService.translate(option.label)}));
  }

  get reportScreen(): string {
    return this.router.url.split('?')[0];
  }

  get reportData(): Record<string, unknown> {
    return {
      contents: this.config.values,
      total: this.config.totalRecords,
      size: this.config.size,
      offset: Math.max(0, this.config.page - 1),
      filter: this.appliedFilter,
    };
  }

  onDeleteData(item: any, action: Action){
    this.confirmationService.confirm({
      message: this.translateService.translate("common_message_confirmation_delete"),
      header: this.translateService.translate("common_message_header_confirmation_delete"),
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptLabel: this.translateService.translate("common_action_yes"),
      rejectLabel: this.translateService.translate("common_action_no"),
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
        this.onRegisterData(item,action)
      },
      reject: () => {}
    });
  }
}
