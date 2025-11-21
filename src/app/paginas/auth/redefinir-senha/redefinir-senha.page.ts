import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { API_BASE_URL } from 'src/app/shared/api.url';
import { HttpClient } from '@angular/common/http';

export const senhasIguaisValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const novaSenha = control.get('novaSenha');
  const confirmarNovaSenha = control.get('confirmarNovaSenha');
  return novaSenha &&
    confirmarNovaSenha &&
    novaSenha.value !== confirmarNovaSenha.value
    ? { senhasNaoConferem: true }
    : null;
};

export const passwordComplexValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const senha = control.value || '';

  const isDifferentFromCurrent = true;

  const isMinLength = senha.length >= 8;

  const hasUppercase = /[A-Z]+/.test(senha);

  const hasNumber = /[0-9]+/.test(senha);

  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(senha);

  const errors: ValidationErrors = {};

  if (!isMinLength) errors['minlength'] = true;
  if (!hasUppercase) errors['uppercase'] = true;
  if (!hasNumber) errors['number'] = true;
  if (!hasSpecialChar) errors['specialChar'] = true;
  if (!isDifferentFromCurrent) errors['differentFromCurrent'] = true;

  return Object.keys(errors).length > 0 ? { passwordComplex: errors } : null;
};

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.page.html',
  styleUrls: ['./redefinir-senha.page.scss'],
  standalone: false,
})
export class RedefinirSenhaPage implements OnInit {
  redefinirSenhaForm!: FormGroup;
  isLoading = false;

  passwordRequirements = [
    {
      key: 'differentFromCurrent',
      message: 'A nova senha deve ser diferente da senha atual.',
      passed: false,
    },
    {
      key: 'minlength',
      message: 'A nova senha deve conter, no mínimo, 8 caracteres.',
      passed: false,
    },
    {
      key: 'uppercase',
      message: 'Deve incluir pelo menos uma letra maiúscula.',
      passed: false,
    },
    {
      key: 'number',
      message: 'Deve conter pelo menos um número.',
      passed: false,
    },
    {
      key: 'specialChar',
      message: 'Deve conter pelo menos um caractere especial.',
      passed: false,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private location: Location,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.redefinirSenhaForm = this.fb.group(
      {
        novaSenha: ['', [Validators.required, passwordComplexValidator]],
        confirmarNovaSenha: ['', [Validators.required]],
      },
      {
        validators: senhasIguaisValidator,
      }
    );

    this.novaSenhaControl?.valueChanges.subscribe(() => {
      this.updatePasswordFeedback();
    });
  }

  get novaSenhaControl() {
    return this.redefinirSenhaForm.get('novaSenha');
  }

  get confirmarNovaSenhaControl() {
    return this.redefinirSenhaForm.get('confirmarNovaSenha');
  }

  updatePasswordFeedback() {
    const errors = this.novaSenhaControl?.errors?.['passwordComplex'];

    this.passwordRequirements.forEach((req) => (req.passed = true));

    if (errors) {
      this.passwordRequirements.forEach((req) => {
        if (errors[req.key]) {
          req.passed = false;
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }

  redefinirSenha() {
    if (this.redefinirSenhaForm.invalid) {
      this.redefinirSenhaForm.markAllAsTouched();

      if (this.redefinirSenhaForm.errors?.['senhasNaoConferem']) {
        this.presentarToast('As senhas não conferem.', 'danger');
        return;
      }
      if (this.novaSenhaControl?.errors?.['passwordComplex']) {
        this.presentarToast(
          'A senha não cumpre todos os requisitos de segurança.',
          'danger'
        );
        return;
      }

      this.presentarToast(
        'Por favor, preencha todos os campos corretamente.',
        'danger'
      );
      return;
    }

    const { novaSenha } = this.redefinirSenhaForm.value;

    const url = API_BASE_URL + '/auth/reset';

    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token_redefinição');

    this.isLoading = true;
    this.http
      .post<any>(url, {
        email,
        code: token,
        newPassword: novaSenha,
      })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;

          this.redefinirSenhaForm.setValue({
            novaSenha: '',
            confirmarNovaSenha: '',
          });

          this.presentarToast(response.message, 'success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const message =
            err?.error?.message ||
            'Ocorreu algum erro, tente novamente mais tarde!';
          this.isLoading = false;
          this.presentarToast(message, 'danger');
        },
      });
  }

  async presentarToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
    });
    await toast.present();
  }
}
