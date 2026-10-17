import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { TogglePasswordDirective } from '../../directives/toggle-password.directive';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface UpdateUserResponse {
  sucesso: string;
}

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TogglePasswordDirective],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css'
})
export class UserEdit implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  private readonly USER_URL = 'http://localhost:8080/users';

  usuario = signal<UserProfile | null>(null);
  carregando = signal(true);
  salvando = signal(false);
  erro = signal<string | null>(null);

  formulario = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8)]]
  });

  ngOnInit(): void {
    this.buscarUsuario();
  }

  private getHeaders(): HttpHeaders | null {
    const token = this.authService.getToken();

    if (!token) {
      this.erro.set('Usuário não autenticado. Faça login novamente.');
      this.carregando.set(false);
      return null;
    }

    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private buscarUsuario(): void {
    const headers = this.getHeaders();
    if (!headers) return;

    this.http.get<UserProfile>(`${this.USER_URL}/me`, { headers }).subscribe({
      next: usuario => {
        this.usuario.set(usuario);
        this.formulario.patchValue({
          name: usuario.name,
          email: usuario.email
        });
        this.carregando.set(false);
      },
      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao carregar usuário para edição:', erro);
        this.erro.set(
          erro.status === 403
            ? 'Sua sessão expirou. Faça login novamente.'
            : 'Não foi possível carregar os dados do usuário.'
        );
        this.carregando.set(false);
      }
    });
  }

  salvarAlteracoes(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const usuario = this.usuario();
    const headers = this.getHeaders();
    if (!usuario || !headers) return;

    const dados = this.formulario.getRawValue();
    const payload = {
      id: usuario.id,
      name: dados.name.trim(),
      email: dados.email.trim(),
      password: dados.password.trim()
    };

    this.salvando.set(true);
    this.erro.set(null);

    this.http.put<UpdateUserResponse>(`${this.USER_URL}/edit`, payload, { headers }).subscribe({
      next: () => {
        this.salvando.set(false);
        this.router.navigate(['/home/perfil']);
      },
      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao atualizar usuário:', erro);
        this.erro.set(
          erro.status === 409
            ? 'Este e-mail já está sendo usado por outra conta.'
            : erro.status === 403
              ? 'Sua sessão expirou. Faça login novamente.'
              : 'Não foi possível atualizar os dados do usuário.'
        );
        this.salvando.set(false);
      }
    });
  }
}
