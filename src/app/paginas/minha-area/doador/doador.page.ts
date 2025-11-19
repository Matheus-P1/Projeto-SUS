import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/shared/api.url';
import { SimpleHeaderModule } from 'src/app/componentes/simple-header/simple-header.module';

import {
  IonContent, 
  IonCard, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonButton,
  IonIcon, 
  IonLabel,
  AlertController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-doador',
  templateUrl: './doador.page.html',
  styleUrls: ['./doador.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule,  
    IonContent,
    IonCard, 
    IonGrid, 
    IonRow, 
    IonButton,
    IonCol,
    IonIcon, 
    IonLabel, 
    SimpleHeaderModule
  ]
})
export class DoadorPage implements OnInit {

  usuario = {
    nome: 'Carregando...',
    dataNascimento: '...' 
  };

  tipoSanguineo: string | null = null;

  constructor(
    private alertController: AlertController,
    private http: HttpClient,
    private router: Router   
  ) { }

  ngOnInit() {
    this.carregarDadosDoBanco();
  }

  ionViewWillEnter() {
    const salvo = localStorage.getItem('meu_tipo_sanguineo');
    if (salvo) {
      this.tipoSanguineo = salvo;
    }
  }

  carregarDadosDoBanco() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token não encontrado. Usuário não logado.');
      this.router.navigate(['/login']); 
      return;
    }

    const url = `${API_BASE_URL}/users/profile/me`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(url, { headers: headers }).subscribe({
      next: (resposta: any) => {
        this.usuario.nome = resposta.name;
        
        this.usuario.dataNascimento = this.formatarData(resposta.birthDate);
      },
      error: (err) => {
        console.error('Erro ao buscar dados do usuário na API', err);
        this.usuario.nome = 'Erro ao carregar';
      }
    });
  }

  formatarData(dataISO: string): string {
    if (!dataISO) return '...';
    try {
      const partes = dataISO.split('T')[0].split('-');
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    } catch (e) {
      return dataISO; 
    }
  }

  async adicionarTipoSanguineo() {
    const alert = await this.alertController.create({
      header: 'Adicionar Tipo Sanguíneo',
      message: 'Qual é o seu tipo sanguíneo?',
      inputs: [
        {
          name: 'tipo',
          type: 'text',
          placeholder: 'Ex: A+, O-'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: (data) => {
            if (data.tipo) {
              this.salvarLocalmente(data.tipo);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  salvarLocalmente(tipo: string) {
    this.tipoSanguineo = tipo.toUpperCase();
    localStorage.setItem('meu_tipo_sanguineo', this.tipoSanguineo);
  }
}