import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);


  usuario = signal<any>(null);
  erro = signal<string | null>(null);
  carregando = signal<boolean>(true);
  confirmandoExclusao = signal(false);
  excluindo = signal(false);


  constructor() {

    this.buscarUsuario();

  }


  private buscarUsuario(): void {

    const token = this.authService.getToken();


    if (!token) {

      this.erro.set('Usuário não autenticado.');
      this.carregando.set(false);

      return;
    }


    const headers = new HttpHeaders({

      Authorization: `Bearer ${token}`

    });


    this.http
      .get('http://localhost:8080/users/me', { headers })
      .subscribe({

        next: (resposta) => {

          this.usuario.set(resposta);
          this.carregando.set(false);

        },


        error: (erro) => {

          console.error('Erro ao buscar usuário:', erro);

          this.erro.set(
            'Não foi possível carregar os dados do usuário.'
          );

          this.carregando.set(false);

        }

      });

  }

  solicitarExclusao(): void {
    this.erro.set(null);
    this.confirmandoExclusao.set(true);
  }

  cancelarExclusao(): void {
    if (!this.excluindo()) {
      this.confirmandoExclusao.set(false);
    }
  }

  confirmarExclusao(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.erro.set('Usuário não autenticado. Faça login novamente.');
      this.confirmandoExclusao.set(false);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.excluindo.set(true);
    this.erro.set(null);

    this.http.delete('http://localhost:8080/users/delete-me', { headers }).subscribe({
      next: () => {
        this.authService.limparSessaoLocal();
        this.router.navigate(['/']);
      },
      error: (erro) => {
        console.error('Erro ao excluir conta:', erro);
        this.erro.set(
          erro.status === 403
            ? 'Sua sessão expirou. Faça login novamente.'
            : 'Não foi possível excluir a conta. Tente novamente.'
        );
        this.excluindo.set(false);
        this.confirmandoExclusao.set(false);
      }
    });
  }

}
