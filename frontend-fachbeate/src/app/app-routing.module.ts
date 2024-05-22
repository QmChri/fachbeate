import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerRequirementsComponent } from './components/contents/customer-requirements/customer-requirements.component';
import { SeminarRegistrationComponent } from './components/contents/seminar-registration/seminar-registration.component';
import { MainListComponent } from './components/main-list/main-list.component';
import { CreateTechnologistComponent } from './components/contents/create-technologist/create-technologist.component';
import { VisitorRegistrationComponent } from './components/contents/visitor-registration/visitor-registration.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'customer-requirements', component: CustomerRequirementsComponent },
  { path: 'customer-requirements/:id', component: CustomerRequirementsComponent },
  { path: 'seminar-registration', component: SeminarRegistrationComponent },
  { path: 'mainList', component: MainListComponent },
  { path: 'create-technologist', component: CreateTechnologistComponent },
  { path: 'visitorRegistration', component:  VisitorRegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
