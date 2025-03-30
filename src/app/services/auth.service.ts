import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '';
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap((response) => {
        this.token = response.token;
        // opcional: salvar em localStorage ou Capacitor Storage
      }),
      tap(() => console.log('Login ok')),
      tap(() => true),
      catchError((error) => {
        console.error('Erro no login:', error);
        return throwError(() => new Error('Credenciais inválidas'));
      })
    );
  }

  logout() {
    this.token = null;
    this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean {
    return this.token !== null;
  }

  getToken(): string | null {
    return this.token;
  }
}
