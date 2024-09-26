import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
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
import { BookingRequestComponent } from './components/contents/booking-request/booking-request.component';
import { BugReportComponent } from './components/contents/bug-report/bug-report.component';
import { SubGroupsComponent } from './components/contents/creation-sites/sub-groups/sub-groups.component';
import { CreatMailUserComponent } from './components/contents/creation-sites/creation-user/creation-user.component';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  // path: (e.g. "http://.../dashboard",) the authGuard checks the roles that are specified in the data
  //{ path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 4, 5, 7] } },
  { path: 'calendar', component: CalendarComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 4, 5, 7] } },
  { path: 'test', component: TestComponent, canActivate: [authGuard], data: { requiredRoles: [7]}},
  { path: 'customer-requirements', component: CustomerRequirementsComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 4, 6, 7] } },
  { path: 'customer-requirements/:id', component: CustomerRequirementsComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 4, 5, 6, 7] } },
  { path: 'seminar-registration', component: SeminarRegistrationComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 5, 6, 7] } },
  { path: 'seminar-registration/:id', component: SeminarRegistrationComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 5, 6, 7] } },
  { path: 'create-technologist', component: CreateTechnologistComponent, canActivate: [authGuard], data: { requiredRoles: [1, 7] } },
  { path: 'create-new-group', component: SubGroupsComponent, canActivate: [authGuard], data: { requiredRoles: [1, 7] } },
  { path: 'create-new-other-user', component: CreatMailUserComponent, canActivate: [authGuard], data: { requiredRoles: [1, 7] } },
  { path: 'visitor-registration', component: VisitorRegistrationComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 5, 6, 7] } },
  { path: 'visitor-registration/:id', component: VisitorRegistrationComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 5, 6, 7] } },
  { path: 'abschluss-bericht-list', component: AbschlussBerichtListComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 4, 7] } },
  { path: 'create-dealer', component: CreateDealerComponent, canActivate: [authGuard], data: { requiredRoles: [1, 7] } },
  { path: 'create-representative', component: CreateRepresentativeComponent, canActivate: [authGuard], data: { requiredRoles: [1, 7] } },
  { path: 'ab', component: AbschlussBerichtComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 7] } },
  //TODO Berechtigungen für Buchungsanforderungen
  { path: 'booking-request', component: BookingRequestComponent, canActivate: [authGuard], data: { requiredRoles: [1, 7] } },
  { path: 'booking-request/:id', component: BookingRequestComponent, canActivate: [authGuard], data: { requiredRoles: [1, 7] } },
  { path: 'mainList', component: MainListComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 4, 5, 6, 7] } },
  { path: 'bug-report', component: BugReportComponent, canActivate: [authGuard], data: { requiredRoles: [1, 2, 3, 4, 5, 6, 7] } },
  { path: '**', redirectTo: 'mainList', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
