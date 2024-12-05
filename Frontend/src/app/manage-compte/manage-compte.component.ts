import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-manage-compte',
  templateUrl: './manage-compte.component.html',
  styleUrls: ['./manage-compte.component.css'] // Note: Corrected `styleUrl` to `styleUrls`.
})
export class ManageCompteComponent implements OnInit {
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    // Create the <meta> element
    const meta = this.renderer.createElement('meta');
    this.renderer.setAttribute(meta, 'charset', 'UTF-8');

     //Append it to the <head> section of the document
    this.renderer.appendChild(this.document.head, meta);
  }
}
