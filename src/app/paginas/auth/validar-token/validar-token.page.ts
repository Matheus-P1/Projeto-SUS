import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/shared/api.url';
export const tokenValidator = (
  control: AbstractControl
): { [key: string]: any } | null => {
  const value = control.value;
  if (!value) {
    return null;
  }

  const cleanValue = value.replace(/\s/g, '');
  return cleanValue.length === 6 && /^\d+$/.test(cleanValue)
    ? null
    : { tokenInvalido: true };
};

@Component({
  selector: 'app-validar-token',
  templateUrl: './validar-token.page.html',
  styleUrls: ['./validar-token.page.scss'],
  standalone: false,
})
export class ValidarTokenPage implements OnInit {
  tokenForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private router: Router,
    private location: Location,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.tokenForm = this.fb.group({
      token: [
        '',
        [Validators.required, Validators.pattern(/^\d{6}$/), tokenValidator],
      ],
    });
  }

  get tokenControl() {
    return this.tokenForm.get('token');
  }

  goBack() {
    this.location.back();
  }

  validarToken() {
    if (this.tokenForm.invalid) {
      this.tokenForm.markAllAsTouched();
      this.presentarToast(
        'Por favor, insira o código de 6 dígitos completo.',
        'danger'
      );
      return;
    }

    const token = this.tokenForm.value.token;

    const url = API_BASE_URL + '/auth/validate-code';

    const email = localStorage.getItem('email');

    this.isLoading = true;

    this.http
      .post<any>(url, {
        email,
        code: token,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          this.tokenForm.setValue({
            token: '',
          });

          this.presentarToast(response.message, 'success');
          this.router.navigate(['/redefinir-senha']);
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
