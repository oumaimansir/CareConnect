import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Compte } from '../models/compte.model';
@Component({
  selector: 'app-consulter-compte',
  templateUrl: './consulter-compte.component.html',
  styleUrl: './consulter-compte.component.css'
})
export class ConsulterCompteComponent  implements OnInit {
  compte: any = {};
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

  }
}
