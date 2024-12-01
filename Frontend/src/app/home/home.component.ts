import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  userName: string ='';

  constructor(private userService: AuthentificationService) {}

  ngOnInit() {
    this.userService.userName$.subscribe((name) => {
      this.userName = name || 'Utilisateur';
  })
  
  }
}
