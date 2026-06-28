import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [],
  templateUrl: './nav-menu.html',
  styleUrls: ['./nav-menu.css'],
})
export class NavMenu {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estados locais gerenciados por Signals para reatividade instantânea
  dadosDaApi = signal<any>(null);
  erro = signal<string | null>(null);
  carregando = signal<boolean>(true);

  constructor() {
    // Reage automaticamente sempre que o estado de login mudar
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.buscarDadosDaApi();
      } else {
        this.carregando.set(false);
        this.dadosDaApi.set(null);
      }
    });
  }

  // Método para efetuar o logout
  efetuarLogout(event: Event): void {

    event.preventDefault() // Evita que o '#' do link recarregue a página
    this.authService.logout().subscribe({
      next: () =>{
        // Após a API responder e o serviço limpar o local, redireciona para a tela de login
       this.router.navigate(['']);
      },

      error: () =>{
        // Mesmo se a API falhar (ex: servidor fora do ar), redirecionamos o usuário para a tela de login
      this.router.navigate(['']);
      }

    });

  } // Fim do método efetuarLogout


  // Método para buscar os dados do usuário na API
  private buscarDadosDaApi(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.erro.set('Token não encontrado.');
      this.carregando.set(false);
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.carregando.set(true); // Garante o estado de loading ao buscar

    this.http.get('http://localhost:8080/users/me', { headers }).subscribe({
      next: (resposta) => {
        this.dadosDaApi.set(resposta);
        this.erro.set(null);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Não foi possível carregar os dados.');
        this.carregando.set(false);
        console.error('Erro na requisição:', err);
      }
    });
  } // Fim do método buscarDadosDaApi
}
