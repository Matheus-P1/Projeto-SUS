import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { API_BASE_URL } from 'src/app/shared/api.url';

export const senhasIguaisValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const senha = control.get('senha');
  const confirmarSenha = control.get('confirmarSenha');
  return senha && confirmarSenha && senha.value !== confirmarSenha.value
    ? { senhasNaoConferem: true }
    : null;
};

@Component({
  standalone: false,
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  cadastroForm!: FormGroup;
  isLoading = false;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cadastroForm = this.fb.group(
      {
        nome: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        dataDeNascimento: ['', [Validators.required]],
        cns: ['', [Validators.required]],
        cpf: ['', [Validators.required]],
        telefone: ['', [Validators.required]],
        senha: ['', [Validators.required, Validators.minLength(8)]],
        confirmarSenha: ['', [Validators.required]],
      },
      {
        validators: senhasIguaisValidator,
      }
    );
  }

  goBack() {
    this.location.back();
  }

  fazerCadastro() {
    if (this.cadastroForm.invalid) {
      if (
        this.cadastroForm.get('nome')?.hasError('required') &&
        this.cadastroForm.get('email')?.hasError('required') &&
        this.cadastroForm.get('dataDeNascimento')?.hasError('required') &&
        this.cadastroForm.get('cns')?.hasError('required') &&
        this.cadastroForm.get('cpf')?.hasError('required') &&
        this.cadastroForm.get('telefone')?.hasError('required') &&
        this.cadastroForm.get('senha')?.hasError('required') &&
        this.cadastroForm.get('confirmarSenha')?.hasError('required')
      ) {
        this.presentarToast('Por favor, preencha todos os campos', 'danger');
        return;
      }

      if (this.cadastroForm.get('nome')?.hasError('required')) {
        this.presentarToast('Por favor, insira um nome válido', 'danger');
        return;
      }

      if (
        this.cadastroForm.get('email')?.hasError('email') ||
        this.cadastroForm.get('email')?.hasError('required')
      ) {
        this.presentarToast('Por favor, insira um email válido', 'danger');
        return;
      }

      if (this.cadastroForm.get('dataDeNascimento')?.hasError('required')) {
        this.presentarToast(
          'Por favor, insira uma data de nascimento válida',
          'danger'
        );
        return;
      }

      if (this.cadastroForm.get('cns')?.hasError('required')) {
        this.presentarToast('Por favor, insira um CNS válido', 'danger');
        return;
      }

      if (this.cadastroForm.get('cpf')?.hasError('required')) {
        this.presentarToast('Por favor, insira um CPF válido', 'danger');
        return;
      }

      if (this.cadastroForm.get('telefone')?.hasError('required')) {
        this.presentarToast('Por favor, insira um telefone válido', 'danger');
        return;
      }

      if (this.cadastroForm.get('senha')?.hasError('minlength')) {
        this.presentarToast(
          'A senha deve ter no mínimo 8 caracteres',
          'danger'
        );
        return;
      }

      if (this.cadastroForm.errors?.['senhasNaoConferem']) {
        this.presentarToast('As senhas não conferem', 'danger');
        return;
      }
    }

    const { confirmarSenha, ...dadosCadastro } = this.cadastroForm.value;

    const corpoDaRequisicao = {
      name: dadosCadastro.nome,
      email: dadosCadastro.email,
      password: dadosCadastro.senha,
      cns: dadosCadastro.cns,
      cpf: dadosCadastro.cpf,
      phone: dadosCadastro.telefone,
      birthDate: new Date(dadosCadastro.dataDeNascimento)
        .toISOString()
        .split('T')[0],
    };

    const url = API_BASE_URL + '/auth/register';

    this.isLoading = true;

    this.http.post(url, corpoDaRequisicao).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.presentarToast('Cadastro realizado com sucesso!', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        const mensagem =
          err.error?.message || 'Erro ao realizar cadastro. Tente novamente.';
        this.presentarToast(mensagem, 'danger');
      },
    });
  }

  async presentarToast(
    message: string,
    color: 'success' | 'danger' | 'warning'
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
    });
    await toast.present();
  }
}
