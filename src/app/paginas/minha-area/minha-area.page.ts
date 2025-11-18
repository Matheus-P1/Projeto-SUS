import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import {
  IonHeader,
  IonContent,
  IonFooter,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonLabel,
  IonItem,
} from '@ionic/angular/standalone';

import { CabecalhoComponent } from '../../componentes/cabecalho/cabecalho.component';
import { BarraDeAbasComponent } from '../../componentes/barra-de-abas/barra-de-abas.component';
import { API_BASE_URL } from 'src/app/shared/api.url';

@Component({
  selector: 'app-minha-area',
  templateUrl: './minha-area.page.html',
  styleUrls: ['./minha-area.page.scss'],
  standalone: true,
  
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonHeader,
    IonContent,
    IonFooter,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonLabel,
    IonItem,
    CabecalhoComponent,
    BarraDeAbasComponent
  ]
})
export class MinhaAreaPage implements OnInit {

  userInfo = {
    nome: 'Carregando...',
    cns: 'Carregando...',
    cpf: '...',
    dataNascimento: '...',
    telefone: '...',
    racaCor: '...',
    sexo: '...',
    email: 'Carregando...'
  };
  
  actionItems = [
    { id: 'cartao-vacina', name: 'Cartão de vacina', icon: 'document-attach-outline', route: '/cartao-vacina' },
    { id: 'carteirinha-doador', name: 'Carteirinha de doador', icon: 'card-outline', route: '/doador' },
    { id: 'medicamentos', name: 'Meus medicamentos', icon: 'medkit-outline', route: '/medicamentos' },
    { id: 'alergias', name: 'Minhas Alergias', icon: 'bug-outline', route: '/alergias' },
    { id: 'diario', name: 'Diário da saúde', icon: 'book-outline', route: '/diario-saude' }
  ];

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Usuário não logado! Token não encontrado.');
      this.router.navigate(['/login']);
      return;
    }

    const url = `${API_BASE_URL}/auth/me`; 

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(url, { headers: headers }).subscribe({
      next: (resposta: any) => {
        console.log('Dados do usuário recebidos:', resposta);

        this.userInfo.nome = resposta.name;
        this.userInfo.cns = resposta.cns;
        this.userInfo.cpf = resposta.cpf;
        this.userInfo.email = resposta.email;
        this.userInfo.telefone = resposta.phone;
        this.userInfo.dataNascimento = this.formatarData(resposta.birthDate);

        this.userInfo.sexo = resposta.sexo || 'Não informado'; 
        this.userInfo.racaCor = resposta.racaCor || 'Não informada';

      },
      error: (err) => {
        console.error('Erro ao buscar dados do usuário', err);
        this.userInfo.nome = 'Erro ao carregar dados';
      }
    });
  }

  formatarData(dataISO: string): string {
    if (!dataISO) return '...';
    const partes = dataISO.split('T')[0].split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  onActionClick(route: string) {
    if (route) {
      console.log('Navegando para:', route);
      this.router.navigate([route]);
    } else {
      console.warn('Nenhuma rota definida para este item.');
    }
  }

}