import { Component } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private userService: AuthentificationService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  loginUser() {
    this.userService.loginUser(this.email, this.password).subscribe(
      (response) => {
           // Log response
           console.log('API Response:', response);
           console.log('Prenom:', response.prenom);
          console.log('Nom:', response.nom)
          const prenom = response.prenom || 'Utilisateur';
          const nom = response.nom || '';
          const userName = `${prenom} ${nom}`.trim();
          
          console.log('Resolved Username:', userName);
          const token = response.token;  // Ensure token is extracted
            const role = response.role; 
          if (token) {
            // Set cookies securely
            const cookieExpirationDays = 7;
            this.cookieService.set('token', token, cookieExpirationDays, '/', '', true, 'Strict');
            this.cookieService.set('role', role, cookieExpirationDays, '/', '', true, 'Strict');
            this.cookieService.set('userName', userName, cookieExpirationDays, '/', '', true, 'Strict');
            this.userService.setUserName(userName);
            alert("Bienvenue " + userName);  // Display user name

            if (this.userService.isTokenValid(token)) {
                console.log('Redirecting to home page...');  // Log before navigation
                this.router.navigate(['/']);  // Redirect to home page
            } else {
                alert("Token invalide, veuillez réessayer.");
            }
        } else {
            alert("Token manquant dans la réponse.");
        }
    },
    (error) => {
        console.error('Login Error:', error);  // Handle errors
    }

    );      
  }
  
}
