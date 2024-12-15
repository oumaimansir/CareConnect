import { Component } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  compte: any = {};
  constructor(private userService: AuthentificationService, private router: Router) {}

  register() {
    const userData = {
      nom: this.compte.nom,
      prenom: this.compte.prenom,
      numtel: this.compte.numtel,
      email: this.compte.email,
      password: this.compte.password,
      adresse: this.compte.adresse,
      datenaissance: this.compte.datenaissance,
      etat: this.compte.etat
    };

    this.userService.registerUser(userData).subscribe(
      (response) => {
        console.log(response);
        alert('Inscription réussie:');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Erreur lors de l\'inscription:', error);
        // Affichez un message d'erreur à l'utilisateur si besoin
      }
    );
  }

}

