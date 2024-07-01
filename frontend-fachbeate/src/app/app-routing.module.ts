import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerRequirementsComponent } from './components/contents/customer-requirements/customer-requirements.component';
import { SeminarRegistrationComponent } from './components/contents/seminar-registration/seminar-registration.component';
import { MainListComponent } from './components/main-list/main-list.component';
import { CreateTechnologistComponent } from './components/contents/creation-sites/create-technologist/create-technologist.component';
import { VisitorRegistrationComponent } from './components/contents/visitor-registration/visitor-registration.component';
import { AbschlussBerichtComponent } from './components/contents/abschluss-bericht/abschluss-bericht.component';
import { AbschlussBerichtListComponent } from './components/contents/abschluss-bericht-list/abschluss-bericht-list.component';
import { CreateDealerComponent } from './components/contents/creation-sites/create-dealer/create-dealer.component';
import { CreateRepresentativeComponent } from './components/contents/creation-sites/create-representative/create-representative.component';
import { authGuard } from './services/auth.service';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 4, 5, 7] } },
  { path: 'customer-requirements', component: CustomerRequirementsComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 4, 6, 7] } },
  { path: 'customer-requirements/:id', component: CustomerRequirementsComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 4, 6, 7] } },
  { path: 'seminar-registration', component: SeminarRegistrationComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 5, 6, 7] } },
  { path: 'seminar-registration/:id', component: SeminarRegistrationComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 5, 6, 7] } },
  { path: 'create-technologist', component: CreateTechnologistComponent, canActivate: [authGuard], data: { requiredRoles: [1, 7] } },
  { path: 'visitorRegistration', component: VisitorRegistrationComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 5, 6, 7] } },
  { path: 'visitorRegistration/:id', component: VisitorRegistrationComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 5, 6, 7] } },
  { path: 'app-abschluss-bericht-list', component: AbschlussBerichtListComponent, canActivate: [authGuard], data: { requiredRoles: [1,2,3,4,6,7] } },
  { path: 'create-dealer', component: CreateDealerComponent, canActivate: [authGuard], data: { requiredRoles: [1, 7] } },
  { path: 'create-representative', component: CreateRepresentativeComponent, canActivate: [authGuard], data: { requiredRoles: [1, 7] } },
  { path: 'ab', component: AbschlussBerichtComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 7] } },
  { path: 'mainList', component: MainListComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 4, 5, 6, 7] } },
  { path: '**', redirectTo: 'mainList', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
