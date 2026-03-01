import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CarDetailResponse,
  CarFilterParams,
  CarResponse,
  PagedCarResponse,
} from '@shared/interfaces/vehicle.interface';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly baseUrl = `${environment.apiUrl}/cars`;

  constructor(private readonly http: HttpClient) {}

  searchCars(filters: CarFilterParams): Observable<PagedCarResponse> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PagedCarResponse>(this.baseUrl, { params });
  }

  getCarById(id: number): Observable<CarDetailResponse> {
    return this.http.get<CarDetailResponse>(`${this.baseUrl}/${id}`);
  }

  getMixedRecentCars(size: number = 6): Observable<CarResponse[]> {
    return this.http.get<CarResponse[]>(`${this.baseUrl}/recent/mixed`, {
      params: { size: String(size) },
    });
  }

  getMakes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/makes`);
  }

  getModels(make: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/models`, {
      params: { make },
    });
  }
}
