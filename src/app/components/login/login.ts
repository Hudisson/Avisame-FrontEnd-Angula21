import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NavLogin } from "../nav-login/nav-login";
import { Footer } from "../footer/footer";
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, NavLogin, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string = "";

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if(this.loginForm.invalid) return;

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: () => {
        // Redireciona para o home após o armazenamento do token
        this.router.navigate(['/home']);
      },

      error: (err) => {
        this.errorMessage = 'Usuário ou senha inválidos.';
        console.error('Erro no login:', err);
      }

    });
  }

}
