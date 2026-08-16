import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  imports: [],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {

  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly CREATE_TASK_URL =
    'http://localhost:8080/tasks/create';

  titulo = signal('');
  descricao = signal('');
  diaDaSemana = signal('');
  ativa = signal(true);

  salvando = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal<string | null>(null);

  criarTarefa(): void {

    if (!this.titulo().trim()) {
      this.erro.set('Informe o título da tarefa.');
      return;
    }

    if (!this.descricao().trim()) {
      this.erro.set('Informe a descrição da tarefa.');
      return;
    }

    if (!this.diaDaSemana()) {
      this.erro.set('Selecione o dia da semana.');
      return;
    }

    const token = localStorage.getItem('jwt_token');

    if (!token) {
      this.erro.set('Token não encontrado.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const body = {
      title: this.titulo(),
      description: this.descricao(),
      dayOfWeek: this.diaDaSemana(),
      isActive: this.ativa()
    };

    this.salvando.set(true);
    this.erro.set(null);
    this.sucesso.set(null);

    this.http.post(
      this.CREATE_TASK_URL,
      body,
      { headers }
    ).subscribe({

      next: () => {

        this.salvando.set(false);
        this.sucesso.set('Tarefa criada com sucesso.');

        this.router.navigate(['/home/tarefas']);
      },

      error: (erro) => {

        console.error('Erro ao criar tarefa:', erro);

        this.salvando.set(false);
        this.erro.set('Não foi possível criar a tarefa.');
      }

    });
  }
}
