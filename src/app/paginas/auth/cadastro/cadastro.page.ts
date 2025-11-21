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

export const passwordComplexValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const senha = control.value || '';

  const isMinLength = senha.length >= 8;

  const hasUppercase = /[A-Z]+/.test(senha);

  const hasNumber = /[0-9]+/.test(senha);

  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(senha);

  const errors: ValidationErrors = {};

  if (!isMinLength) errors['minlength'] = true;
  if (!hasUppercase) errors['uppercase'] = true;
  if (!hasNumber) errors['number'] = true;
  if (!hasSpecialChar) errors['specialChar'] = true;

  return Object.keys(errors).length > 0 ? { passwordComplex: errors } : null;
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

  if (cleanValue.length > 10) {
    return cleanValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (cleanValue.length > 6) {
    return cleanValue.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  } else if (cleanValue.length > 2) {
    return cleanValue.replace(/^(\d{2})/, '($1) ');
  }
  return cleanValue;
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

  passwordRequirements = [
    { key: 'minlength', message: 'Mínimo 8 caracteres.', passed: false },
    {
      key: 'uppercase',
      message: 'Pelo menos 1 letra maiúscula.',
      passed: false,
    },
    { key: 'number', message: 'Pelo menos 1 número.', passed: false },
    {
      key: 'specialChar',
      message: 'Pelo menos 1 caractere especial (!@#$%^&*).',
      passed: false,
    },
  ];

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

        cns: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{3} [0-9]{4} [0-9]{4} [0-9]{4}$/),
          ],
        ],

        cpf: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/),
          ],
        ],

        telefone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\([0-9]{2}\) [0-9]{4,5}\-[0-9]{4}$/),
          ],
        ],

        senha: ['', [Validators.required, passwordComplexValidator]],
        confirmarSenha: ['', [Validators.required]],
      },
      {
        validators: senhasIguaisValidator,
      }
    );

    this.cadastroForm.get('senha')?.valueChanges.subscribe(() => {
      this.updatePasswordFeedback();
    });

    this.cadastroForm.get('cns')?.valueChanges.subscribe((value) => {
      const masked = maskCns(value);
      if (value !== masked) {
        this.cadastroForm.get('cns')?.setValue(masked, { emitEvent: false });
      }
    });

    this.cadastroForm.get('cpf')?.valueChanges.subscribe((value) => {
      const masked = maskCpf(value);
      if (value !== masked) {
        this.cadastroForm.get('cpf')?.setValue(masked, { emitEvent: false });
      }
    });

    this.cadastroForm.get('telefone')?.valueChanges.subscribe((value) => {
      const masked = maskTelefone(value);
      if (value !== masked) {
        this.cadastroForm
          .get('telefone')
          ?.setValue(masked, { emitEvent: false });
      }
    });
  }

  updatePasswordFeedback() {
    const senhaControl = this.cadastroForm.get('senha');
    const errors = senhaControl?.errors?.['passwordComplex'];

    this.passwordRequirements.forEach((req) => (req.passed = true));

    if (errors) {
      this.passwordRequirements.forEach((req) => {
        if (errors[req.key]) {
          req.passed = false;
        }
      });
    }
  }

  get senhaControl() {
    return this.cadastroForm.get('senha');
  }

  goBack() {
    this.location.back();
  }

  fazerCadastro() {
    this.cadastroForm.markAllAsTouched();

    if (this.cadastroForm.invalid) {
      if (this.senhaControl?.errors?.['passwordComplex']) {
        this.presentarToast(
          'A senha não cumpre todos os requisitos de segurança.',
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
        this.cadastroForm.setValue({
          nome: '',
          email: '',
          dataDeNascimento: '',
          cns: '',
          cpf: '',
          telefone: '',
          senha: '',
          confirmarSenha: '',
        });
        this.passwordRequirements.forEach((req) => (req.passed = false));
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
