import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface Evento {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  isNotified: boolean;
  eventCreatedAt?: string;
  eventUpdatedAt?: string;
}

@Component({
  selector: 'app-event-view',
  imports: [RouterLink, DatePipe, FontAwesomeModule],
  templateUrl: './event-view.html',
  styleUrl: './event-view.css',
})
export class EventView implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private readonly EVENT_URL = 'http://localhost:8080/events/list';
  private readonly DELETE_EVENT_URL = 'http://localhost:8080/events/delete';

  evento = signal<Evento | null>(null);
  carregando = signal(true);
  erro = signal<string | null>(null);
  confirmandoExclusao = signal(false);
  excluindo = signal(false);

  ngOnInit(): void {
    this.buscarEvento();
  }

  private getHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      this.erro.set('Token não encontrado.');
      this.carregando.set(false);
      return null;
    }

    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private buscarEvento(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.erro.set('Evento não encontrado.');
      this.carregando.set(false);
      return;
    }

    const headers = this.getHeaders();
    if (!headers) return;

    this.http.get<Evento>(`${this.EVENT_URL}/${id}`, { headers }).subscribe({

      next: (resposta) => {
        this.evento.set(resposta);
        this.carregando.set(false);
      },

      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao buscar evento:', erro);

        if (erro.status === 404) {
          this.erro.set('Evento não encontrado.');
        } else if (erro.status === 403) {
          this.erro.set('Você não tem acesso a este evento.');
        } else {
          this.erro.set('Não foi possível carregar o evento.');
        }

        this.carregando.set(false);
      }

    });
  }

  // Fluxo do Modal de Exclusão

  solicitarConfirmacaoExclusao(): void {
    this.confirmandoExclusao.set(true);
  }

  cancelarExclusao(): void {
    this.confirmandoExclusao.set(false);
  }

  confirmarEExcluir(): void {
    const eventoAtual = this.evento();
    if (!eventoAtual) return;

    const headers = this.getHeaders();
    if (!headers) return;

    this.confirmandoExclusao.set(false);
    this.excluindo.set(true);

    this.http.delete(`${this.DELETE_EVENT_URL}/${eventoAtual.id}`, { headers }).subscribe({

      next: () => {
        this.router.navigate(['/home/eventos']);
      },

      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao excluir evento:', erro);
        this.erro.set('Não foi possível excluir o evento.');
        this.excluindo.set(false);
      }

    });
  }
}
