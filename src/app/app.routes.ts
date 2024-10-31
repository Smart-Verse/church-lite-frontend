import { Routes } from '@angular/router';
import { LoginComponent } from './security/login/login.component';
import { publicGuard } from './security/guards/public.guard';
import { HomeComponent } from './pages/home/home.component';
import { privateGuard } from './security/guards/private.guard';

export const routes: Routes = [
    
    { path: "login", component: LoginComponent, pathMatch: "full", canActivate: [publicGuard] },
    {
        path: "home",
        component: HomeComponent,
        canActivateChild: [privateGuard],
        children: [
            
            // { path: 'dashboard', component: DashboardComponent },
            // { path: 'my-pets', component: MyPetsComponent },
            // { path: 'profile', component: ProfileComponent },
            // { path: 'timeline/:id', component: TimelineComponent },
            // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
