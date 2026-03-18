import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export type Gender = 'M' | 'F' | 'OTHER';

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  gender: Gender | null;
  heightCm: number | null;
}

export interface WeightRecord {
  id: string;
  weightKg: number;
  recordedAt: string;
}

export interface BodyMeasurementRecord {
  id: string;
  collo: number | null;
  spalle: number | null;
  petto: number | null;
  braccioL: number | null;
  braccioR: number | null;
  vita: number | null;
  fianchi: number | null;
  cosciaL: number | null;
  cosciaR: number | null;
  polpaccioL: number | null;
  polpaccioR: number | null;
  recordedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private api: ApiService) {}

  getProfile(): Observable<UserProfile> {
    return this.api.get<UserProfile>('/profile');
  }

  updateProfile(dto: Partial<UserProfile>): Observable<UserProfile> {
    return this.api.patch<UserProfile>('/profile', dto);
  }

  addWeight(weightKg: number): Observable<WeightRecord> {
    return this.api.post<WeightRecord>('/profile/weight', { weightKg });
  }

  getWeightHistory(): Observable<WeightRecord[]> {
    return this.api.get<WeightRecord[]>('/profile/weight/history');
  }

  addMeasurements(dto: Partial<BodyMeasurementRecord>): Observable<BodyMeasurementRecord> {
    return this.api.post<BodyMeasurementRecord>('/profile/measurements', dto);
  }

  getMeasurementsHistory(): Observable<BodyMeasurementRecord[]> {
    return this.api.get<BodyMeasurementRecord[]>('/profile/measurements/history');
  }
}
