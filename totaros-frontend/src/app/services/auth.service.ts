import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Points directly to the live PostgreSQL login pipeline route inside main.py
  private authUrl = 'https://totaros-backend-api.onrender.com/api/auth/login';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.authUrl, credentials).pipe(
      tap(response => {
        if (response && response.access_token) {
          // Permanently save the Bearer string to local storage upon matching password hash checks
          localStorage.setItem('totaro_admin_token', response.access_token);
        }
      })
    );
  }

  // Active check helper variable to see if an encrypted session sequence token exists
  isLoggedIn(): boolean {
    return !!localStorage.getItem('totaro_admin_token');
  }

  getToken(): string | null {
    return localStorage.getItem('totaro_admin_token');
  }

  logout(): void {
    localStorage.removeItem('totaro_admin_token');
    this.router.navigate(['/admin-login']);
  }
}
