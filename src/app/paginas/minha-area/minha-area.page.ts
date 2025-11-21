import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpClientModule,
} from '@angular/common/http';
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
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  createOutline,
  documentAttachOutline,
  cardOutline,
  medkitOutline,
  bugOutline,
  bookOutline
} from 'ionicons/icons';

import { BarraDeAbasComponent } from '../../componentes/barra-de-abas/barra-de-abas.component';
import { API_BASE_URL } from 'src/app/shared/api.url';
import { CabecalhoComponent } from 'src/app/componentes/cabecalho/cabecalho.component';

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
    BarraDeAbasComponent,
    CabecalhoComponent,
  ],
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
    email: 'Carregando...',
  };

  actionItems = [
    {
      id: 'cartao-vacina',
      name: 'Cartão de vacina',
      icon: 'document-attach-outline',
      route: '/cartao-vacina',
      disabled: true,
    },
    {
      id: 'carteirinha-doador',
      name: 'Carteirinha de doador',
      icon: 'card-outline',
      route: '/doador',
    },
    {
      id: 'medicamentos',
      name: 'Meus medicamentos',
      icon: 'medkit-outline',
      route: '/medicamentos',
    },
    {
      id: 'alergias',
      name: 'Minhas Alergias',
      icon: 'bug-outline',
      route: '/alergias',
    },
    {
      id: 'diario',
      name: 'Diário da saúde',
      icon: 'book-outline',
      route: '/diario-saude',
    },
  ];

  constructor(
    private router: Router, 
    private http: HttpClient,
    private alertController: AlertController
  ) {
    addIcons({ 
      createOutline,
      documentAttachOutline,
      cardOutline,
      medkitOutline,
      bugOutline,
      bookOutline
    });
  }

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

    const url = `${API_BASE_URL}/users/profile/me`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get(url, { headers: headers }).subscribe({
      next: (resposta: any) => {
        const algunsDadosFormatados = this.formatarDadosParaVisualizacao({
          cns: resposta.cns,
          cpf: resposta.cpf,
          telefone: resposta.phone,
          dataNascimento: resposta.birthDate,
        });

        this.userInfo.nome = resposta.name;
        this.userInfo.cns = algunsDadosFormatados.cnsFormatado;
        this.userInfo.cpf = algunsDadosFormatados.cpfFormatado;
        this.userInfo.email = resposta.email;
        this.userInfo.telefone = algunsDadosFormatados.telefoneFormatado;
        this.userInfo.dataNascimento = algunsDadosFormatados.dataNascimentoFormatado;

        const sexoSalvo = localStorage.getItem('user_sexo_local');

        if (sexoSalvo) {
          this.userInfo.sexo = sexoSalvo;
        } else {
          this.userInfo.sexo = resposta.sexo || 'Não informado';
        }
        
        this.userInfo.racaCor = resposta.racaCor || 'Não informada';
      },
      error: (err) => {
        console.error('Erro ao buscar dados do usuário', err);
        this.userInfo.nome = 'Erro ao carregar dados';
      },
    });
  }

  async alterarSexo() {
    const alert = await this.alertController.create({
      header: 'Selecione o Sexo',
      inputs: [
        { label: 'Masculino', type: 'radio', value: 'Masculino', checked: this.userInfo.sexo === 'Masculino' },
        { label: 'Feminino', type: 'radio', value: 'Feminino', checked: this.userInfo.sexo === 'Feminino' },
        { label: 'Outro', type: 'radio', value: 'Outro', checked: this.userInfo.sexo === 'Outro' },
        { label: 'Prefiro não informar', type: 'radio', value: 'Não informado', checked: this.userInfo.sexo === 'Não informado' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Salvar', 
          handler: (valorSelecionado) => {
            if (valorSelecionado) {
              this.userInfo.sexo = valorSelecionado;
              localStorage.setItem('user_sexo_local', valorSelecionado);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // --- Formatadores ---
  formatarCpf(cpf: string): string {
    if (!cpf) return '';
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) {
      return cpf;
    }
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarCns(cns: string): string {
    if (!cns) return '';
    const digits = cns.replace(/\D/g, '');
    if (digits.length !== 15) {
      return cns;
    }
    return digits.replace(/(\d{3})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
  }

  formatarTelefone(telefone: string): string {
    if (!telefone) return '';
    const digits = telefone.replace(/\D/g, '');
    if (digits.length === 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (digits.length === 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  }

  formatarDadosParaVisualizacao(dados: {
    cns: string;
    cpf: string;
    telefone: string;
    dataNascimento: string;
  }): {
    cnsFormatado: string;
    cpfFormatado: string;
    telefoneFormatado: string;
    dataNascimentoFormatado: string;
  } {
    return {
      cnsFormatado: this.formatarCns(dados.cns),
      cpfFormatado: this.formatarCpf(dados.cpf),
      telefoneFormatado: this.formatarTelefone(dados.telefone),
      dataNascimentoFormatado: this.formatarData(dados.dataNascimento),
    };
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