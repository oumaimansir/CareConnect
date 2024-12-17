
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { partition } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }
  getTimeByDate(date :Date,docId: any){
    const url='http://localhost:3001/api/RDV/available-slots';
    const body = { date: date,  docteurId:docId};
    return this.http.post<any>(url, body);


  }
  bookAppointement(datechoisi:Date, selectedTime:string,etat:string,doctorId:string,patientId:string){
    const url='http://localhost:3001/api/RDV/registerRDV';
    const body = { date: datechoisi,
      heure:selectedTime,
      etat:etat,
      patientId:patientId,
       docteurId:doctorId

      };
    return this.http.post<any>(url, body);
  }
}
