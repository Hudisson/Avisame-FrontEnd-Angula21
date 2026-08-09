import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';

interface ConfigResponse {
  preferredHour?: string;
  message?: string;
  status?: string;
}

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [],
  templateUrl: './horarios.html',
  styleUrl: './horarios.css',
})
export class Horarios implements OnInit {

  private http = inject(HttpClient);

  private readonly CONFIG_URL = 'http://localhost:8080/config';
  private readonly CREATE_CONFIG_URL = 'http://localhost:8080/config/create';
  private readonly UPDATE_CONFIG_URL = 'http://localhost:8080/config/update-time';

  horarioAtual = signal<string | null>(null);
  novoHorario = signal<string>('');

  configuracaoExiste = signal<boolean>(false);

  carregando = signal<boolean>(true);
  salvando = signal<boolean>(false);
  erro = signal<string | null>(null);
  sucesso = signal<string | null>(null);

  mensagemAviso = signal<string | null>(null);

  ngOnInit(): void {
    this.buscarHorario();
  }

  private buscarHorario(): void {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      this.erro.set('Token não encontrado.');
      this.carregando.set(false);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<ConfigResponse>(this.CONFIG_URL, { headers }).subscribe({
      next: (resposta) => {
        if (String(resposta.status) === '405') {
          this.horarioAtual.set(null);
          this.configuracaoExiste.set(false);
          this.mensagemAviso.set(resposta.message || 'Você ainda não configurou um horário.');
        } else {
          if (resposta.preferredHour) {
            this.horarioAtual.set(resposta.preferredHour);
          }
          this.configuracaoExiste.set(true);
          this.mensagemAviso.set(null);
        }

        this.erro.set(null);
        this.carregando.set(false);
        console.log(resposta);
      },

      error: (erro: HttpErrorResponse) => {
        if (erro.status === 404) {
          this.horarioAtual.set(null);
          this.configuracaoExiste.set(false);
          this.erro.set(null);
        } else {
          console.error('Erro ao buscar configuração:', erro);
          this.erro.set('Não foi possível carregar o horário.');
        }

        this.carregando.set(false)
      }
    });
  }

  salvarHorario(): void {
    if (!this.novoHorario()) {
      this.erro.set('Selecione um horário.');
      return;
    }

    const token = localStorage.getItem('jwt_token');

    // Se o token não for encontrado
    if (!token) {
      this.erro.set('Token não encontrado.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      preferredHour: this.novoHorario()
    };

    this.salvando.set(true);
    this.erro.set(null);
    this.sucesso.set(null);

    const url = this.configuracaoExiste()
      ? this.UPDATE_CONFIG_URL
      : this.CREATE_CONFIG_URL;



    // const requisicao = this.configuracaoExiste()
    //   ? this.http.put(url, body, { headers })
    //   : this.http.post(url, body, { headers });

      // Adicionado { headers, responseType: 'text' as 'json' } para aceitar resposta em texto puro
    const requisicao = this.configuracaoExiste()
      ? this.http.put(url, body, { headers, responseType: 'text' as 'json' })
      : this.http.post(url, body, { headers, responseType: 'text' as 'json' });

    requisicao.subscribe({
      next: () => {
        this.horarioAtual.set(this.novoHorario());
        this.configuracaoExiste.set(true);
        this.novoHorario.set('');
        this.salvando.set(false);
        window.location.reload();
        this.sucesso.set('Horário salvo com sucesso.');
      },

      error: (erro) => {
        console.error('Erro ao salvar horário:', erro);

        this.salvando.set(false);
        this.erro.set('Não foi possível salvar o horário.');
      }
    });
  }
}
