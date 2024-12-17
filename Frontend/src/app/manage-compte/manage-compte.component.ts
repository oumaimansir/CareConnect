import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { AuthentificationService } from '../services/authentification.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-manage-compte',
  templateUrl: './manage-compte.component.html',
  styleUrls: ['./manage-compte.component.css'] // Note: Corrected `styleUrl` to `styleUrls`.
})

export class ManageCompteComponent  implements OnInit{
  updateForm: FormGroup;
  emailToSearch: string = ''; // Email entered by the user
userdata:any={};
  constructor(
    private fb: FormBuilder,
    private compteService: AuthentificationService
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

  }
  search(){
    this.compteService.getCompteByEmail(this.emailToSearch).subscribe(
      (data)=>{
        console.log('data',data);
        this.userdata=data;
        console.log('the id', this.userdata._id);
      }
      )
  }

  // Fetch account details by email
  fetchCompte(): void {
    if (this.emailToSearch) {this.compteService.getCompteByEmail(this.emailToSearch).subscribe(
      (data) => {
        console.log('data', data);
        this.userdata = data;

        // Populate the form with user data
        this.updateForm.patchValue({
          id: this.userdata._id,
          nom: this.userdata.nom,
          prenom: this.userdata.prenom,
          numtel: this.userdata.numtel,
          email: this.userdata.email,
          adresse: this.userdata.adresse,
          datenaissance: this.userdata.datenaissance.split('T')[0], // Format date
          etat: this.userdata.etat,
          role: this.userdata.role,
        });
      },
      (error) => {
        console.error('Error fetching account data', error);
        alert('Compte non trouvé.');
      }
    );
        }
  }

  // Update the account
  onSubmit(): void {
    if (this.updateForm.valid) {
      const compteId = this.updateForm.value.id; // ID de l'utilisateur
      const formData = this.updateForm.value;

      this.compteService.updateCompte(this.userdata._id, formData).subscribe({
        next: (response) => {
          console.log('Compte mis à jour avec succès', response);
          alert('Compte mis à jour avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du compte', error);
          alert('Erreur lors de la mise à jour du compte.');
        }
      });
    }
  }
}

