import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterUserComponent } from './register-user/register-user.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { ManageCompteComponent } from './manage-compte/manage-compte.component';
import { ConsulterCompteComponent } from './consulter-compte/consulter-compte.component';
import { ConsultercalendarComponent } from './consultercalendar/consultercalendar.component';

const routes: Routes = [
  {path : 'registerUser', component:RegisterUserComponent},
  {path : 'login',component:LoginComponent},
  {path : '', component:HomeComponent},
  {path : 'appointment',component:AppointmentComponent},
  {path : 'managecompte',component:ManageCompteComponent},
  {path : 'consulter',component:ConsulterCompteComponent},
  {path : 'pills_modifier',component:ManageCompteComponent},
  {path : 'pills_consulter',component:ConsulterCompteComponent},
  {path : 'consulterCalendar',component:ConsultercalendarComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
