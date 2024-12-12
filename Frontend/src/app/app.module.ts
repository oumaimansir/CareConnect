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
    DoctorProfilComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule 
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
