import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { RendezvousService } from '../services/rendezvous.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent implements OnInit{
  userName: string ='';
  datechoisi:Date=new Date();
  availableSlots: string[] = [];
  selectedTime: string = '';
  constructor(private userService: AuthentificationService,private rdvService:RendezvousService ) {}

  ngOnInit() {
    this.userService.userName$.subscribe((name) => {
      this.userName = name || 'Utilisateur';
  })

  }
  choisirDate(){
    console.log("date envoyé : ",this.datechoisi);
  const  doctId= "674c39fa8e0f8ad4c6781a13";
    this.rdvService.getTimeByDate(this.datechoisi,doctId).subscribe((data) => {
     // this.userName = name || 'Utilisateur';
     console.log("liste de temps reçu ",data);
     this.availableSlots=data.availableSlots;
  })
  }
}
