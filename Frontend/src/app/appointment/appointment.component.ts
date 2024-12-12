import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // To access route params
import { RendezvousService } from '../services/rendezvous.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  formData: any = {
    userName: '',
    patientId: '',  // The patient ID will be set from localStorage
    docteurId: '',
    date: '',
    heure: '',
    etat: 'programmé', 
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object ,
  private route: ActivatedRoute,
  private http: HttpClient) {}

  ngOnInit(): void {
   
    // Only fetch patient data from localStorage if in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.fetchPatientData();
    }
    console.log('Patient ID:', this.formData.patientId);
    
    this.getDoctorIdFromRoute();
  }
  getDoctorIdFromRoute() {
    this.route.queryParams.subscribe(params => {
      this.formData.docteurId = params['doctorId'];
      console.log('Docteur ID:', this.formData.docteurId);  // Retrieve doctorId from query params
    });
    
  }

  // Fetch the patient ID and username from localStorage if in the browser
  fetchPatientData() {
    const storedData = localStorage.getItem('userdata');

    if (storedData) {
      const parsedData = JSON.parse(storedData);  // Parse userdata from localStorage

      // Extract patientId and userName from storedData and set them to formData
      this.formData.patientId = parsedData._id;    // Assuming the stored data contains the patient ID as _id
      this.formData.userName = `${parsedData.nom} ${parsedData.prenom}`; // Assuming name fields are present
    } else {
      console.error('No user data found in localStorage');
      // Handle the case where no user data is found
    }
  }

  // Submit the form after validating inputs
  submitForm() {
    // Validate required fields
    if (!this.formData.patientId || !this.formData.docteurId || !this.formData.date || !this.formData.heure) {
      alert('Please fill in all the required fields.');
      return;
    }

    const apiUrl = 'http://localhost:3001/api/RDV/registerRDV'; // Replace with your backend URL
    const payload = {
      patientId: this.formData.patientId,
      docteurId: this.formData.docteurId,
      date: this.formData.date,
      heure: this.formData.heure,
      etat: this.formData.etat,
    };

    // Send POST request to the backend
    this.http.post(apiUrl, payload).subscribe({
      next: (response) => {
        console.log('Rendezvous saved successfully:', response);
        alert('Rendezvous registered successfully!');
      },
      error: (error) => {
        console.error('Error registering rendezvous:', error);
        alert('An error occurred while registering the rendezvous.');
      },
    });
  }
}