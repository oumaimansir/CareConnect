import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  userName: string ='';
nom:string='';
specialite:string='';
localisation:string='';
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
    this.userService.getDocteurs(this.nom, this.specialite, this.localisation).subscribe(
      (data: any[]) => {
        if (data.length === 0) {
          alert('Aucun docteur trouvé avec ces critères.');
        } else {
          this.doctors = data;
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des docteurs', error);

        switch (error.status) {
          case 400:
            alert('Veuillez fournir au moins un critère de recherche.');
            break;
          case 404:
            alert('Aucun docteur trouvé avec ces critères.');
            break;
          case 500:
            alert('Erreur serveur. Veuillez réessayer plus tard.');
            break;
          default:
            alert('Une erreur inattendue est survenue.');
        }
      }
    );
  }

}
