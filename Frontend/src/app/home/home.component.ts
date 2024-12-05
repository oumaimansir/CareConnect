import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  userName: string ='';

  ngOnInit() {
    this.userService.userName$.subscribe((name) => {
      this.userName = name || 'Utilisateur';
  })
  
  }
  doctorName: string = '';
  specialty: string = '0'; // Default value for 'Sélectionner spécialité'
  doctors: any[] = [];
  filteredDoctors: any[] = [];

  constructor(private userService: AuthentificationService) {
    this.filteredDoctors = this.doctors; // Initialisation avec tous les médecins
  }

  searchDoctors(): void {
    this.userService.getDocteurs().subscribe(
      (data: any[]) => {
        this.doctors = data; // Stocke les utilisateurs récupérés
        console.log(data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }
}
