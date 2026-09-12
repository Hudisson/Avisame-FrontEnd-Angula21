import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

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
  selector: 'app-eventos',
  imports: [RouterLink, DatePipe],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css',
})
export class Eventos implements OnInit {

  private http = inject(HttpClient);

  private readonly EVENTS_URL = 'http://localhost:8080/events/list';

  eventos = signal<Evento[]>([]);

  carregando = signal(true);
  erro = signal<string | null>(null);

  ngOnInit(): void {
    this.buscarEventos();
  }

private buscarEventos(): void {

  const token = localStorage.getItem('jwt_token');

  if (!token) {
    this.erro.set('Token não encontrado.');
    this.carregando.set(false);
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.get<Evento[] | { message: string }>(this.EVENTS_URL, { headers }).subscribe({

    next: (resposta) => {
      this.eventos.set(Array.isArray(resposta) ? resposta : []);

      this.erro.set(null);
      this.carregando.set(false);
    },

    error: (erro: HttpErrorResponse) => {
      console.error('Erro ao buscar eventos:', erro);

      if (erro.status === 404) {
        this.eventos.set([]);
        this.erro.set(null);
      } else {
        this.erro.set('Não foi possível carregar os eventos.');
      }

      this.carregando.set(false);
    }

  });
}

}
