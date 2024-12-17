
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // To access route params
import { RendezvousService } from '../services/rendezvous.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';


import { AuthentificationService } from '../services/authentification.service';
import { Patient } from '../models/patient.model';
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})

 // styleUrls: ['./appointment.component.css']

export class AppointmentComponent implements OnInit{
  userName: string ='';
  datechoisi:Date=new Date();
  availableSlots: string[] = [];
  selectedTime: string = '';
  doctorId: string | null = null; // Stocker l'ID du docteur
  patientId:string ='674b417783e1f44e837c2a37';
  patient:Patient={
    email: '',
    password: '',
    _id :0,
    nom : '',
    prenom : ''
  }
  constructor(private userService: AuthentificationService,
    private rdvService:RendezvousService,
    private route: ActivatedRoute,
  public cookieService: CookieService ) {}

  ngOnInit() {
    this.doctorId = this.route.snapshot.queryParamMap.get('doctorId');

    console.log('ID du docteur récupéré :', this.doctorId);
    this.userService.userName$.subscribe((name) => {
      this.userName = name || 'Utilisateur';
  })
this.getPatientByEmail();
  }
  choisirDate(){
    console.log("date choisi : ",this.datechoisi);//
  const  doctId= "674c39fa8e0f8ad4c6781a13";
    this.rdvService.getTimeByDate(this.datechoisi,this.doctorId).subscribe((data) => {
     // this.userName = name || 'Utilisateur';
     console.log("liste de temps reçu ",data);
     this.availableSlots=data.availableSlots;
  })
  }
  bookAppointement(){
    const doctor=this.doctorId+'';
    const patient=this.patient._id+'';
    if( this.selectedTime!='' && this.datechoisi){

      this.rdvService.bookAppointement(this.datechoisi,this.selectedTime,'programmé',doctor,patient).subscribe((data)=>{
      console.log(data);
      alert('votre Rendez-vous est enregistré avec succès date : '+this.datechoisi+' heure: '+this.selectedTime);
    })
    }
    else {
      alert('veuillez-vous remplir tous les champs');
    }


}
getPatientByEmail(){
  const email=this.cookieService.get('email');
  this.userService.getCompteByEmail(email).subscribe((data)=>{
this.patient=data;
this.userName=data.nom +' '+data.prenom;
console.log('patient ',this.patient._id);
  });
}
}

//http://localhost:4200/appointment?doctorId=674c39fa8e0f8ad4c6781a13

 /* ngOnInit(): void {

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
}*/



