import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-consulter-user',
  templateUrl: './consulter-user.component.html',
  styleUrls: ['./consulter-user.component.css']
})
export class ConsulterUserComponent implements OnInit {
  emailToSearch: string = ''; // Email saisi par l'utilisateur
  userdata: any = {}; // Données utilisateur retournées par l'API
  updateForm: FormGroup;
email:string='';
  constructor(
    private fb: FormBuilder,
    private compteService: AuthentificationService,
      private cookieService: CookieService
  ) {
    // Initialisation du formulaire
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
    // Initialisation ou autres actions si nécessaire

    this.search();
  }

  search(): void {
this.email=this.cookieService.get('email');


    this.compteService.getCompteByEmail(this.email).subscribe(
      (data) => {
        console.log('Données utilisateur:', data);
        this.userdata = data;

        // Mise à jour des valeurs dans le formulaire
        this.updateForm.patchValue({
          id: this.userdata._id,
          nom: this.userdata.nom,
          prenom: this.userdata.prenom,
          numtel: this.userdata.numtel,
          email: this.userdata.email,
          adresse: this.userdata.adresse,
          datenaissance: this.userdata.datenaissance?.split('T')[0], // Gestion du format de date
          etat: this.userdata.etat
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
        alert('Aucun utilisateur trouvé pour cet email.');
      }
    );
  }
}
