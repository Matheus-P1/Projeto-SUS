import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';
import { API_BASE_URL } from 'src/app/shared/api.url';
import { ExamSchedule } from '../exam-card/exam-card.component';

@Component({
  selector: 'app-lista-exames',
  templateUrl: './lista-exames.component.html',
  styleUrls: ['./lista-exames.component.scss'],
  standalone: false,
})
export class ListaExamesComponent implements OnInit {
  @Input() titulo: string = 'Exames Agendados';

  private readonly API_URL = API_BASE_URL;
  public examesMaster: ExamSchedule[] = [];
  public examesExibidos: ExamSchedule[] = [];
  public filtroStatusAtivo: string = 'Todos';
  public isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.carregarExames();
  }

  public carregarExames(event: any = null) {
    this.isLoading = true;
    const url = `${this.API_URL}/exams`;

    this.http
      .get<ExamSchedule[]>(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .subscribe({
        next: (data) => {
          this.examesMaster = data.sort(
            (a, b) =>
              new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
          );
          this.aplicarFiltro();
          this.isLoading = false;
          if (event) event.target.complete();
        },
        error: (err) => {
          console.error('Erro exames', err);
          this.isLoading = false;
          if (event) event.target.complete();
          this.mostrarToast('Erro ao carregar exames.', 'danger');
        },
      });
  }

  aplicarFiltro() {
    if (this.filtroStatusAtivo === 'Todos') {
      this.examesExibidos = [...this.examesMaster];
    } else {
      this.examesExibidos = this.examesMaster.filter(
        (e) => e.status === this.filtroStatusAtivo
      );
    }
  }

  selecionarFiltro(status: string) {
    this.filtroStatusAtivo = status;
    this.aplicarFiltro();
  }

  async promptCancelar(id: string) {
    const alert = await this.alertController.create({
      header: 'Cancelar Exame',
      message: 'Tem certeza que deseja cancelar este exame?',
      buttons: [
        { text: 'Não', role: 'cancel' },
        { text: 'Sim', handler: () => this.executarAcao(id, 'cancel') },
      ],
    });
    await alert.present();
  }

  async promptRemover(id: string) {
    const alert = await this.alertController.create({
      header: 'Remover do Histórico',
      message: 'Deseja remover este exame da lista?',
      buttons: [
        { text: 'Não', role: 'cancel' },
        { text: 'Sim', handler: () => this.executarAcao(id, 'delete') },
      ],
    });
    await alert.present();
  }

  executarAcao(id: string, action: 'cancel' | 'delete') {
    const url = `${this.API_URL}/exams/${id}`;

    const request =
      action === 'delete'
        ? this.http.delete(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
        : this.http.patch(
            url,
            { status: 'Cancelled' },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );

    request.subscribe({
      next: () => {
        this.mostrarToast(
          action === 'delete'
            ? 'Removido com sucesso'
            : 'Cancelado com sucesso',
          'success'
        );
        if (action === 'delete') {
          this.examesMaster = this.examesMaster.filter((e) => e._id !== id);
          this.aplicarFiltro();
        } else {
          this.carregarExames();
        }
      },
      error: () => this.mostrarToast('Erro ao processar ação.', 'danger'),
    });
  }

  async mostrarToast(msg: string, color: string) {
    const t = await this.toastController.create({
      message: msg,
      duration: 2500,
      color,
      position: 'top',
    });
    t.present();
  }
}
