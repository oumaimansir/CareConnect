import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doctor-profil',
  templateUrl: './doctor-profil.component.html',
  styleUrl: './doctor-profil.component.css'
})
export class DoctorProfilComponent implements OnInit {
  doctor: any;

  constructor(
    private route: ActivatedRoute,  // To access the route parameters
    private userService: AuthentificationService  // Your service to fetch doctor data
  ) {}

  ngOnInit(): void {
    // Get the doctor ID from the route parameter
    const doctorId = this.route.snapshot.paramMap.get('id');
    
    if (doctorId) {
      this.loadDoctorProfile(doctorId);
    }
  }

  loadDoctorProfile(doctorId: string): void {
    this.userService.getDoctorById(doctorId).subscribe(
      (data) => {
        this.doctor = data;  // Store the doctor data
      },
      (error) => {
        console.error('Error fetching doctor profile', error);
      }
    );
  }
  
}
