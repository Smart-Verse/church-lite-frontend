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
import {PagePlanAccountComponent} from "./pages/page-plan-account/page-plan-account.component";
import {CostCenterComponent} from "./pages/cost-center/cost-center.component";
import {SchedulerComponent} from "./pages/scheduler/scheduler.component";
import {UserConfigurationComponent} from "./pages/user-configuration/user-configuration.component";
import {TransactionsComponent} from "./pages/transactions/transactions.component";

export const routes: Routes = [

    { path: "login", component: LoginComponent, pathMatch: "full", canActivate: [publicGuard] },
    { path: "singup", component: SignupComponent, pathMatch: "full", canActivate: [publicGuard] },
    { path: "register-church/:hash", component: RegisterChurchComponent, pathMatch: "full", canActivate: [publicGuard] },
    {
        path: "home",
        component: HomeComponent,
        canActivateChild: [privateGuard],
        children: [
            { path: 'dashboard', component: DashComponent },
            { path: 'scheduler', component: SchedulerComponent },
            { path: 'user-configuration', component: UserConfigurationComponent },
            { path: 'transactions', component: TransactionsComponent },
            { path: 'register/:hash', component: RegisterComponent },
            { path: 'planAccount', component: PagePlanAccountComponent },
            { path: 'costCenter', component: CostCenterComponent },
            { path: 'notification', component: NotificationComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
