import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RendezvousService {
  private apiUrl = 'http://localhost:3001/api/Rendezvous'; // Your backend endpoint

  constructor(private http: HttpClient) {}

  // Method to register a new RDV
  registerRDV(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registerRDV`, data);
  }
}
