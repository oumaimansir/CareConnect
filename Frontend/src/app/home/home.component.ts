import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';

import { Router } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

 /* userName: string = '';
  doctors: any[] = [];

  constructor(
    private userService: AuthentificationService,
    private router: Router  // Inject Router service
  ) {}

  ngOnInit(): void {
    this.userService.userName$.subscribe((name) => {
      this.userName = name || 'Utilisateur';
    });

    this.searchDoctors();  // Fetch doctors when the component loads
  }

  searchDoctors(): void {
    this.userService.getDocteurs().subscribe(
      (data: any[]) => {
        this.doctors = data;
        console.log(data);
      },
      (error) => {
        console.error('Error while fetching doctors', error);*/

  userName: string ='';
  email: string='';
  role: string='';
nom:string='';
specialite:string='';
localisation:string='';
  ngOnInit() {
    this.userName=this.cookieService.get('userName');
    this.role=this.cookieService.get('role');
    /*
    this.userService.userName$.subscribe((name) => {
      this.userName = name || 'Utilisateur';
  });

  this.userService.email$.subscribe((email)=> {
this.email=email || '';
console.log('email: ',this.email);
  });

  this.userService.role$.subscribe((role)=> {
    this.role=role || '';
      })*/

  }
  doctorName: string = '';
  specialty: string = '0'; // Default value for 'Sélectionner spécialité'
  doctors: any[] = [];
  filteredDoctors: any[] = [];

  constructor(private userService: AuthentificationService,
    private cookieService:CookieService,
    private router:Router
  ) {
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


  // Navigate to the doctor's profile page when clicked
 /* viewDoctorProfile(doctorId: string): void {
    console.log('Navigating to doctor profile with ID:', doctorId);  // Check if this logs correctly
   // this.router.navigate([`/doctor/${doctorId}`]);  // Ensure correct path
  }*/

  logout() {
    this.cookieService.delete('token'); // Supprime le token du cookie
    this.cookieService.delete('email'); // Supprime l'email si présent
    this.cookieService.delete('userName'); // Supprime username si présent
    this.cookieService.delete('role'); // Supprime role si présent
    // Redirection vers la page de connexion
    this.router.navigate(['/login']);
  }

}
