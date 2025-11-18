import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';

import { AppointmentCardComponent } from '../appointment-card/appointment-card.component';

import { Appointment } from '../appointment-card/appointment-card.component';

interface AgendamentoApi {
  _id: string;
  dateTime: string;
  type: string;
  status: string;
  user: string;
  doctor: { _id: string; name: string; specialty: string };
  healthUnit: { _id: string; name: string; address: string };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

import { API_BASE_URL } from 'src/app/shared/api.url';

@Component({
  selector: 'app-lista-agendamentos',
  templateUrl: './lista-agendamentos.component.html',
  styleUrls: ['./lista-agendamentos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    AppointmentCardComponent,
  ],
})
export class ListaAgendamentosComponent implements OnInit {
  @Input() titulo: string = 'Agendamentos';

  private readonly API_URL = API_BASE_URL;
  public agendamentosMaster: Appointment[] = [];
  public agendamentos: Appointment[] = [];
  public filtroStatusAtivo: string = 'Todos';
  public isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.carregarAgendamentos();
  }

  public carregarAgendamentos(event: any = null) {
    this.isLoading = true;
    const url = this.API_URL + '/appointments';

    this.http
      .get<AgendamentoApi[]>(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .subscribe({
        next: (dadosDaApi) => {
          const agendamentosFormatados = dadosDaApi.map(
            (apiItem): Appointment => {
              return {
                _id: apiItem._id,
                dateTime: apiItem.dateTime,
                type: apiItem.type,
                status: apiItem.status,
                doctor: apiItem.doctor,
                healthUnit: apiItem.healthUnit,
              };
            }
          );
          this.agendamentosMaster = agendamentosFormatados
            .sort((a, b) => {
              return (
                new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
              );
            })
            .sort((a, b) => {
              const statusOrder: Record<string, number> = {
                Pending: 1,
                Confirmed: 2,
                Cancelled: 3,
              };

              return (
                (statusOrder[a.status] ?? 999) - (statusOrder[b.status] ?? 999)
              );
            });
          this.aplicarFiltro();
          this.isLoading = false;
          if (event) event.target.complete();
        },
        error: (err) => {
          console.error('Erro ao buscar agendamentos', err);
          this.isLoading = false;
          if (event) event.target.complete();
          this.mostrarToast('Falha ao carregar agendamentos.', 'danger');
        },
      });
  }

  aplicarFiltro() {
    if (this.filtroStatusAtivo === 'Todos') {
      this.agendamentos = [...this.agendamentosMaster];
    } else {
      this.agendamentos = this.agendamentosMaster.filter(
        (a) => a.status === this.filtroStatusAtivo
      );
    }
  }

  selecionarFiltro(status: string) {
    this.filtroStatusAtivo = status;
    this.aplicarFiltro();
  }

  async promptCancelarAgendamento(appointmentId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Cancelamento',
      buttons: [
        { text: 'Não', role: 'cancel' },
        {
          text: 'Sim, cancelar',
          handler: () => this.executarCancelamento(appointmentId),
        },
      ],
    });
    await alert.present();
  }

  executarCancelamento(appointmentId: string) {
    this.isLoading = true;
    const url = `${this.API_URL}/appointments/${appointmentId}`;
    this.http
      .patch(
        url,
        { status: 'Cancelled' },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )
      .subscribe({
        next: async () => {
          this.mostrarToast('Agendamento cancelado com sucesso.', 'success');
          this.carregarAgendamentos();
        },
        error: async (err) => {
          const mensagem =
            err.error?.message || 'Erro ao cancelar agendamento.';
          this.mostrarToast(mensagem, 'danger');
          this.isLoading = false;
        },
      });
  }

  async promptRemoverAgendamento(appointmentId: string) {
    const alert = await this.alertController.create({
      header: 'Remover Agendamento',
      buttons: [
        { text: 'Não', role: 'cancel' },
        {
          text: 'Sim, remover',
          handler: () => this.executarRemocao(appointmentId),
        },
      ],
    });
    await alert.present();
  }

  executarRemocao(appointmentId: string) {
    const url = `${this.API_URL}/appointments/${appointmentId}`;
    this.http
      .delete(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .subscribe({
        next: async () => {
          this.mostrarToast('Agendamento removido do histórico.', 'success');
          this.agendamentosMaster = this.agendamentosMaster.filter(
            (a) => a._id !== appointmentId
          );
          this.aplicarFiltro();
        },
        error: async (err) => {
          const mensagem = err.error?.message || 'Erro ao remover agendamento.';
          this.mostrarToast(mensagem, 'danger');
        },
      });
  }

  async mostrarToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'top',
      color: color,
    });
    await toast.present();
  }
}
