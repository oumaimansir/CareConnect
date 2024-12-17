import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { CookieService } from 'ngx-cookie-service';
import { SideMenuUserComponent } from "../side-menu-user/side-menu-user.component";

@Component({
  selector: 'app-modifier-user',
  templateUrl: './modifier-user.component.html',
  styleUrl: './modifier-user.component.css',
})
export class ModifierUserComponent  implements OnInit{
  updateForm: FormGroup;
  emailToSearch: string = ''; // Email entered by the user
userdata:any={};
email:string='';
  constructor(
    private fb: FormBuilder,
    private compteService: AuthentificationService,
     private cookieService: CookieService
  ) {
    // Initialize the form
    this.updateForm = this.fb.group({
      id: [''],
      nom: [''],
      prenom: [''],
      numtel: [''],
      email: [''],
      adresse: [''],
      datenaissance: [''],
      etat: [''],
      password: [''],
      role: ['']
    });
  }
  ngOnInit(): void {
this. search();
  }
  search(){
    this.email=this.cookieService.get('email');
    this.compteService.getCompteByEmail(this.email).subscribe(
      (data)=>{
        console.log('data',data);
        this.userdata=data;
        console.log('the id', this.userdata._id);
      }
      )
  }

  // Fetch account details by email
  fetchCompte(): void {

    if (this.email) {
      this.compteService.getCompteByEmail(this.email).subscribe({
        next: (compte) => {
          // Populate the form with the fetched data
          this.updateForm.patchValue({
            id: compte._id,
            nom: compte.nom,
            prenom: compte.prenom,
            numtel: compte.numtel,
            email: compte.email,
            adresse: compte.adresse,
            datenaissance: compte.datenaissance.split('T')[0], // Format date
            etat: compte.etat,
            role: compte.role
          });
        },
        error: (error) => {
          console.error('Erreur lors de la récupération du compte', error);
          alert('Compte non trouvé.');
        }
      });
    } else {
      alert('Veuillez entrer un email.');
    }
  }

  // Update the account
  onSubmit(): void {
    if (this.updateForm.valid) {
      const compteId = this.updateForm.value.id; // ID de l'utilisateur
      const formData = this.updateForm.value;
      const username=this.cookieService.get('userName');
      const username2=formData.nom+' '+formData.prenom;
console.log('form data',formData);
console.log('id: ',)

      this.compteService.updateCompte(this.userdata._id, formData).subscribe({
        next: (response) => {
          console.log('Compte mis à jour avec succès', response);
          alert('Compte mis à jour avec succès');
          //vérifier si usernanme changé ou nn

          if(username2!= username){
this.cookieService.set('userName',username2);
          }
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du compte', error);
          alert('Erreur lors de la mise à jour du compte.');
        }
      });
    }
  }
}

