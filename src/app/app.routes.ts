import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApplicationFormComponent } from './components/application-form/application-form.component';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
    {path: '', component: LayoutComponent, children: [
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'application', component: ApplicationFormComponent},
    ]},
    {path: 'login', component: LoginComponent},
];
