import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

// Interface que define a estrutura da resposta da sua API
interface RegisterResponse {
  messageRegister: string;
}

// Interface que define os dados que o serviço precisa receber para enviar à API
interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {

  // Injeção do HttpClient
  private http = inject(HttpClient);

  // URL do seu endpoint de cadastro
  private readonly API_URL = 'http://localhost:8080/auth/register';

  /**
   * Envia os dados de registro para a API.
   * Transforma o retorno para entregar apenas a string com a mensagem de sucesso.
   */
  register(credentials: RegisterPayload): Observable<string> {
    return this.http.post<RegisterResponse>(this.API_URL, credentials).pipe(
      // tap: para debugar no console o JSON completo que o backend devolveu
      tap((response) => {
        console.log('Objeto completo recebido no TAP:', response);
      }),

      // map: Transforma o objeto do backend, extraindo apenas o texto da mensagem
      map((response) => response.messageRegister)
    );
  }
}
