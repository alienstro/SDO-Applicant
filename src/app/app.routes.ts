import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApplicationFormComponent } from './components/application-form/application-form.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './service/guards/auth.guard';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: LayoutComponent, children: [
        { path: '', redirectTo: '/login', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent},
        { path: 'application', component: ApplicationFormComponent},
        { path: '**', redirectTo: '/login' },
    ], canActivate: [AuthGuard]}
];
