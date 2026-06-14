import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface RegisterResponse{
  messageRegister: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/auth/register';

  register(credentials: { nome: string; email: string; password: string }): Observable<string> {
    return this.http.post<RegisterResponse>(this.API_URL, credentials).pipe(
      // objeto completo para logar ou debugar
      tap((response) => {
        console.log('Objeto completo recebido no TAP:', response);
      }),

      // transforma o objeto, extraindo apenas a string
      map((response) => response.messageRegister)
    );
  } // Fim do método register
}

