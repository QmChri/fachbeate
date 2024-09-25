import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BodyComponent } from './components/body/body.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SublevelMenuComponent } from './components/sidenav/sublevel-menu.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTabsModule } from '@angular/material/tabs'
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NzTableFilterComponent, NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { CustomerRequirementsComponent } from './components/contents/customer-requirements/customer-requirements.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { de_DE } from 'ng-zorro-antd/i18n';
import de from '@angular/common/locales/de';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SeminarRegistrationComponent } from './components/contents/seminar-registration/seminar-registration.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MainListComponent } from './components/main-list/main-list.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CreateTechnologistComponent } from './components/contents/creation-sites/create-technologist/create-technologist.component';
import { VisitorRegistrationComponent } from './components/contents/visitor-registration/visitor-registration.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AbschlussBerichtComponent } from './components/contents/abschluss-bericht/abschluss-bericht.component';
import { NewDateEntryComponent } from './components/contents/new-date-entry/new-date-entry.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatMenuModule } from '@angular/material/menu';
import { AbschlussBerichtListComponent } from './components/contents/abschluss-bericht-list/abschluss-bericht-list.component';
import { TeilnehmerListeComponent } from './components/contents/teilnehmer-liste/teilnehmer-liste.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CreateRepresentativeComponent } from './components/contents/creation-sites/create-representative/create-representative.component';
import { CreateDealerComponent } from './components/contents/creation-sites/create-dealer/create-dealer.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializer } from './initializer.service';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { BookingRequestComponent } from './components/contents/booking-request/booking-request.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CheckDialogComponent } from './components/contents/check-dialog/check-dialog.component';
import { BugReportComponent } from './components/contents/bug-report/bug-report.component';
import { MatDivider } from '@angular/material/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { SubGroupsComponent } from './components/contents/creation-sites/sub-groups/sub-groups.component';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { UtcDateInterceptorComponent } from './components/utc-date-interceptor/utc-date-interceptor.component';
import { CreatMailUserComponent } from './components/contents/creation-sites/creation-user/creation-user.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    SublevelMenuComponent,
    CalendarComponent,
    CustomerRequirementsComponent,
    SeminarRegistrationComponent,
    MainListComponent,
    CreateTechnologistComponent,
    VisitorRegistrationComponent,
    AbschlussBerichtComponent,
    NewDateEntryComponent,
    AbschlussBerichtListComponent,
    TeilnehmerListeComponent,
    CreateRepresentativeComponent,
    CreateDealerComponent,
    BookingRequestComponent,
    CalendarComponent,
    CheckDialogComponent,
    BugReportComponent,
    SubGroupsComponent,
    CreatMailUserComponent,
  ],
  imports: [
    NzModalModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ScrollingModule,
    DragDropModule,
    MatTooltipModule,
    NzAlertModule,
    MatDivider,
    MatMenuModule,
    NzNotificationModule,
    MatDatepickerModule,
    MatDialogTitle,
    NzDatePickerModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose, NzColorPickerModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    NzSelectModule,
    MatInputModule,
    NzUploadModule,
    MatExpansionModule,
    ScrollingModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle, MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzDropDownModule,
    CommonModule,
    MatOptionModule,
    NzEmptyModule,
    NzProgressModule,
    NzUploadModule,
    MatButtonToggleModule,
    FullCalendarModule,
    MatIconModule,
    KeycloakAngularModule,
    NzTreeModule,
    NzTreeViewModule,
    NzTreeSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }
    )
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    provideNativeDateAdapter(),
    provideAnimationsAsync(),
    { provide: NZ_I18N, useValue: de_DE },
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [KeycloakService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UtcDateInterceptorComponent,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

registerLocaleData(de);
