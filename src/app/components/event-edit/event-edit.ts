import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

interface Evento {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  isNotified: boolean;
}

@Component({
  selector: 'app-event-edit',
  imports: [EditorComponent, RouterLink],
  providers: [
    {
      provide: TINYMCE_SCRIPT_SRC,
      useValue: '/tinymce/tinymce.min.js'
    }
  ],
  templateUrl: './event-edit.html',
  styleUrl: './event-edit.css',
})
export class EventEdit implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private readonly EVENT_URL = 'http://localhost:8080/events/list';
  private readonly EDIT_EVENT_URL = 'http://localhost:8080/events/edit';

  private eventId = '';

  titulo = signal('');
  descricao = signal('');
  dataDoEvento = signal('');

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
    placeholder: 'Digite a descrição do evento...'
  };

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

  // Buscar Evento
  private buscarEvento(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.erro.set('Evento não encontrado.');
      this.carregando.set(false);
      return;
    }

    this.eventId = id;

    const headers = this.getHeaders();
    if (!headers) return;

    this.http.get<Evento>(`${this.EVENT_URL}/${id}`, { headers }).subscribe({
      next: (resposta) => {
        this.titulo.set(resposta.title);
        this.descricao.set(resposta.description);
        this.dataDoEvento.set(resposta.eventDate);

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

  onEditorChange(event: any): void {
    if (event?.editor) {
      this.descricao.set(event.editor.getContent());
    }
  }

  // Fluxo de Confirmação e Edição do Evento

  solicitarConfirmacao(): void {
    if (!this.titulo().trim()) {
      this.erro.set('Informe o título do evento.');
      return;
    }

    const textoLimpo = this.descricao().replace(/<[^>]*>/g, '').trim();

    if (!textoLimpo) {
      this.erro.set('Informe a descrição do evento.');
      return;
    }

    if (!this.dataDoEvento()) {
      this.erro.set('Selecione a data do evento.');
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
      eventDate: this.dataDoEvento()
    };

    this.salvando.set(true);
    this.erro.set(null);
    this.sucesso.set(null);

    this.http.put(
      `${this.EDIT_EVENT_URL}/${this.eventId}`,
      body,
      { headers }
    ).subscribe({
      next: () => {
        this.salvando.set(false);
        this.sucesso.set('Evento atualizado com sucesso.');

        this.router.navigate(['/home/eventos']);
      },
      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao editar evento:', erro);

        this.salvando.set(false);
        this.erro.set('Não foi possível atualizar o evento.');
      }
    });
  }
}
