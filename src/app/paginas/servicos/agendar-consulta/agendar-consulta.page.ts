import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/shared/api.url';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

interface MedicoApiResponse {
  _id: string;
  name: string;
  crm: string;
  specialty: string;
  healthUnit: {
    _id: string;
    name: string;
    address: string;
  };
  availability: { _id: string; date: string; times: string[] }[];
}

export interface SelectedTime {
  time: string;
  id: string;
  item: string;
}

interface Medico {
  _id: string;
  name: string;
  crm: string;
  specialty: string;
  healthUnit: {
    _id: string;
    name: string;
    address: string;
  };
  availability: SelectedTime[];
}

@Component({
  selector: 'app-agendar-consulta',
  templateUrl: './agendar-consulta.page.html',
  styleUrls: ['./agendar-consulta.page.scss'],
  standalone: false,
})
export class AgendarConsultaPage implements OnInit, OnDestroy {
  private readonly API_URL = API_BASE_URL;
  especialidade: string = '';
  profissional: string = '';

  medicosParaRenderizar: Medico[] = [];
  medicosDaApi: MedicoApiResponse[] = [];

  selectedMedico: Medico | null = null;
  selectedHorario: SelectedTime | null = null;

  private filterTimer: any;

  disabled: boolean = false;
  isLoading: boolean = false;
  isLoadingAgendarConsulta: boolean = false;

  constructor(
    private alertController: AlertController,
    private location: Location,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.getDoctors();
  }

  ngOnDestroy() {
    this.especialidade = '';
    this.profissional = '';

    this.medicosParaRenderizar = [];
    this.selectedMedico = null;
    this.selectedHorario = null;

    clearTimeout(this.filterTimer);
  }

  getDoctors() {
    const url = this.API_URL + '/doctors';
    this.isLoading = true;
    this.http
      .get<any>(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .subscribe({
        next: (response: MedicoApiResponse[]) => {
          this.medicosParaRenderizar = response.map(
            (doc: MedicoApiResponse) => ({
              _id: doc._id,
              crm: doc.crm,
              name: doc.name,
              specialty: doc.specialty,
              healthUnit: doc.healthUnit,
              availability: doc.availability
                .map((slot) =>
                  slot.times.map((time) => ({
                    id: slot._id,
                    time: time,
                    item: `${this.formatarData(
                      slot.date
                    )} - ${this.formatarHora(time)}`,
                  }))
                )
                .flat(),
            })
          );
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }

  goBack() {
    this.location.back();
  }

  onFilterChange() {
    clearTimeout(this.filterTimer);

    this.filterTimer = setTimeout(() => {
      this.buscar();
    }, 300);
  }

  buscar() {
    this.selectedHorario = null;
    this.selectedMedico = null;

    if (!this.especialidade && !this.profissional) {
      this.getDoctors();
      return;
    }

    const especialidadeFiltro = this.especialidade.toLowerCase();
    const profissionalFiltro = this.profissional.toLowerCase();

    const medicosFiltrados = this.medicosParaRenderizar.filter((m) => {
      const matchEspecialidade =
        !this.especialidade ||
        m.specialty.toLowerCase().includes(especialidadeFiltro);

      const matchProfissional =
        !this.profissional || m.name.toLowerCase().includes(profissionalFiltro);

      return matchEspecialidade && matchProfissional;
    });

    this.medicosParaRenderizar = medicosFiltrados;
  }
  onHorarioSelecionado(medico: Medico, horario: SelectedTime) {
    this.selectedMedico = medico;
    this.selectedHorario = horario;
  }

  async exibirAlerta(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async agendar() {
    if (!this.selectedMedico || !this.selectedHorario) {
      this.exibirAlerta('Por favor, selecione um profissional e um horário.');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Agendamento',
      message: `
        Deseja agendar com ${this.selectedMedico.name}
        na: ${this.selectedHorario.item}?
      `,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: async () => {
            await this.agendarConsulta({
              medico: this.selectedMedico!,
              horario: this.selectedHorario!,
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async agendarConsulta(parametros: { medico: Medico; horario: SelectedTime }) {
    const url = this.API_URL + '/appointments';
    this.isLoadingAgendarConsulta = true;
    this.http
      .post<any>(
        url,
        {
          type: 'Consulta',
          doctorId: parametros.medico._id,
          healthUnitId: parametros.medico.healthUnit._id,
          availabilityId: parametros.horario.id,
          time: parametros.horario.time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .subscribe({
        next: async (response: any) => {
          this.isLoadingAgendarConsulta = false;
          const toast = await this.toastController.create({
            message: 'Consulta agendada com sucesso!',
            duration: 2000,
            position: 'top',
            color: 'success',
          });

          await toast.present();
          this.selectedHorario = null;
          this.selectedMedico = null;
          this.especialidade = '';
          this.profissional = '';
          this.router.navigate(['/home']);
        },
        error: async (err) => {
          this.isLoadingAgendarConsulta = false;
          const mensagem =
            err.error?.message || 'Erro ao agendar consulta. Tente novamente.';

          const toast = await this.toastController.create({
            message: mensagem,
            duration: 2000,
            position: 'top',
            color: 'danger',
          });

          await toast.present();
        },
      });
  }

  formatarData(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00Z');

    const weekday = date
      .toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' })
      .replace('.', '');
    const day = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      timeZone: 'UTC',
    });
    const month = date.toLocaleDateString('pt-BR', {
      month: '2-digit',
      timeZone: 'UTC',
    });

    const weekdayCapitalized =
      weekday.charAt(0).toUpperCase() + weekday.slice(1);

    return `${weekdayCapitalized}, ${day}/${month}`;
  }

  formatarHora(timeString: string): string {
    return timeString.replace(':', 'h');
  }
}
