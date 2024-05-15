import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BodyComponent } from './components/body/body.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SublevelMenuComponent } from './components/sidenav/sublevel-menu.component';

import {MatButtonToggleModule} from '@angular/material/button-toggle'; 
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

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { CustomerRequirementsComponent } from './components/contents/customer-requirements/customer-requirements.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { de_DE } from 'ng-zorro-antd/i18n';
import de from '@angular/common/locales/de';
import { MatOptionModule } from '@angular/material/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { SeminarRegistrationComponent } from './components/contents/seminar-registration/seminar-registration.component';
import { CalendarComponent } from './components/contents/calendar/calendar.component';

registerLocaleData(de);

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    SublevelMenuComponent,
    DashboardComponent,
    CustomerRequirementsComponent,
    SeminarRegistrationComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    ScrollingModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzPopconfirmModule,
    FormsModule,
    CommonModule,
    MatOptionModule,
    NzEmptyModule,
    MatButtonToggleModule,
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: NZ_I18N, useValue: de_DE },
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }