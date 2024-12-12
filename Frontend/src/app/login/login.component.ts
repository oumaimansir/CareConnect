import { Component } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Compte } from '../models/compte.model';
import { response } from 'express';
import { CompteService } from '../services/compte.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  comptes:Compte[]=[];
  
  constructor(private compteService: CompteService,
    private userService: AuthentificationService,
    private router: Router,
    private cookieService: CookieService
  ) { }
  getUser() {
    this.userService.getUserByEmail(this.email).subscribe(
      (response) => {
        console.log('Data test:', response);
        if (response && response.token) {
          // Store token in localStorage
          console.log('Token before setting:', response.token);
          localStorage.setItem('token', response.token);
          console.log('Token in Local Storage:', localStorage.getItem('token'));

          // Store user data in localStorage
          localStorage.setItem('userdata', JSON.stringify(response));
          console.log('User data in Local Storage:', localStorage.getItem('userdata'));

          // Optionally, handle accounts if needed
          this.comptes = JSON.parse(localStorage.getItem('userdata') || '{}');
        } else {
          console.error('No token in response:', response);
        }
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  // Method to log in the user
  loginUser() {
    this.userService.loginUser(this.email, this.password).subscribe(
      (response) => {
        console.log('Full API Response:', response); // Check the response

        if (response && response.token) {
          // Store the token in localStorage
          localStorage.setItem('token', response.token);
          console.log('Token stored in Local Storage:', localStorage.getItem('token'));

          // Also store the token and user data in cookies for more security
          const cookieExpirationDays = 7;
          const userName = `${response.prenom || 'Utilisateur'} ${response.nom || ''}`.trim();
          const role = response.role;

          this.cookieService.set('token', response.token, cookieExpirationDays, '/', '', true, 'Strict');
          this.cookieService.set('role', role, cookieExpirationDays, '/', '', true, 'Strict');
          this.cookieService.set('userName', userName, cookieExpirationDays, '/', '', true, 'Strict');
          this.userService.setUserName(userName);

          console.log('User data:', userName);

          alert('Bienvenue ' + userName); // Display user name

          // Check if token is valid before redirecting
          if (this.userService.isTokenValid(response.token)) {
            console.log('Redirecting to home page...');
            this.router.navigate(['/']); // Redirect to home page
          } else {
            alert('Token invalide, veuillez réessayer.');
          }
        } else {
          alert('Token manquant dans la réponse.');
        }
      },
      (error) => {
        console.error('Login Error:', error); // Handle errors
      }
    );
  }}
