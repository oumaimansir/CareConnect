import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ConsulterCalendarServiceService {
  private apiUrl ='http://localhost:3001/api/RDV';
  private UrlPatient ='http://localhost:3001/api/patients';
  private UrlRDV ='http://localhost:3001/api/RDV';


  constructor(private http: HttpClient) { }

  getRDV(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }

  getPatientData(id:number): Observable<any> {
    return this.http.get<any>(`${this.UrlPatient}/${id}`);
  }

  updateEtat(idR: number, etat: any): Observable<any> {
    const body = { etat };
    const url = `http://localhost:3001/api/RDV/${idR}/etat`;
    return this.http.put<any>(url, body);
  }

  getAvailableSlots(date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.UrlRDV}/available-slots/${date}`);
  }
}
