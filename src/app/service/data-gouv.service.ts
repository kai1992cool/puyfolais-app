import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataGouvService {

  private readonly apiUrl = 'https://api-adresse.data.gouv.fr/search/';

  constructor(private http: HttpClient) { }

  searchAddress(query: string): Observable<any[]> {
    const params = new HttpParams().set('q', query);

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => response.features.map((feature: any) => ({
        label: feature.properties.label,
        name: feature.properties.name,
        postcode: feature.properties.postcode,
        citycode: feature.properties.citycode,
        city: feature.properties.city,
        street: feature.properties.street,
        housenumber: feature.properties.housenumber,
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0]
      })))
    );
  }
}