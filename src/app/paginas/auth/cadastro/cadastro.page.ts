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

const maskCns = (value: string): string => {
  if (!value) return value;
  let cleanValue = value.replace(/\D/g, '').substring(0, 15);
  let maskedValue = '';
  maskedValue = cleanValue.replace(
    /^(\d{3})(\d{4})(\d{4})(\d{4})$/,
    '$1 $2 $3 $4'
  );
  return maskedValue.length > 3 ? maskedValue : cleanValue;
};

const maskCpf = (value: string): string => {
  if (!value) return value;
  let cleanValue = value.replace(/\D/g, '').substring(0, 11);
  return cleanValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};

const maskTelefone = (value: string): string => {
  if (!value) return value;
  let cleanValue = value.replace(/\D/g, '').substring(0, 11);
  let maskedValue = '';

  if (cleanValue.length > 10) {
    maskedValue = cleanValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (cleanValue.length > 6) {
    maskedValue = cleanValue.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  } else if (cleanValue.length > 2) {
    maskedValue = cleanValue.replace(/^(\d{2})(\d+)$/, '($1) $2');
  } else if (cleanValue.length > 0) {
    maskedValue = cleanValue.replace(/^(\d+)$/, '($1');
  }
  return maskedValue.length > 0 ? maskedValue : cleanValue;
};

const CNS_PATTERN = /^(\d{3}\s?\d{4}\s?\d{4}\s?\d{4})$/;
const CPF_PATTERN = /^(\d{3}\.\d{3}\.\d{3}-\d{2})$/;
const TELEFONE_PATTERN = /^\(\d{2}\)\s?(\d{4,5}-\d{4})$/;
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
        cns: ['', [Validators.required, Validators.pattern(CNS_PATTERN)]],
        cpf: ['', [Validators.required, Validators.pattern(CPF_PATTERN)]],
        telefone: [
          '',
          [Validators.required, Validators.pattern(TELEFONE_PATTERN)],
        ],
        senha: ['', [Validators.required, Validators.minLength(8)]],
        confirmarSenha: ['', [Validators.required]],
      },
      {
        validators: senhasIguaisValidator,
      }
    );

    this.cns?.valueChanges.subscribe((value) => {
      const maskedValue = maskCns(value);
      if (maskedValue !== value) {
        this.cns?.setValue(maskedValue, { emitEvent: false });
      }
    });

    this.cpf?.valueChanges.subscribe((value) => {
      const maskedValue = maskCpf(value);
      if (maskedValue !== value) {
        this.cpf?.setValue(maskedValue, { emitEvent: false });
      }
    });

    this.telefone?.valueChanges.subscribe((value) => {
      const maskedValue = maskTelefone(value);
      if (maskedValue !== value) {
        this.telefone?.setValue(maskedValue, { emitEvent: false });
      }
    });
  }

  get nome() {
    return this.cadastroForm.get('nome');
  }
  get email() {
    return this.cadastroForm.get('email');
  }
  get dataDeNascimento() {
    return this.cadastroForm.get('dataDeNascimento');
  }
  get cns() {
    return this.cadastroForm.get('cns');
  }
  get cpf() {
    return this.cadastroForm.get('cpf');
  }
  get telefone() {
    return this.cadastroForm.get('telefone');
  }
  get senha() {
    return this.cadastroForm.get('senha');
  }
  get confirmarSenha() {
    return this.cadastroForm.get('confirmarSenha');
  }

  goBack() {
    this.location.back();
  }

  fazerCadastro() {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();

      if (this.nome?.invalid) {
        this.presentarToast('Por favor, insira um nome válido', 'danger');
        return;
      }
      if (this.email?.hasError('email') || this.email?.hasError('required')) {
        this.presentarToast('Por favor, insira um email válido', 'danger');
        return;
      }
      if (this.dataDeNascimento?.invalid) {
        this.presentarToast(
          'Por favor, insira uma data de nascimento válida',
          'danger'
        );
        return;
      }
      if (this.cns?.hasError('pattern')) {
        this.presentarToast(
          'Por favor, insira um CNS válido (15 dígitos)',
          'danger'
        );
        return;
      }
      if (this.cpf?.hasError('pattern')) {
        this.presentarToast('Por favor, insira um CPF válido', 'danger');
        return;
      }
      if (this.telefone?.hasError('pattern')) {
        this.presentarToast('Por favor, insira um telefone válido', 'danger');
        return;
      }
      if (this.senha?.hasError('minlength')) {
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

      this.presentarToast(
        'Por favor, preencha todos os campos corretamente',
        'danger'
      );
      return;
    }

    const { confirmarSenha, ...dadosCadastro } = this.cadastroForm.value;

    const cnsLimpo = dadosCadastro.cns.replace(/\s/g, '');
    const cpfLimpo = dadosCadastro.cpf.replace(/\D/g, '');
    const telefoneLimpo = dadosCadastro.telefone.replace(/\D/g, '');

    const corpoDaRequisicao = {
      name: dadosCadastro.nome,
      email: dadosCadastro.email,
      password: dadosCadastro.senha,
      cns: cnsLimpo,
      cpf: cpfLimpo,
      phone: telefoneLimpo,
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
