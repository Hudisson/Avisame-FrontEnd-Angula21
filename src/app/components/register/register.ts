import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/auth/register.service';
import { NavLogin } from "../nav-login/nav-login";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavLogin, Footer],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {

  // Injeção da função inject()
  private fb = inject(NonNullableFormBuilder);
  private registerService = inject(RegisterService);
  private router = inject(Router);

  // Estrutura do formulário
  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]]
  }, {
    validators: this.validarSenhas // Validador customizado para cruzar as duas senhas ( OBS.: preciso validar no back-end)
  });

  // Método validador que garante que as senhas são estritamente iguais
  private validarSenhas(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senha')?.value;
    const confirmarSenha = control.get('confirmarSenha')?.value;

    return senha === confirmarSenha ? null : { senhasDiferentes: true };
  }

  // Envio dos dados para o RegisterService
  onSubmit() {
    if (this.registerForm.valid) {

      // Extrai os dados atuais de forma segura (sem risco de 'null')
      const dadosForm = this.registerForm.getRawValue();

      // Mapeia os dados do formulário para a estrutura aceita pela API
      const payload = {
        name: dadosForm.name,
        email: dadosForm.email,
        password: dadosForm.senha
      };

      // Dispara a requisição HTTP através do seu serviço
      this.registerService.register(payload).subscribe({
        next: (mensagemSucesso) => {
          console.log('Mensagem da API:', mensagemSucesso);

          // Redireciona o usuário para a página de login após o sucesso
          this.router.navigate(['']);
        },
        error: (erro) => {
          console.error('Falha ao registrar usuário:', erro);
        }
      });
    }
  }
}
