import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Define a estrutura da resposta de login
interface LoginResponse {
  token: string;
}


@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/auth/login'; // URL base da API de autenticação

  /**
   * O sinal "isAuthenticated" é inicializado com o valor retornado pela função "hasToken()",
   * que verifica se há um token de autenticação armazenado no localStorage. Se houver um token, o usuário é considerado autenticado; caso contrário, não é. Esse sinal pode ser usado em toda a aplicação para controlar o acesso a rotas protegidas e exibir ou ocultar elementos da interface do usuário com base no estado de autenticação.
   */
  isAuthenticated = signal<boolean>(this.hasToken());

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}`, credentials).pipe(
      tap(response =>{
        if(response.token) {
          localStorage.setItem('jwt_token', response.token);
          this.isAuthenticated.set(true);
        }
      })
    );
  } // Fim do método login

  logout(): void{
    localStorage.removeItem('jwt_token');
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  private hasToken(): boolean{
    return !!localStorage.getItem('jwt_token');
  }

} // Fim da classe AuthService
