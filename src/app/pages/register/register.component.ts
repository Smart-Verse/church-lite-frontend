import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { DataTable } from '../../shared/components/datatable/datatable';
import { RegisterService } from '../../services/register/register.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../shared/services/crud/crud.service';
import { config, RegisterRoutes } from './register';
import { RequestData } from '../../shared/interfaces/request-data';
import { BaseComponent } from '../../shared/common/base-component/base-component';
import { TranslateService } from '../../shared/services/translate/translate.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { Subscription } from 'rxjs';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import {SubscriptionService} from '../../shared/services/subscription/subscription.service';
import {SubscriptionResource} from '../../shared/services/subscription/subscription.models';

@Component({
  selector: 'app-register',
  imports: [SharedCommonModule, BreadcrumbModule],
  providers: [CrudService, ToastService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  datatable: DataTable = new DataTable();
  routeComponent: string | null = '';
  configuration: RegisterRoutes = new RegisterRoutes();
  public breadcrumbHome: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/home/dashboard',
  };
  public breadcrumbItems: MenuItem[] = [];
  private loadSubscription?: Subscription;
  incrementalLoading = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly crudService: CrudService,
    private readonly registerService: RegisterService,
    private readonly toastService: ToastService,
    public readonly translateService: TranslateService,
    public readonly subscriptionService: SubscriptionService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.routeComponent = params.get('hash');
      var obj = this.registerService.getModel(this.routeComponent || '');
      this.onSetPropertiesDatatable(obj);
    });
  }

  onSetPropertiesDatatable(obj: any): void {
    this.configuration =
      config.find((e) => e.view === obj.hash) ?? new RegisterRoutes();
    this.setBreadcrumb();
    this.datatable = new DataTable();
    this.datatable.fields = [...obj.fields];
    this.datatable.filters = [...(obj.filters ?? [])];
    this.onLoadAllData(new RequestData());
  }

  onLoadAllData(requestData: RequestData): void {
    this.loadSubscription?.unsubscribe();
    const append = requestData.append === true;
    this.incrementalLoading = append;
    this.showLoading = !append;
    requestData = this.includeFilters(requestData);
    this.loadSubscription = this.crudService
      .onGetAll(this.configuration.route, requestData)
      .subscribe({
        next: (res) => {
          const contents = res.contents ?? [];
          this.datatable.values = append ? this.uniqueById([...this.datatable.values, ...contents]) : contents;
          this.datatable.totalRecords = res.total;
          this.datatable.page = res.offset + 1;
          this.datatable.size = res.size;
          this.showLoading = false;
          this.incrementalLoading = false;
        },
        error: () => {
          this.showLoading = false;
          this.incrementalLoading = false;
        },
      });
  }

  private uniqueById(values: any[]): any[] {
    const seen = new Set<unknown>();
    return values.filter(value => {
      const key = value?.id;
      if (key == null || !seen.has(key)) { if (key != null) seen.add(key); return true; }
      return false;
    });
  }

  onDelete(id: any): void {
    this.onShowLoading();
    this.crudService.onDelete(this.configuration.route, id).subscribe({
      next: (res) => {
        this.subscriptionService.load(true);
        this.onLoadAllData(new RequestData());
        this.onShowLoading();
        this.onToast(1, '');
      },
      error: (err) => {
        this.onShowLoading();
        this.onToast(0, err.error.message);
      },
    });
  }

  onSelectedData(obj: any): void {
    if (obj.data && obj.action === 0) {
      this.onDelete(obj.data.id);
      return;
    }

    const target = obj.data?.id ?? 'new';
    this.router.navigate([target], { relativeTo: this.activatedRoute });
  }

  onToast(type: number, message: string): void {
    if (type === 0) {
      this.toastService.error({ summary: 'Mensagem', detail: message });
    } else {
      this.toastService.success({
        summary: 'Mensagem',
        detail: this.translateService.translate('common_message_success'),
      });
    }
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
  }

  get createResource(): SubscriptionResource | null {
    if (this.configuration.route === 'person') return 'PERSON';
    if (this.configuration.route === 'userConfiguration') return 'ADMIN_USER';
    return null;
  }

  get createDisabled(): boolean {
    return !!this.createResource && !this.subscriptionService.canCreate(this.createResource);
  }

  get createDisabledReason(): string {
    return this.createDisabled
      ? this.translateService.translate('subscription_resource_limit_reached')
      : '';
  }

  private setBreadcrumb(): void {
    const financial = ['bank', 'cash', 'revenues', 'expenses'].includes(
      this.configuration.view,
    );
    const others = ['positions', 'memberFunctions', 'eventsType'].includes(
      this.configuration.view,
    );
    const category = financial
      ? 'financial_page_financial'
      : others
        ? 'entity_others'
        : 'registrations_persons';
    this.breadcrumbItems = [
      { label: this.translateService.translate('entity_secretariat') },
      { label: this.translateService.translate(category) },
      { label: this.translateService.translate(this.configuration.header) },
    ];
  }

  private includeFilters(requestData: RequestData) {
    const filters = [this.configuration.defaultFilter, requestData.filter]
      .map((filter) => filter?.trim())
      .filter(Boolean);
    requestData.filter = filters.join(' and ');
    return requestData;
  }
}
