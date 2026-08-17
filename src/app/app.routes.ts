import { Routes } from '@angular/router';
import { LoginComponent } from './security/login/login.component';
import { publicGuard } from './security/guards/public.guard';
import { HomeComponent } from './pages/home/home.component';
import { privateGuard } from './security/guards/private.guard';
import { SignupComponent } from './security/signup/signup.component';
import { RegisterChurchComponent } from './pages/register-church/register-church.component';
import { DashComponent } from './pages/dash/dash.component';
import { RegisterComponent } from './pages/register/register.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { PagePlanAccountComponent } from './pages/page-plan-account/page-plan-account.component';
import { CostCenterComponent } from './pages/cost-center/cost-center.component';
import { SchedulerComponent } from './pages/scheduler/scheduler.component';
import { UserConfigurationComponent } from './pages/user-configuration/user-configuration.component';
import { MemberFunctionComponent } from './components/member-function/member-function.component';
import {ChurchConfigurationComponent} from './pages/church-configuration/church-configuration.component';
import {CashApprovalsComponent} from './pages/cash-approvals/cash-approvals.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { BankStatementComponent } from './pages/bank-statement/bank-statement.component';
import { CashHistoryComponent } from './pages/cash-history/cash-history.component';
import { PersonComponent } from './components/person/person.component';
import { FinancialComponent } from './components/financial/financial.component';
import { CashTransactionComponent } from './components/cash-transaction/cash-transaction.component';
import { BankComponent } from './components/bank/bank.component';
import { CashComponent } from './components/cash/cash.component';
import { PlanAccountComponent } from './components/plan-account/plan-account.component';
import { CostCenterModalComponent } from './components/cost-center-modal/cost-center-modal.component';
import { PositionsComponent } from './components/positions/positions.component';
import { EventsTypeComponent } from './components/events-type/events-type.component';
import { UserAdminComponent } from './components/user-admin/user-admin.component';
import { TenantSelectionComponent } from './security/tenant-selection/tenant-selection.component';
import { TranslationsComponent } from './pages/translations/translations.component';
import { CellComponent } from './components/cell/cell.component';
import { CellsFoundationComponent } from './pages/cells-foundation/cells-foundation.component';
import { CellsOperationsComponent } from './pages/cells-operations/cells-operations.component';
import { PermissionGroupsComponent } from './pages/permission-groups/permission-groups.component';
import { ReportTemplateComponent } from './pages/report-template/report-template.component';
import { RecurringFinancialComponent } from './pages/recurring-financial/recurring-financial.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
    canActivate: [publicGuard],
  },
  {
    path: 'select-tenant',
    component: TenantSelectionComponent,
    pathMatch: 'full',
    canActivate: [publicGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full',
    canActivate: [publicGuard],
  },
  {
    path: 'register-church/:hash',
    component: RegisterChurchComponent,
    pathMatch: 'full',
    canActivate: [publicGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivateChild: [privateGuard],
    children: [
      { path: 'dashboard', component: DashComponent },
      { path: 'scheduler', component: SchedulerComponent },
      { path: 'user-configuration', component: UserConfigurationComponent },
      { path: 'translations', component: TranslationsComponent },
      { path: 'permission-groups', component: PermissionGroupsComponent },
            { path: 'report-template', component: ReportTemplateComponent },
            { path: 'church-configuration', component: ChurchConfigurationComponent },
      { path: 'cash-approvals', component: CashApprovalsComponent },
      {
        path: 'cells/organization',
        component: CellsFoundationComponent,
        data: { mode: 'organization' },
      },
      {
        path: 'cells/team',
        component: CellsFoundationComponent,
        data: { mode: 'team' },
      },
      {
        path: 'cells/settings',
        component: CellsFoundationComponent,
        data: { mode: 'settings' },
      },
      {
        path: 'cells/meetings',
        component: CellsOperationsComponent,
        data: { mode: 'meetings' },
      },
      {
        path: 'cells/visitors',
        component: CellsOperationsComponent,
        data: { mode: 'visitors' },
      },
      {
        path: 'transactions/open',
        component: CashTransactionComponent,
        data: { action: 0 },
      },
      {
        path: 'transactions/close',
        component: CashTransactionComponent,
        data: { action: 1 },
      },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'cash-history', component: CashHistoryComponent },
      { path: 'bank-statament', component: BankStatementComponent },
      {
        path: 'register/revenues/new',
        component: FinancialComponent,
        data: { context: 'revenues' },
      },
      {
        path: 'register/revenues/:id',
        component: FinancialComponent,
        data: { context: 'revenues' },
      },
      {
        path: 'register/expenses/new',
        component: FinancialComponent,
        data: { context: 'expenses' },
      },
      {
        path: 'register/expenses/:id',
        component: FinancialComponent,
        data: { context: 'expenses' },
      },
      { path: 'register/recurringFinancial/new', component: RecurringFinancialComponent },
      { path: 'register/recurringFinancial/:id', component: RecurringFinancialComponent },
      { path: 'register/bank/new', component: BankComponent },
      { path: 'register/bank/:id', component: BankComponent },
      { path: 'register/cash/new', component: CashComponent },
      { path: 'register/cash/:id', component: CashComponent },
      { path: 'register/positions/new', component: PositionsComponent },
      { path: 'register/positions/:id', component: PositionsComponent },
      {
        path: 'register/memberFunctions/new',
        component: MemberFunctionComponent,
      },
      {
        path: 'register/memberFunctions/:id',
        component: MemberFunctionComponent,
      },
      { path: 'register/users/new', component: UserAdminComponent },
      { path: 'register/users/:id', component: UserAdminComponent },
      { path: 'register/eventsType/new', component: EventsTypeComponent },
      { path: 'register/eventsType/:id', component: EventsTypeComponent },
      { path: 'register/cells/new', component: CellComponent },
      { path: 'register/cells/:id', component: CellComponent },
      { path: 'register/:hash/new', component: PersonComponent },
      { path: 'register/:hash/:id', component: PersonComponent },
      { path: 'register/:hash', component: RegisterComponent },
      { path: 'planAccount/new', component: PlanAccountComponent },
      { path: 'planAccount/:id', component: PlanAccountComponent },
      { path: 'planAccount', component: PagePlanAccountComponent },
      { path: 'costCenter/new', component: CostCenterModalComponent },
      { path: 'costCenter/:id', component: CostCenterModalComponent },
      { path: 'costCenter', component: CostCenterComponent },
      { path: 'notification', component: NotificationComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
