import { Component, OnInit, PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
interface Doctor {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  adresse: string;
  rendezvous: string[];
}
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  @Input() adresse: string = '';
  isBrowser: boolean;
  doctors: any = {
    nom: '',
    prenom: '',
    specialite: '',
    adresse: '',
  };
  constructor(@Inject(PLATFORM_ID) private platformId: any,
  private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      import('leaflet').then((L) => {
        // Initialize the map
        const map = L.map('map').setView([36.4357655, 10.6764346], 13); // Default to ITBS

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        this.geocodeAddress(this.adresse, map, L);
        // Event listener for map clicks
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;

          // Reverse Geocoding API call to get place name
          this.fetchLocationName(lat, lng).then((placeName: string) => {
            // Create a new marker at the clicked location
            const marker = L.marker([lat, lng])
              .addTo(map)
              .bindPopup(placeName || `Latitude: ${lat}, Longitude: ${lng}`)
              .openPopup();

            // Fetch doctors by location (place name or coordinates)
            this.fetchDoctorsByLocation(placeName).then((doctors: Doctor[]) => {
              this.displayDoctors(doctors);
            });
          });
        });
      });
    }
  }

  // Function to fetch the place name using OpenStreetMap's Nominatim API
  async fetchLocationName(lat: number, lng: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      // Extract just the city or the last part of the address
      const address = data.address;
      const city = address.city || address.town || address.village || '';

      // If city is not found, try extracting the part after the last comma
      const locationName = city || address.state || address.country;
      console.log(locationName);
      return locationName.trim();
      // Trim in case there are extra spaces
    } catch (error) {
      console.error('Error fetching location name:', error);
      return 'Unknown Location';
    }
  }


  // Function to fetch doctors by location
  fetchDoctorsByLocation(location: string): Promise<Doctor[]> {
    const apiUrl = `http://localhost:3001/api/docteur/search?location=${location}`;
    return this.http.get<Doctor[]>(apiUrl)
      .toPromise()
      .then((data) => data || []); // Ensure it always returns an array (empty if undefined)
  }

  displayDoctors(doctors: Doctor[]): void {
    // Handle the display of doctors (e.g., update the UI)
    console.log(doctors);
  }
  geocodeAddress(address: string, map: any, L: any): void {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          map.setView([lat, lon], 15);
          L.marker([lat, lon]).addTo(map).bindPopup(this.adresse).openPopup();
        } else {
          console.error('Address not found');
        }
      })
      .catch((error) => console.error('Error geocoding address:', error));
  }

}
