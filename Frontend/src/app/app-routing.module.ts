import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterUserComponent } from './register-user/register-user.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { ManageCompteComponent } from './manage-compte/manage-compte.component';
import { ConsulterCompteComponent } from './consulter-compte/consulter-compte.component';

import { DoctorProfilComponent } from './doctor-profil/doctor-profil.component';

import { ConsultercalendarComponent } from './consultercalendar/consultercalendar.component';
import { ConsulterUserComponent } from './consulter-user/consulter-user.component';
import { ModifierUserComponent } from './modifier-user/modifier-user.component';


const routes: Routes = [
  {path : 'registerUser', component:RegisterUserComponent},
  {path : 'login',component:LoginComponent},
  {path : '', component:HomeComponent},
  {path : 'appointment',component:AppointmentComponent},
  {path : 'managecompte',component:ManageCompteComponent},
  {path : 'consulter',component:ConsulterCompteComponent},
  {path : 'pills_modifier',component:ManageCompteComponent},
  {path : 'pills_consulter',component:ConsulterCompteComponent},
  { path: 'doctor/:id', component: DoctorProfilComponent },
  {path : 'consulterCalendar',component:ConsultercalendarComponent},
  {path : 'consulterUser',component:ConsulterUserComponent},
  {path : 'modifierUser',component:ModifierUserComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
