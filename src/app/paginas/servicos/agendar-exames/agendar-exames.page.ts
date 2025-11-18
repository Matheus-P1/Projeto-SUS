import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';

import { ApiSelectOption } from 'src/app/componentes/api-select/api-select.component';
import { API_BASE_URL } from 'src/app/shared/api.url';

interface ApiExamTypes {
  examId: string;
  examName: string;
  availability: {
    date: string;
    times: string[];
    _id: string;
  }[];
  _id: string;
}

interface ApiHealthUnits {
  _id: string;
  name: string;
  address: string;
  availableExams: string[];
}

@Component({
  selector: 'app-agendar-exames',
  templateUrl: './agendar-exames.page.html',
  styleUrls: ['./agendar-exames.page.scss'],
  standalone: false,
})
export class AgendarExamesPage implements OnInit {
  private readonly API_URL = API_BASE_URL;
  tipoExame: string = '';
  unidade: string = '';

  arquivoGuia: File | null = null;
  nomeArquivoGuia: string = 'Carregar arquivo';

  myForm!: FormGroup;

  listaDeExamsFromApi: ApiExamTypes[] = [];
  listaDeExames: ApiSelectOption[] = [];
  listaDeUnidades: ApiSelectOption[] = [];
  listaDeHorarios: ApiSelectOption[] = [];
  isLoadingExames: boolean = false;
  isLoadingUnidades: boolean = false;
  isLoadingHorarios: boolean = false;
  isLoadingAgendamento: boolean = false;

