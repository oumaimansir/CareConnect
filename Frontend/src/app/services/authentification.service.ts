import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Compte } from '../models/compte.model';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private apiUrl ='http://localhost:3001/api/comptes';
  private url_docteurs = 'http://localhost:3001/api/docteur'

  private userNameSubject = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSubject.asObservable();

  setUserName(name: string) {
    this.userNameSubject.next(name);
  }

  getUserName(): string | null {
    return this.userNameSubject.getValue();
  }
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }


  registerUser(userData: any): Observable<any> {
    return this.http.post('http://localhost:3001/api/comptes/register', userData, {
      headers: {
        'Content-Type': 'application/json'  // Ajoutez ce header si l'API attend du JSON
      }
    });
  }

  loginUser(email: string, password: string): Observable<any> {
    const url = 'http://localhost:3001/api/comptes/login';
    const body = { email: email, password: password };

    return this.http.post<any>(url, body).pipe(
      catchError((error) => {
        console.error('Error during login:', error);
        return throwError('Login failed. Please try again.'); // Vous pouvez personnaliser ce message d'erreur
      })
    );
  }

  getUsers(): Observable<Compte[]> { // Ajoutez cette méthode
    return this.http.get<Compte[]>('http://localhost:3001/api/comptes/all').pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        return throwError('Impossible de récupérer les utilisateurs. Veuillez réessayer plus tard.');
      })
    );
  }
  getUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }
  getUserByEmail(email: string): Observable<any> {
    const url='http://localhost:3001/api/patients/email';
    const body = { email: email};
    return this.http.post<any>(url, body).pipe(
      catchError((error) => {
        console.error('Error during login:', error);
        return throwError('Login failed. Please try again.'); // Vous pouvez personnaliser ce message d'erreur
      })
    );
  }



  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  // Helper method to retrieve headers with token for secure requests
  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Method to validate if token is present and valid
  isTokenValid(token: string): boolean {
    // Placeholder validation logic (e.g., expiration check)
    return !!token;
  }

  // Centralized error handling
  private handleError(error: any): Observable<never> {
    console.error('API error occurred:', error);
    return throwError('An error occurred; please try again.');
  }
  getUserRole(): string {
    return this.cookieService.get('role'); // Lire le rôle depuis un cookie
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
  getDocteurs(nom: string, specialite: string, localisation: string): Observable<any> {
    const body = { nom, specialite, localisation };

    return this.http.post<any>(`${this.url_docteurs}/search`, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur détectée dans le service:', error);
        return throwError(error); // Propager l'erreur pour une gestion dans le composant
      })
    );
  }








}



