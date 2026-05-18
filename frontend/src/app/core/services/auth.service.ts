import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, CurrentUser } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'devflow_token';
  currentUser = signal<CurrentUser | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.currentUser.set(this.decodeToken(res.token));
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): CurrentUser | null {
    try {
      const decoded: any = jwtDecode(token);
      return {
        email: decoded.sub,
        role: decoded.role ?? 'DESENVOLVEDOR' // fallback seguro enquanto o backend não é corrigido
      };
    } catch {
      return null;
    }
  }

  private loadUser(): CurrentUser | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;
    return this.decodeToken(token);
  }
}
