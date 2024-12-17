import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Compte } from '../models/compte.model';

import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-consulter-compte',
  templateUrl: './consulter-compte.component.html',
  styleUrl: './consulter-compte.component.css'
})
export class ConsulterCompteComponent  implements OnInit {

  emailToSearch: string = ''; // Email entered by the user
  userdata:any={};
  updateForm: FormGroup;
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

 /* compte: any = {};
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document ) {}

  ngOnInit() {
    // Create the <meta> element
    //const meta = this.renderer.createElement('meta');
    //this.renderer.setAttribute(meta, 'charset', 'UTF-8');

    // Append it to the <head> section of the document
    //this.renderer.appendChild(this.document.head, meta);
    const storedData = localStorage.getItem('userdata');
    console.log(storedData)
    if (storedData) {

      this.compte = JSON.parse(storedData);
      console.log(this.compte.nom);
    }
  }
  rechercher()
  {const storedData = localStorage.getItem('userdata');
    console.log(storedData)
*/

  }
}
