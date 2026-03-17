import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}

  get token(): string | null { return localStorage.getItem('token'); }
  get isAuthenticated(): boolean { return !!this.token; }

  register(email: string, password: string) {
    return this.http.post<{ access_token: string }>(`${this.base}/auth/register`, { email, password })
      .pipe(tap(r => localStorage.setItem('token', r.access_token)));
  }
  login(email: string, password: string) {
    return this.http.post<{ access_token: string }>(`${this.base}/auth/login`, { email, password })
      .pipe(tap(r => localStorage.setItem('token', r.access_token)));
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}
