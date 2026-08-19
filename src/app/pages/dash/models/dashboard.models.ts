export interface DashboardIndicator {
  valorTotal: number;
  valorPeriodoAnterior: number;
  percentualVariacao: number | null;
}

export interface DashboardResult {
  valorResultado: number;
  situacao: 'POSITIVO' | 'NEGATIVO' | 'ZERADO';
}

export interface DashboardAvailableBalance {
  saldoTotal: number;
  saldoContasBancarias: number;
  saldoCaixas: number;
  quantidadeContasBancarias: number;
  quantidadeCaixas: number;
}

export interface DashboardSummary {
  receitasPeriodo: DashboardIndicator;
  despesasPeriodo: DashboardIndicator;
  resultadoPeriodo: DashboardResult;
  saldoDisponivel: DashboardAvailableBalance;
}

export interface EvolutionPoint {
  periodo: string;
  receitas: number;
  despesas: number;
  receitasPrevistas: number;
  despesasPrevistas: number;
  resultado: number;
}

export interface GroupExpense {
  valorTotal: number;
  percentual: number;
  descricao: string;
}

export interface CostCenterExpense extends GroupExpense {
  centroCustoId: string | null;
}

export interface PlanAccountExpense extends GroupExpense {
  planoContaId: string | null;
  codigo: string;
  nivel: number;
  paiId: string | null;
}

export interface BankBalance {
  contaBancariaId: string;
  bancoId: string | null;
  banco: string;
  descricao: string;
  agencia: string | null;
  numeroConta: string | null;
  saldoAtual: number;
}

export interface CashBalance {
  caixaId: string;
  descricao: string;
  situacao: string;
  saldoAtual: number;
  dataAbertura: string | null;
  responsavel: string | null;
}

export interface Balances {
  saldoTotal: number;
  saldoContasBancarias: number;
  saldoCaixas: number;
  contasBancarias: BankBalance[];
  caixas: CashBalance[];
}

export interface RecentTransaction {
  id: string;
  data: string;
  descricao: string;
  tipo: string;
  planoConta: string;
  centroCusto: string;
  origem: string;
  origemTipo: string;
  valor: number;
  situacao: string;
}

export interface FinancialAlert {
  tipo: string;
  severidade: string;
  descricao: string;
  quantidade: number;
  referenciaId: string | null;
}

export interface FilterOption {
  id: string;
  descricao: string;
}

export interface DashboardFilterOptions {
  bancos: FilterOption[];
  contasBancarias: FilterOption[];
  caixas: FilterOption[];
  centrosCusto: FilterOption[];
  planosConta: FilterOption[];
}

export interface FinancialSnapshot {
  resumo: DashboardSummary;
  evolucao: EvolutionPoint[];
  despesasPorCentroCusto: CostCenterExpense[];
  despesasPorPlanoConta: PlanAccountExpense[];
  saldos: Balances;
  movimentacoesRecentes: RecentTransaction[];
  alertas: FinancialAlert[];
  filtros: DashboardFilterOptions;
}

export interface AgendaItem {
  id: string;
  titulo: string;
  tipoEvento: string;
  dataInicio: string;
  dataFim: string;
  local: string | null;
  responsavel: string | null;
  situacao: string;
}

export interface AgendaSnapshot {
  agendaHoje: AgendaItem[];
  proximosEventos: AgendaItem[];
  resumo: { quantidadeHoje: number; quantidadeSemana: number; quantidadeMes: number; };
}

export interface DashboardFinancialResponse {
  data: FinancialSnapshot;
}

export interface DashboardAgendaResponse {
  data: AgendaSnapshot;
}

export interface DashboardFilters {
  dataInicial: Date;
  dataFinal: Date;
  bancoId: string;
  contaBancariaId: string;
  caixaId: string;
  somenteCaixasAbertos: boolean;
  centroCustoId: string;
  planoContaId: string;
}
