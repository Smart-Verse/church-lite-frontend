import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Subject, catchError, debounceTime, distinctUntilChanged, finalize, switchMap, takeUntil } from 'rxjs';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { AgendaSnapshot, DashboardFilters, EvolutionPoint, FinancialSnapshot, GroupExpense } from './models/dashboard.models';
import { DashboardService } from './services/dashboard.service';
import {SubscriptionService} from '../../shared/services/subscription/subscription.service';
import {TranslateService} from '../../shared/services/translate/translate.service';

@Component({
  selector: 'app-dash',
  imports: [SharedCommonModule],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent implements OnInit, OnDestroy {
  evolutionMode: 'ALL' | 'REALIZED' | 'PLANNED' = 'ALL';
  financial?: FinancialSnapshot;
  agenda?: AgendaSnapshot;
  loadingFinancial = true;
  loadingAgenda = true;
  filterSidebarVisible = false;
  financialError = '';
  agendaError = '';
  readonly currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  readonly percent = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
  filters: DashboardFilters = this.defaultFilters();
  private readonly filterChanges = new Subject<DashboardFilters>();
  private readonly destroy$ = new Subject<void>();
  featureBlocked = false;
  selectedBank: any = null;
  selectedBankAccount: any = null;
  selectedCash: any = null;
  selectedCostCenter: any = null;
  selectedPlanAccount: any = null;

  constructor(private readonly dashboardService: DashboardService, private readonly router: Router, public readonly subscription: SubscriptionService, public readonly translate: TranslateService) {}

  ngOnInit(): void {
    if (!this.subscription.hasFeature('EXECUTIVE_DASHBOARD')) {
      this.featureBlocked = true;
      this.loadingFinancial = this.loadingAgenda = false;
      return;
    }
    this.filterChanges.pipe(
      debounceTime(250),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap(filters => {
        this.loadingFinancial = true;
        this.financialError = '';
        return this.dashboardService.financial(filters).pipe(
          catchError(() => { this.financialError = 'Não foi possível carregar os dados financeiros.'; return EMPTY; }),
          finalize(() => this.loadingFinancial = false)
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: response => {
        this.financial = response.data;
      },
      error: () => this.financialError = 'Não foi possível carregar os dados financeiros.'
    });
    this.applyFilters();
    this.loadAgenda();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  applyFilters(): void { this.filterChanges.next({ ...this.filters }); }
  setRelationFilter(filter: 'bancoId' | 'contaBancariaId' | 'caixaId' | 'centroCustoId' | 'planoContaId', value: any): void {
    this.filters[filter] = value?.id ?? value?.hash ?? '';
    this.applyFilters();
  }
  clearFilters(): void {
    this.selectedBank = this.selectedBankAccount = this.selectedCash = this.selectedCostCenter = this.selectedPlanAccount = null;
    this.filters = this.defaultFilters();
    this.applyFilters();
  }
  money(value: number | null | undefined): string { return this.currency.format(value ?? 0); }
  variation(value: number | null): string { return value === null ? 'Sem base anterior' : `${value >= 0 ? '+' : ''}${this.percent.format(value)}%`; }
  variationClass(value: number | null): string { return value === null ? 'neutral' : value >= 0 ? 'positive' : 'negative'; }
  maxEvolution(): number { return Math.max(1, ...(this.financial?.evolucao.flatMap(item => this.evolutionValues(item)) ?? [1])); }
  barWidth(value: number, max = this.maxEvolution()): number { return Math.max(value > 0 ? 2 : 0, Math.abs(value) * 100 / Math.max(max, 1)); }
  evolutionValues(item: EvolutionPoint): number[] {
    if (this.evolutionMode === 'REALIZED') return [item.receitas, item.despesas];
    if (this.evolutionMode === 'PLANNED') return [item.receitasPrevistas, item.despesasPrevistas];
    return [item.receitas, item.receitasPrevistas, item.despesas, item.despesasPrevistas];
  }
  groupWidth(item: GroupExpense): number { return Math.max(item.valorTotal > 0 ? 2 : 0, item.percentual); }
  goTransactions(): void { this.router.navigate(['/home/transactions']); }
  goAgenda(): void { this.router.navigate(['/home/scheduler']); }
  createAppointment(): void { this.router.navigate(['/home/scheduler'], { queryParams: { novo: 1 } }); }

  private loadAgenda(): void {
    this.loadingAgenda = true;
    this.dashboardService.agenda().pipe(finalize(() => this.loadingAgenda = false), takeUntil(this.destroy$)).subscribe({
      next: response => this.agenda = response.data,
      error: () => this.agendaError = 'Não foi possível carregar a agenda.'
    });
  }

  private defaultFilters(): DashboardFilters {
    const today = new Date();
    return { dataInicial: new Date(today.getFullYear(), today.getMonth(), 1), dataFinal: today,
      bancoId: '', contaBancariaId: '', caixaId: '', somenteCaixasAbertos: false, centroCustoId: '', planoContaId: '' };
  }
}
