import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-event-form',
  imports: [EditorComponent],

  providers: [
    {
      provide: TINYMCE_SCRIPT_SRC,
      useValue: '/tinymce/tinymce.min.js'
    }
  ],

  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm {

  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly CREATE_EVENT_URL = 'http://localhost:8080/events/create';

  titulo = signal('');
  descricao = signal('');
  dataDoEvento = signal('');

  salvando = signal(false);
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

  onEditorChange(event: any): void {
    if (event?.editor) {
      this.descricao.set(event.editor.getContent());
    }
  }

  criarEvento(): void {

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
      eventDate: this.dataDoEvento()
    };

    this.salvando.set(true);
    this.erro.set(null);
    this.sucesso.set(null);

    this.http.post(
      this.CREATE_EVENT_URL,
      body,
      { headers }
    ).subscribe({

      next: () => {
        this.salvando.set(false);
        this.sucesso.set('Evento criado com sucesso.');

        this.router.navigate(['/home/eventos']);
      },

      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao criar evento:', erro);

        this.salvando.set(false);

        if (erro.status === 403) {
          this.erro.set('Você não tem permissão para criar este evento.');
        } else {
          this.erro.set('Não foi possível criar o evento.');
        }
      }

    });
  }
}
