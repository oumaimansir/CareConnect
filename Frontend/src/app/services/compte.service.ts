import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Makes the service available throughout the app
})
export class CompteService {
  private compte: any = null;

  constructor() {}

  setCompte(compte: any): void {
    this.compte = compte;
  }

  getCompte(): any {
    return this.compte;
  }

  clearCompte(): void {
    this.compte = null;
  }
}