  constructor(
    private toastController: ToastController,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      unidade: [null, [Validators.required]],
      exame: [{ value: null, disabled: true }, [Validators.required]],
      horario: [{ value: null, disabled: true }, [Validators.required]],
      guia: [null, [Validators.required]],
    });

    this.myForm.get('unidade')?.valueChanges.subscribe((unidadeId) => {
      const exameControl = this.myForm.get('exame');

      exameControl?.setValue(null);

      if (unidadeId) {
        exameControl?.enable();
        this.carregarExames();
      } else {
        exameControl?.disable();
        this.listaDeExames = [];
      }
    });

    this.myForm.get('exame')?.valueChanges.subscribe((exameId) => {
      const horarioControl = this.myForm.get('horario');

      horarioControl?.setValue(null);

      if (exameId && this.listaDeExamsFromApi.length > 0) {
        horarioControl?.enable();
        this.carregarHorarios(this.listaDeExamsFromApi);
      } else {
        horarioControl?.disable();
        this.listaDeHorarios = [];
      }
    });

    this.carregarUnidade();
  }

  carregarUnidade() {
    this.isLoadingUnidades = true;
    const url = this.API_URL + '/health-units/with-exams';

    this.http
      .get<ApiHealthUnits[]>(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .subscribe({
        next: (response) => {
          this.isLoadingUnidades = false;
          this.listaDeUnidades = response.map((unit) => ({
            text: unit.name,
            value: unit._id,
          }));
        },
        error: (_) => {
          this.isLoadingUnidades = false;
          this.presentarToast(
            'Erro ao carregar unidades de saúde. Tente novamente mais tarde.',
            'danger'
          );
        },
      });
  }

  carregarHorarios(exames: ApiExamTypes[]) {
    this.isLoadingHorarios = true;

    const exameId = this.myForm.get('exame')?.value;

    const exameSelecionado = exames.find((exam) => exam.examId === exameId);

    if (!exameSelecionado) {
      this.isLoadingHorarios = false;
      return;
    }

    const horarios: ApiSelectOption[] = [];

    exameSelecionado.availability.forEach((availability) => {
      availability.times.forEach((time) => {
        const date = new Date(availability.date);

        const formatedDate = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        const formatedHour = new Date(`1970-01-01T${time}Z`).toLocaleTimeString(
          'pt-BR',
          {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC',
          }
        );

        horarios.push({
          text: `${formatedDate} - ${formatedHour}`,
          value: `${availability._id}|${time}`,
        });
      });
    });

    this.listaDeHorarios = horarios;
    this.isLoadingHorarios = false;
  }

  carregarExames() {
    this.isLoadingExames = true;

    const unidadeId = this.myForm.get('unidade')?.value;

    if (!unidadeId) {
      this.isLoadingExames = false;
      return;
    }

    const url = this.API_URL + `/health-units/${unidadeId}/exams`;

    this.http
      .get<ApiExamTypes[]>(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .subscribe({
        next: (response) => {
          this.isLoadingExames = false;
          this.listaDeExamsFromApi = response;
          this.listaDeExames = response.map((exam) => ({
            text: exam.examName,
            value: exam.examId,
          }));
          this.isLoadingExames = false;
        },
        error: (_) => {
          this.isLoadingExames = false;
          this.presentarToast(
            'Erro ao carregar tipos de exames. Tente novamente mais tarde.',
            'danger'
          );
        },
      });
  }

  getExameSelectErrorMessage() {
    const control = this.myForm.get('exame');
    if (control && control.touched && control.hasError('required')) {
      return 'Você precisa selecionar um exame.';
    }
    return null;
  }

  getUnidadeSelectErrorMessage() {
    const control = this.myForm.get('unidade');
    if (control && control.touched && control.hasError('required')) {
      return 'Você precisa selecionar uma unidade de saúde.';
    }
    return null;
  }

  getHorarioSelectErrorMessage() {
    const control = this.myForm.get('horario');
    if (control && control.touched && control.hasError('required')) {
      return 'Você precisa selecionar um horário para o exame.';
    }
    return null;
  }

  criarAgendamento() {
    const url = this.API_URL + '/exams';
    this.isLoadingAgendamento = true;

    const exameId = this.myForm.get('exame')?.value;
    const horarioId = this.myForm.get('horario')?.value?.split('|')[0];
    const time = this.myForm.get('horario')?.value?.split('|')[1];
    const unidadeId = this.myForm.get('unidade')?.value;

    const body = {
      healthUnitId: unidadeId,
      availabilityId: horarioId,
      time: time,
      examId: exameId,
    };

    this.http
      .post<any>(url, body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .subscribe({
        next: async () => {
          this.isLoadingAgendamento = false;
          await this.presentarToast('Exame agendado com sucesso!', 'success');
          this.myForm.get('horario')?.setValue(null);
          this.myForm.get('exame')?.setValue(null);
          this.myForm.get('unidade')?.setValue(null);
          this.myForm.get('guia')?.setValue(null);
          this.arquivoGuia = null;
          this.nomeArquivoGuia = 'Anexar foto da guia';
          this.router.navigate(['/meus-agendamentos']);
        },
        error: async (err) => {
          this.isLoadingAgendamento = false;

          const mensagem =
            err.error?.message || 'Erro ao agendar exame. Tente novamente.';

          await this.presentarToast(mensagem, 'danger');
        },
      });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.myForm.patchValue({ guia: file });
      this.arquivoGuia = file;
      this.nomeArquivoGuia = file.name;
    }
  }

  agendar() {
    if (this.myForm.invalid) {
      if (this.myForm.get('exame')?.hasError('required')) {
        this.presentarToast('Por favor, informe o tipo de exame.', 'danger');
      } else if (this.myForm.get('guia')?.hasError('required')) {
        this.presentarToast('Por favor, anexe a foto da guia.', 'danger');
      } else if (this.myForm.get('unidade')?.hasError('required')) {
        this.presentarToast('Por favor, escolha uma unidade.', 'danger');
      } else {
        this.presentarToast('Por favor, preencha todos os campos.', 'danger');
      }
      return;
    }
  }

  async presentarToast(
    mensagem: string,
    color: 'success' | 'danger' | 'warning'
  ) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }
}
