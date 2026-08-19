import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MenuItem} from 'primeng/api';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {EditorModule} from 'primeng/editor';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {ImageUploadService} from '../../shared/components/inputs/image-upload/image-upload.service';
import {ToastService} from '../../shared/services/toast/toast.service';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {SubscriptionService} from '../../shared/services/subscription/subscription.service';
import {Router} from '@angular/router';

interface ReportTemplate {
  id?: string;
  headerImage: string;
  headerText: string;
  footerText: string
}

@Component({
  selector: 'app-report-template',
  imports: [SharedCommonModule, BreadcrumbModule, EditorModule],
  templateUrl: './report-template.component.html',
  styleUrl: './report-template.component.scss'
})
export class ReportTemplateComponent implements OnInit {
  readonly breadcrumbHome: MenuItem = {icon: 'pi pi-home', routerLink: '/home/dashboard'};
  breadcrumbItems: MenuItem[] = [];
  model: ReportTemplate = {headerImage: '', headerText: '', footerText: ''};
  imageUrl = '';
  loading = false;
  saving = false;

  constructor(private http: HttpClient, private images: ImageUploadService, private toast: ToastService, public translate: TranslateService, private subscription: SubscriptionService, private router: Router) {
  }

  ngOnInit() {
    if (!this.subscription.hasFeature('REPORT_TEMPLATE')) {
      this.subscription.requestUpgrade();
      this.router.navigate(['/home/dashboard']);
      return;
    }
    this.breadcrumbItems = [{label: this.translate.translate('menu_report_header')}];
    this.load();
  }

  load() {
    this.loading = true;
    this.http.get<any>('reportTemplate', {
      params: {
        size: 1,
        offset: 1,
        filter: '',
        order: '',
        displayFields: '*'
      }
    }).subscribe({
      next: r => {
        this.model = r.contents?.[0] ?? this.model;
        this.loadImage();
      }, error: e => this.error(e)
    });
  }

  loadImage() {
    if (!this.model.headerImage) {
      this.imageUrl = '';
      this.loading = false;
      return;
    }
    this.images.onRequestDonwload(this.model.headerImage).subscribe({
      next: r => {
        this.imageUrl = r.url;
        this.loading = false;
      }, error: () => {
        this.imageUrl = '';
        this.loading = false;
      }
    });
  }

  imageLoading() {
    this.loading = !this.loading;
  }

  imageChanged(token: string) {
    this.model.headerImage = token;
  }

  save() {
    this.saving = true;
    const request = this.model.id ? this.http.put<ReportTemplate>('reportTemplate/' + this.model.id, this.model) : this.http.post<ReportTemplate>('reportTemplate', this.model);
    request.subscribe({
      next: r => {
        this.model = r;
        this.saving = false;
        this.toast.success({
          summary: this.translate.translate('common_message'),
          detail: this.translate.translate('report_template_saved')
        });
      }, error: e => this.error(e)
    });
  }

  private error(error: any) {
    this.loading = this.saving = false;
    this.toast.error({
      summary: this.translate.translate('common_message'),
      detail: error?.error?.message ?? this.translate.translate('report_template_error')
    });
  }
}
