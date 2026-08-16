import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { Subscription } from 'rxjs';
import { ScreenReportOption } from '../../services/reports/screen-report.models';
import { ScreenReportService } from '../../services/reports/screen-report.service';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '../../services/translate/translate.service';

@Component({
  selector: 'app-screen-report-button',
  imports: [ButtonModule, MenuModule],
  templateUrl: './screen-report-button.component.html',
  styleUrl: './screen-report-button.component.scss',
})
export class ScreenReportButtonComponent implements OnChanges, OnDestroy {
  @Input({required: true}) screen = '';
  @Input({required: true}) data: Record<string, unknown> = {};
  @Input() disabled = false;
  @Input() outlined = true;

  reports: ScreenReportOption[] = [];
  menuItems: MenuItem[] = [];
  loading = false;
  private loadSubscription?: Subscription;
  private generateSubscription?: Subscription;

  constructor(
    private readonly reportsService: ScreenReportService,
    private readonly toast: ToastService,
    public readonly translate: TranslateService,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['screen']) this.loadReports();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.generateSubscription?.unsubscribe();
  }

  open(event: Event, menu: Menu): void {
    if (this.disabled || this.loading || !this.reports.length) return;
    if (this.reports.length === 1) {
      this.generate(this.reports[0]);
      return;
    }
    menu.toggle(event);
  }

  private loadReports(): void {
    this.loadSubscription?.unsubscribe();
    this.reports = [];
    this.menuItems = [];
    const normalizedScreen = this.normalizeScreen(this.screen);
    if (!normalizedScreen) return;

    this.loadSubscription = this.reportsService.getByScreen(normalizedScreen).subscribe({
      next: response => {
        this.reports = response.reports ?? [];
        this.menuItems = this.reports.map(report => ({
          label: report.name,
          icon: 'pi pi-file-pdf',
          command: () => this.generate(report),
        }));
      },
      error: () => {
        this.reports = [];
        this.menuItems = [];
      },
    });
  }

  private generate(report: ScreenReportOption): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const preview = window.open('', '_blank');
    this.loading = true;
    this.generateSubscription?.unsubscribe();
    this.generateSubscription = this.reportsService.generate({
      reportId: report.id,
      data: this.data,
    }).subscribe({
      next: response => {
        this.loading = false;
        try {
          const url = this.createPdfUrl(response.report);
          if (preview) preview.location.href = url;
          else this.openFallback(url);
          window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
        } catch {
          preview?.close();
          this.showError('screen_report_invalid_pdf');
        }
      },
      error: error => {
        this.loading = false;
        preview?.close();
        this.showError(error?.error?.message ?? 'screen_report_generation_error');
      },
    });
  }

  private createPdfUrl(base64: string): string {
    if (!base64) throw new Error('empty_pdf');
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) {
      bytes[index] = binary.charCodeAt(index);
    }
    return URL.createObjectURL(new Blob([bytes], {type: 'application/pdf'}));
  }

  private openFallback(url: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.click();
  }

  private normalizeScreen(screen: string): string {
    const path = screen.split('?')[0].trim();
    if (!path) return '';
    return path.length > 1 ? path.replace(/\/+$/, '') : path;
  }

  private showError(message: string): void {
    this.toast.error({
      summary: this.translate.translate('common_message'),
      detail: this.translate.translate(message),
    });
  }
}
