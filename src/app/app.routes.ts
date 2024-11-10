import { Routes } from '@angular/router';
import { LoginComponent } from './security/login/login.component';
import { publicGuard } from './security/guards/public.guard';
import { HomeComponent } from './pages/home/home.component';
import { privateGuard } from './security/guards/private.guard';
import { SignupComponent } from './security/signup/signup.component';
import { RegisterChurchComponent } from './pages/register-church/register-church.component';
import { DashComponent } from './pages/dash/dash.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    
    { path: "login", component: LoginComponent, pathMatch: "full", canActivate: [publicGuard] },
    { path: "singup", component: SignupComponent, pathMatch: "full", canActivate: [publicGuard] },
    { path: "register-church/:hash", component: RegisterChurchComponent, pathMatch: "full", canActivate: [publicGuard] },
    {
        path: "home",
        component: HomeComponent,
        canActivateChild: [privateGuard],
        children: [
            
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
            { path: 'dashboard', component: DashComponent },
            { path: 'register', component: RegisterComponent },
        ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
