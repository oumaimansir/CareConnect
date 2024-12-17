import { Component, OnInit } from '@angular/core';
import { ConsulterCalendarServiceService } from '../services/consulter-calendar-service.service';
import { Rendezvous } from '../models/rendezvous.model';

@Component({
  selector: 'app-consultercalendar',
  templateUrl: './consultercalendar.component.html',
  styleUrls: ['./consultercalendar.component.css'],
})
export class ConsultercalendarComponent implements OnInit {
  viewDate: Date = new Date(); // Current date for the calendar view
  selectedDate: Date = new Date(); // Selected date (initially today)
  appointments: any[] = []; // All appointments fetched from the backend
  filteredAppointments: Rendezvous[] = []; // Appointments filtered for the selected date
i:any=0;
RDV_today:Rendezvous[]=[];
isModalOpen: boolean = false;
selectedAppointment: any = {}; // Rendez-vous sélectionné

  constructor(private myService: ConsulterCalendarServiceService) {}

  ngOnInit(): void {
    // Fetch all appointments from the backend
    this.myService.getRDV().subscribe((data) => {
      this.appointments = data;
      console.log('All appointments:', this.appointments);
      this.filterAppointments(this.selectedDate); // Initially filter for today
    });
  }

  // Triggered when a date is clicked in the calendar
  onDayClick(clickedDate: Date): void {

    this.selectedDate = clickedDate;
    console.log('selected date : ',this.selectedDate);
    this.filterAppointments(this.selectedDate); // Filter appointments for the clicked date
  }

  // Filter appointments for a specific date
  private filterAppointments(date: Date): void {
    const selectedDateString = this.formatDateToYYYYMMDD(date); // Format selected date to YYYY-MM-DD
    console.log('Filtering appointments for date:', selectedDateString);

    this.filteredAppointments = []; // Clear filtered appointments array

    this.appointments.forEach((rdv) => {
      const rdvDateString = this.extractDateFromBackend(rdv.date); // Correctly reformat backend date
      console.log('RDV date reformatted:', rdvDateString, 'Selected date:', selectedDateString);

      if (rdvDateString ==selectedDateString) {
        this.getPatientData(rdv.patient);
        console.log('Match found:', rdv); // Debug log for matches
        this.filteredAppointments.push(rdv); // Add matching RDV
        console.log('rdv : ',rdv);
      }
    });

    console.log('Appointments for selected date:', this.filteredAppointments);
  }

private getPatientData(idP: number){

  this.myService.getPatientData(idP).subscribe((data) => {
   // this.RDV_today.push(data);
   for (let i = 0; i < this.filteredAppointments.length; i++) {
   if (this.filteredAppointments[i]) {
    this.filteredAppointments[i].patient = data;

  }


  console.log(`RDV ${i} updated:`, this.filteredAppointments[i]);
}
   // console.log('All RDV data:', this.RDV_today);
     // Initially filter for today
  });
}


  // Format a Date object to YYYY-MM-DD
  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const day = date.getDate().toString().padStart(2, '0');
    console.log('year ',year);
    console.log('month ',month);
    console.log('day ',day);
    return `${year}-${month}-${day}`;
   }

  // Extract date from backend format (YYYY-DD-MM) and convert to YYYY-MM-DD

private extractDateFromBackend(backendDate: string): string {
  const dateObj = new Date(backendDate); // Convert ISO string to a Date object
  const year = dateObj.getUTCFullYear(); // Use UTC to avoid timezone issues
  const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = dateObj.getUTCDate().toString().padStart(2, '0'); // Get the day
  return `${year}-${month}-${day}`; // Return formatted date in YYYY-MM-DD
}


openModal(appointment: any) {
  this.selectedAppointment = { ...appointment }; // Créer une copie pour éviter de modifier directement l'original
  this.isModalOpen = true;  // Ouvrir la modale
}


closeModal() {
  this.isModalOpen = false;
}
 updateEtat(){
  console.log('update etat works here the id ',this.selectedAppointment._id);
  console.log('update etat works here the etat send',this.selectedAppointment.etat);
  this.myService.updateEtat(this.selectedAppointment._id,this.selectedAppointment.etat).subscribe((data) => {
    console.log('update etat works',data);
    this.closeModal();
    location.reload();
  });
}

}
