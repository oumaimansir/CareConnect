import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  userName: string = '';
  doctors: any[] = [];

  constructor(
    private userService: AuthentificationService,
    private router: Router  // Inject Router service
  ) {}

  ngOnInit(): void {
    this.userService.userName$.subscribe((name) => {
      this.userName = name || 'Utilisateur';
    });

    this.searchDoctors();  // Fetch doctors when the component loads
  }

  searchDoctors(): void {
    this.userService.getDocteurs().subscribe(
      (data: any[]) => {
        this.doctors = data;
        console.log(data);
      },
      (error) => {
        console.error('Error while fetching doctors', error);
      }
    );
  }

  // Navigate to the doctor's profile page when clicked
  viewDoctorProfile(doctorId: string): void {
    console.log('Navigating to doctor profile with ID:', doctorId);  // Check if this logs correctly
    this.router.navigate([`/doctor/${doctorId}`]);  // Ensure correct path
  }
}
