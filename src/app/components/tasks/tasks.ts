import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Tarefa {
  id: string;
  title: string;
  description: string;
  dayOfWeek: string;
  isActive: boolean;
  taskCreatedAt?: string;
  taskUpdatedAt?: string;
}

@Component({
  selector: 'app-tasks',
  imports: [RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {

  private http = inject(HttpClient);

  private readonly TASKS_URL =
    'http://localhost:8080/tasks/my-tasks';

  tarefas = signal<Tarefa[]>([]);

  carregando = signal(true);
  erro = signal<string | null>(null);

  ngOnInit(): void {
    this.buscarTarefas();
  }

  private buscarTarefas(): void {

    const token = localStorage.getItem('jwt_token');

    if (!token) {
      this.erro.set('Token não encontrado.');
      this.carregando.set(false);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<Tarefa[]>(this.TASKS_URL, { headers }).subscribe({

      next: (resposta) => {

        this.tarefas.set(resposta);

        this.erro.set(null);
        this.carregando.set(false);

        console.log('Tarefas recebidas:', resposta);
      },

      error: (erro: HttpErrorResponse) => {

        console.error('Erro ao buscar tarefas:', erro);

        if (erro.status === 404) {

          this.tarefas.set([]);
          this.erro.set(null);

        } else {

          this.erro.set(
            'Não foi possível carregar as tarefas.'
          );

        }

        this.carregando.set(false);
      }

    });
  }
}
