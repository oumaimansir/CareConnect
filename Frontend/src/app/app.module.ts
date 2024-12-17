import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppointmentComponent } from './appointment/appointment.component';
import { ManageCompteComponent } from './manage-compte/manage-compte.component';
import { ConsulterCompteComponent } from './consulter-compte/consulter-compte.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

import { DoctorProfilComponent } from './doctor-profil/doctor-profil.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ConsultercalendarComponent } from './consultercalendar/consultercalendar.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ConsulterUserComponent } from './consulter-user/consulter-user.component';
import { ModifierUserComponent } from './modifier-user/modifier-user.component';
import { SideMenuUserComponent } from './side-menu-user/side-menu-user.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterUserComponent,
    HomeComponent,
    LoginComponent,
    AppointmentComponent,
    ManageCompteComponent,
    ConsulterCompteComponent,
    SideMenuComponent,
    DoctorProfilComponent,
    ConsultercalendarComponent,
    ConsulterUserComponent,
    ModifierUserComponent,
    SideMenuUserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule ,
    NgbModalModule,
    BrowserAnimationsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })

  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
