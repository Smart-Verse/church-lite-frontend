import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { CrudService } from '../../shared/services/crud/crud.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { TranslateService, TranslationOverride } from '../../shared/services/translate/translate.service';

interface TranslationRow {
  key: string;
  defaultValue: string;
  value: string;
  override?: TranslationOverride;
}

@Component({
  selector: 'app-translations',
  imports: [SharedCommonModule, LoadingComponent, BreadcrumbModule, IconFieldModule, InputIconModule, TableModule, TooltipModule],
  providers: [CrudService, ToastService],
  templateUrl: './translations.component.html',
  styleUrl: './translations.component.scss'
})
export class TranslationsComponent implements OnInit {
  readonly breadcrumbHome: MenuItem = {icon: 'pi pi-home', routerLink: '/home/dashboard'};
  breadcrumbItems: MenuItem[] = [];
  readonly languages = [
    {label: 'Português', value: 'pt-BR'},
    {label: 'English', value: 'en-US'},
    {label: 'Español', value: 'es-ES'}
  ];
  language = 'pt-BR';
  rows: TranslationRow[] = [];
  search = '';
  loading = false;
  saving = false;

  constructor(
    public readonly translateService: TranslateService,
    private readonly crud: CrudService,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.language = this.translateService.currentLanguage();
    this.breadcrumbItems = [{label: this.translateService.translate('translations')}];
    this.load();
  }

  get filteredRows(): TranslationRow[] {
    const term = this.search.trim().toLocaleLowerCase();
    return term ? this.rows.filter(row => row.key.toLocaleLowerCase().includes(term) || row.value.toLocaleLowerCase().includes(term)) : this.rows;
  }

  get changedCount(): number {
    return this.rows.filter(row => row.value.trim() !== (row.override?.value ?? row.defaultValue)).length;
  }

  load(): void {
    this.loading = true;
    forkJoin({
      defaults: this.translateService.getDefaultTranslations(this.language),
      overrides: this.translateService.getOverrides(this.language)
    }).subscribe({
      next: ({defaults, overrides}) => {
        const byKey = new Map(overrides.map(item => [item.translationKey, item]));
        this.rows = Object.entries(defaults).sort(([a], [b]) => a.localeCompare(b)).map(([key, defaultValue]) => ({
          key, defaultValue, override: byKey.get(key), value: byKey.get(key)?.value ?? defaultValue
        }));
        this.loading = false;
      },
      error: error => this.handleError(error, 'translations_load_error')
    });
  }

  restore(row: TranslationRow): void { row.value = row.defaultValue; }

  save(): void {
    const changed = this.rows.filter(row => row.value.trim() !== (row.override?.value ?? row.defaultValue));
    if (!changed.length) return;
    const requests = changed.map(row => {
      const value = row.value.trim();
      if (value === row.defaultValue && row.override) return this.crud.onDelete('translation', row.override.id!);
      const payload: TranslationOverride = {language: this.language, translationKey: row.key, value};
      return row.override ? this.crud.onUpdate('translation', row.override.id!, payload) : this.crud.onSave('translation', payload);
    });
    this.saving = true;
    forkJoin(requests).subscribe({
      next: () => {
        this.saving = false;
        this.translateService.loadLanguage(this.language, true).subscribe(() => this.load());
        this.toast.success({summary: this.translateService.translate('common_message'), detail: this.translateService.translate('translations_save_success')});
      },
      error: error => this.handleError(error, 'translations_save_error')
    });
  }

  private handleError(error: any, key: string): void {
    this.loading = this.saving = false;
    this.toast.error({summary: this.translateService.translate('common_message'), detail: error?.error?.message ?? this.translateService.translate(key)});
  }
}
