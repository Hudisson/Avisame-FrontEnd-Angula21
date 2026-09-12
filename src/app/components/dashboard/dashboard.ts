import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Tarefa {
  id: string;
  isActive: boolean;
}

interface Evento {
  id: string;
  isNotified: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private http = inject(HttpClient);

  private readonly TASKS_URL = 'http://localhost:8080/tasks/my-tasks';
  private readonly EVENTS_URL = 'http://localhost:8080/events/list';

  carregando = signal(true);
  erro = signal<string | null>(null);

  totalTarefas = signal(0);
  tarefasAtivas = signal(0);
  tarefasInativas = signal(0);

  totalEventos = signal(0);
  eventosNotificados = signal(0);
  eventosPendentes = signal(0);

  ngOnInit(): void {
    this.carregarDados();
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

  private carregarDados(): void {

    const headers = this.getHeaders();
    if (!headers) return;

    const tarefas$ = this.http.get<Tarefa[]>(this.TASKS_URL, { headers }).pipe(
      catchError((erro: HttpErrorResponse) => {
        console.error('Erro ao buscar tarefas:', erro);
        return of<Tarefa[]>([]);
      })
    );

    const eventos$ = this.http.get<Evento[] | { message: string }>(this.EVENTS_URL, { headers }).pipe(
      catchError((erro: HttpErrorResponse) => {
        console.error('Erro ao buscar eventos:', erro);
        return of<Evento[]>([]);
      })
    );

    forkJoin([tarefas$, eventos$]).subscribe(([tarefas, eventosResposta]) => {

      const eventos = Array.isArray(eventosResposta) ? eventosResposta : [];

      const ativas = tarefas.filter(t => t.isActive).length;

      this.totalTarefas.set(tarefas.length);
      this.tarefasAtivas.set(ativas);
      this.tarefasInativas.set(tarefas.length - ativas);

      const notificados = eventos.filter(e => e.isNotified).length;

      this.totalEventos.set(eventos.length);
      this.eventosNotificados.set(notificados);
      this.eventosPendentes.set(eventos.length - notificados);

      this.carregando.set(false);
    });
  }

  percentual(parte: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((parte / total) * 100);
  }
}
