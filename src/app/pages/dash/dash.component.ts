import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TooltipModule} from 'primeng/tooltip';
import {EMPTY, Subject, catchError, debounceTime, distinctUntilChanged, finalize, merge, switchMap, takeUntil} from 'rxjs';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {
  AgendaSnapshot,
  DashboardFilters,
  EvolutionPoint,
  FinancialSnapshot,
  GroupExpense
} from './models/dashboard.models';
import {DashboardService} from './services/dashboard.service';
import {SubscriptionService} from '../../shared/services/subscription/subscription.service';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {AccountBalancesComponent, AccountBalanceItem} from '../../shared/components/account-balances/account-balances.component';

@Component({
  selector: 'app-dash',
  imports: [SharedCommonModule, TooltipModule, AccountBalancesComponent],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent implements OnInit, OnDestroy {
  dashboardAccounts(data: FinancialSnapshot): AccountBalanceItem[] {
    return [
      ...data.saldos.contasBancarias.map(item => ({id: item.contaBancariaId, description: item.descricao, detail: `${item.banco} · ${item.numeroConta || 'Conta não informada'}`, balance: item.saldoAtual, type: 'BANK' as const, open: true})),
      ...data.saldos.caixas.map(item => ({id: item.caixaId, description: item.descricao, detail: item.dataAbertura ? `Aberto em ${new Date(item.dataAbertura).toLocaleDateString('pt-BR')}` : null, balance: item.saldoAtual, type: 'CASH' as const, open: item.situacao === 'ABERTO'}))
    ];
  }
  evolutionMode: 'ALL' | 'REALIZED' | 'PLANNED' = 'ALL';
  financial?: FinancialSnapshot;
  agenda?: AgendaSnapshot;
  loadingFinancial = true;
  loadingAgenda = true;
  filterSidebarVisible = false;
  financialError = '';
  agendaError = '';
  readonly currency = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});
  readonly percent = new Intl.NumberFormat('pt-BR', {maximumFractionDigits: 1});
  filters: DashboardFilters = this.defaultFilters();
  private readonly filterChanges = new Subject<DashboardFilters>();
  private readonly refreshChanges = new Subject<DashboardFilters>();
  private readonly destroy$ = new Subject<void>();
  featureBlocked = false;
  selectedBank: any = null;
  selectedBankAccount: any = null;
  selectedCash: any = null;
  selectedCostCenter: any = null;
  selectedPlanAccount: any = null;

  constructor(private readonly dashboardService: DashboardService, private readonly router: Router, public readonly subscription: SubscriptionService, public readonly translate: TranslateService) {
  }

  ngOnInit(): void {
    if (!this.subscription.hasFeature('EXECUTIVE_DASHBOARD')) {
      this.featureBlocked = true;
      this.loadingFinancial = this.loadingAgenda = false;
      return;
    }
    merge(
      this.filterChanges.pipe(
        debounceTime(250),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      ),
      this.refreshChanges
    ).pipe(
      switchMap(filters => {
        this.loadingFinancial = true;
        this.financialError = '';
        return this.dashboardService.financial(filters).pipe(
          catchError(() => {
            this.financialError = 'Não foi possível carregar os dados financeiros.';
            return EMPTY;
          }),
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    this.filterChanges.next({...this.filters});
  }

  refreshDashboard(): void {
    this.refreshChanges.next({...this.filters});
    this.loadAgenda();
  }

  setRelationFilter(filter: 'bancoId' | 'contaBancariaId' | 'caixaId' | 'centroCustoId' | 'planoContaId', value: any): void {
    this.filters[filter] = value?.id ?? value?.hash ?? '';
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedBank = this.selectedBankAccount = this.selectedCash = this.selectedCostCenter = this.selectedPlanAccount = null;
    this.filters = this.defaultFilters();
    this.applyFilters();
  }

  money(value: number | null | undefined): string {
    return this.currency.format(value ?? 0);
  }

  variation(value: number | null): string {
    return value === null ? 'Sem base anterior' : `${value >= 0 ? '+' : ''}${this.percent.format(value)}%`;
  }

  variationClass(value: number | null): string {
    return value === null ? 'neutral' : value >= 0 ? 'positive' : 'negative';
  }

  maxEvolution(): number {
    return Math.max(1, ...(this.financial?.evolucao.flatMap(item => this.evolutionValues(item)) ?? [1]));
  }

  barWidth(value: number, max = this.maxEvolution()): number {
    return Math.max(value > 0 ? 2 : 0, Math.abs(value) * 100 / Math.max(max, 1));
  }

  evolutionValues(item: EvolutionPoint): number[] {
    if (this.evolutionMode === 'REALIZED') return [item.receitas, item.despesas];
    if (this.evolutionMode === 'PLANNED') return [item.receitasPrevistas, item.despesasPrevistas];
    return [item.receitas, item.receitasPrevistas, item.despesas, item.despesasPrevistas];
  }

  evolutionTooltip(item: EvolutionPoint, type: 'REVENUE' | 'EXPENSE'): string {
    const period = this.evolutionPeriodLabel(item.periodo);
    if (type === 'REVENUE') {
      return `${period}\nReceita realizada: ${this.money(item.receitas)}\nReceita prevista: ${this.money(item.receitasPrevistas)}`;
    }
    return `${period}\nDespesa realizada: ${this.money(item.despesas)}\nDespesa prevista: ${this.money(item.despesasPrevistas)}`;
  }

  evolutionPeriodLabel(period: string): string {
    const match = /^(\d{4})-(\d{2})$/.exec(period);
    if (!match) return period;

    const month = Number(match[2]);
    if (month < 1 || month > 12) return period;

    const label = new Intl.DateTimeFormat('pt-BR', {month: 'long', timeZone: 'UTC'})
      .format(new Date(Date.UTC(Number(match[1]), month - 1, 1)));
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  groupWidth(item: GroupExpense): number {
    return Math.max(item.valorTotal > 0 ? 2 : 0, item.percentual);
  }

  goTransactions(): void {
    this.router.navigate(['/home/transactions']);
  }

  goAgenda(): void {
    this.router.navigate(['/home/scheduler']);
  }

  createAppointment(): void {
    this.router.navigate(['/home/scheduler'], {queryParams: {novo: 1}});
  }

  private loadAgenda(): void {
    this.loadingAgenda = true;
    this.dashboardService.agenda().pipe(finalize(() => this.loadingAgenda = false), takeUntil(this.destroy$)).subscribe({
      next: response => this.agenda = response.data,
      error: () => this.agendaError = 'Não foi possível carregar a agenda.'
    });
  }

  private defaultFilters(): DashboardFilters {
    const today = new Date();
    return {
      dataInicial: new Date(today.getFullYear(), today.getMonth(), 1), dataFinal: today,
      bancoId: '', contaBancariaId: '', caixaId: '', somenteCaixasAbertos: false, centroCustoId: '', planoContaId: ''
    };
  }
}
