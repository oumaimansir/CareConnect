import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent implements OnInit{
  userName: string ='';

  constructor(private userService: AuthentificationService) {}

  ngOnInit() {
    this.userService.userName$.subscribe((name) => {
      this.userName = name || 'Utilisateur';
  })
  
  }
}
