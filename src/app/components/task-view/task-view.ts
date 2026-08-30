import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DiaDaSemanaPipe } from '../../pipes/dia-da-semana.pipe';

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
  selector: 'app-task-view',
  imports: [RouterLink, DiaDaSemanaPipe],
  templateUrl: './task-view.html',
  styleUrl: './task-view.css',
})
export class TaskView implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private readonly TASK_URL = 'http://localhost:8080/tasks/task';
  private readonly DELETE_TASK_URL = 'http://localhost:8080/tasks/delete';

  tarefa = signal<Tarefa | null>(null);
  carregando = signal(true);
  erro = signal<string | null>(null);
  excluindo = signal(false);

  ngOnInit(): void {
    this.buscarTarefa();
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

  private buscarTarefa(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.erro.set('Tarefa não encontrada.');
      this.carregando.set(false);
      return;
    }

    const headers = this.getHeaders();
    if (!headers) return;

    this.http.get<Tarefa>(`${this.TASK_URL}/${id}`, { headers }).subscribe({

      next: (resposta) => {
        this.tarefa.set(resposta);
        this.carregando.set(false);
      },

      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao buscar tarefa:', erro);

        if (erro.status === 404) {
          this.erro.set('Tarefa não encontrada.');
        } else if (erro.status === 403) {
          this.erro.set('Você não tem acesso a esta tarefa.');
        } else {
          this.erro.set('Não foi possível carregar a tarefa.');
        }

        this.carregando.set(false);
      }

    });
  }

  excluirTarefa(): void {
    const tarefaAtual = this.tarefa();
    if (!tarefaAtual) return;

    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    const headers = this.getHeaders();
    if (!headers) return;

    this.excluindo.set(true);

    this.http.delete(`${this.DELETE_TASK_URL}/${tarefaAtual.id}`, { headers }).subscribe({

      next: () => {
        this.router.navigate(['/home/tarefas']);
      },

      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao excluir tarefa:', erro);
        this.erro.set('Não foi possível excluir a tarefa.');
        this.excluindo.set(false);
      }

    });
  }
}
