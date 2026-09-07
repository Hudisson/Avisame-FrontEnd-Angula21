import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

interface Tarefa {
  id: string;
  title: string;
  description: string;
  dayOfWeek: string;
  isActive: boolean;
}

@Component({
  selector: 'app-task-edit',
  imports: [EditorComponent, RouterLink],
  providers: [
    {
      provide: TINYMCE_SCRIPT_SRC,
      useValue: '/tinymce/tinymce.min.js'
    }
  ],
  templateUrl: './task-edit.html',
  styleUrl: './task-edit.css',
})
export class TaskEdit implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private readonly TASK_URL = 'http://localhost:8080/tasks/task';
  private readonly EDIT_TASK_URL = 'http://localhost:8080/tasks/edit';

  private taskId = '';

  titulo = signal('');
  descricao = signal('');
  diaDaSemana = signal('');
  ativa = signal(true);

  // Variáveis
  carregando = signal(true);
  salvando = signal(false);
  confirmandoSalvamento = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal<string | null>(null);

  editorConfig: EditorComponent['init'] = {
    base_url: '/tinymce',
    suffix: '.min',
    height: 300,
    menubar: false,
    plugins: [
      'lists',
      'link',
      'table',
      'code',
      'wordcount'
    ],
    toolbar:
      'undo redo | ' +
      'blocks | ' +
      'bold italic underline | ' +
      'bullist numlist | ' +
      'link table | ' +
      'removeformat code',
    placeholder: 'Digite a descrição da tarefa...'
  };

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

  // Buscar Tarefa
  private buscarTarefa(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.erro.set('Tarefa não encontrada.');
      this.carregando.set(false);
      return;
    }

    this.taskId = id;

    const headers = this.getHeaders();
    if (!headers) return;

    this.http.get<Tarefa>(`${this.TASK_URL}/${id}`, { headers }).subscribe({
      next: (resposta) => {
        this.titulo.set(resposta.title);
        this.descricao.set(resposta.description);
        this.diaDaSemana.set(resposta.dayOfWeek);
        this.ativa.set(resposta.isActive);

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

  onEditorChange(event: any): void {
    if (event?.editor) {
      this.descricao.set(event.editor.getContent());
    }
  }

  // Fluxo de Confirmação e Edição da Tarefa

  solicitarConfirmacao(): void {
    if (!this.titulo().trim()) {
      this.erro.set('Informe o título da tarefa.');
      return;
    }

    const textoLimpo = this.descricao().replace(/<[^>]*>/g, '').trim();

    if (!textoLimpo) {
      this.erro.set('Informe a descrição da tarefa.');
      return;
    }

    if (!this.diaDaSemana()) {
      this.erro.set('Selecione o dia da semana.');
      return;
    }

    this.erro.set(null);
    this.confirmandoSalvamento.set(true);
  }

  cancelarSalvamento(): void {
    this.confirmandoSalvamento.set(false);
  }

  confirmarEEditar(): void {
    this.confirmandoSalvamento.set(false);

    const headers = this.getHeaders();
    if (!headers) return;

    const body = {
      title: this.titulo(),
      description: this.descricao(),
      dayOfWeek: this.diaDaSemana(),
      isActive: this.ativa()
    };

    this.salvando.set(true);
    this.erro.set(null);
    this.sucesso.set(null);

    this.http.put(
      `${this.EDIT_TASK_URL}/${this.taskId}`,
      body,
      { headers }
    ).subscribe({
      next: () => {
        this.salvando.set(false);
        this.sucesso.set('Tarefa atualizada com sucesso.');

        this.router.navigate(['/home/tarefas']);
      },
      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao editar tarefa:', erro);

        this.salvando.set(false);
        this.erro.set('Não foi possível atualizar a tarefa.');
      }
    });
  }
}
