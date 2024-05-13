import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerRequirementsComponent } from './components/contents/customer-requirements/customer-requirements.component';
import { TravelreportComponent } from './components/contents/travelreport/travelreport.component';
import { SeminarRegistrationComponent } from './components/contents/seminar-registration/seminar-registration.component';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'customer-requirements', component: CustomerRequirementsComponent},
  {path: 'travelreport', component: TravelreportComponent},
  {path: 'seminar-registration', component: SeminarRegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
