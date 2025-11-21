import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/shared/api.url';
import { Router } from '@angular/router';

@Component({
  selector: 'app-esqueci-minha-senha',
  templateUrl: './esqueci-minha-senha.page.html',
  styleUrls: ['./esqueci-minha-senha.page.scss'],
  standalone: false,
})
export class EsqueciMinhaSenhaPage implements OnInit {
  esqueciSenhaForm!: FormGroup;
  mensagemSucesso: string | null = null;
  isLoading = false;

  constructor(
    private toastCtrl: ToastController,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.esqueciSenhaForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emailControl() {
    return this.esqueciSenhaForm.get('email');
  }

  redefinirSenha() {
    if (this.esqueciSenhaForm.invalid) {
      this.esqueciSenhaForm.markAllAsTouched();

      if (this.emailControl?.hasError('required')) {
        this.exibirToast('O campo e-mail é obrigatório.', 'danger');
      } else if (this.emailControl?.hasError('email')) {
        this.exibirToast('Por favor, insira um e-mail válido.', 'danger');
      }
      return;
    }

    const url = API_BASE_URL + '/auth/recover';

    const { email } = this.esqueciSenhaForm.value;

    const body = {
      email,
    };

    this.isLoading = true;
    this.http
      .post<{
        message: string;
        code: string;
        expires: string;
      }>(url, body)
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          localStorage.setItem('token_redefinição', response.code);
          localStorage.setItem('email', email);

          this.esqueciSenhaForm.setValue({
            email: '',
          });

          this.router.navigate(['/validar-token']);
          this.exibirToast(response.message, 'success');
        },
        error: (err) => {
          console.log({ err });
          const message =
            err?.error?.message ||
            'Ocorreu algum erro, tente novamente mais tarde!';
          this.isLoading = false;
          this.exibirToast(message, 'danger');
        },
      });
  }

  fecharMensagem() {
    this.mensagemSucesso = null;
  }

  async exibirToast(mensagem: string, status: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 2000,
      color: status,
    });
    await toast.present();
  }
}
