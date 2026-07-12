import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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


  usuario = signal<any>(null);
  erro = signal<string | null>(null);
  carregando = signal<boolean>(true);


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

}
