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

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'customer-requirements', component: CustomerRequirementsComponent },
  { path: 'customer-requirements/:id', component: CustomerRequirementsComponent },
  { path: 'seminar-registration', component: SeminarRegistrationComponent },
  { path: 'seminar-registration/:id', component: SeminarRegistrationComponent },
  { path: 'mainList', component: MainListComponent },
  { path: 'create-technologist', component: CreateTechnologistComponent },
  { path: 'visitorRegistration', component: VisitorRegistrationComponent },
  { path: 'app-abschluss-bericht-list', component: AbschlussBerichtListComponent },
  { path: 'create-dealer', component: CreateDealerComponent },
  { path: 'create-representative', component: CreateRepresentativeComponent },
  { path: 'ab', component: AbschlussBerichtComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
