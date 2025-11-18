import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarraDeAbasComponent } from 'src/app/componentes/barra-de-abas/barra-de-abas.component';
import { CabecalhoComponent } from 'src/app/componentes/cabecalho/cabecalho.component';

import {
  IonFooter,
  IonHeader,
  IonContent,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-campanhas',
  templateUrl: './campanhas.page.html',
  styleUrls: ['./campanhas.page.scss'],
  standalone: true,
  imports: [
    BarraDeAbasComponent,
    CabecalhoComponent,
    IonFooter,
    CommonModule,
    IonHeader,
    IonContent,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
  ],
})
export class CampanhasPage {
  campaigns = [
    {
      title: 'Vacinação',
      subtitle: 'Vacinar é nossa força',
      image: 'assets/imagens/campanha-vacinacao.png',
      description:
        'O movimento Vacina Sempre Brasil tem foco prioritário na retomada das altas coberturas vacinais do país. A mobilização inclui a vacinação contra a Covid-19 e outras imunizações do Calendário Nacional de Vacinação em várias etapas. O movimento é uma das prioridades do Governo Federal para fortalecer o SUS e a cultura de vacinação no Brasil.',
    },
    {
      title: 'Doação de sangue',
      subtitle: 'Doe sangue. Por você e por outras vidas.',
      image: 'assets/imagens/campanha-sangue.png',
      description:
        'Doar sangue é um ato de solidariedade que salva milhões de vidas. O SUS depende de doações regulares para manter os estoques em níveis seguros, garantindo atendimento em cirurgias, emergências e tratamentos complexos. Esta campanha visa conscientizar a população sobre esse gesto simples, que não traz riscos ao doador e é vital para a saúde pública no Brasil.',
    },
    {
      title: 'Doação de Leite Humano',
      subtitle: 'Um gesto humanitário que alimenta esperança',
      image: 'assets/imagens/campanha-leite.png',
      description:
        'A doação de leite materno é fundamental para a recuperação de bebês prematuros e de baixo peso internados em UTIs neonatais. O leite doado passa por um rigoroso processo de pasteurização nos Bancos de Leite Humano, garantindo a qualidade. Esta mobilização busca ampliar o número de doadoras para fortalecer essa rede de solidariedade que salva vidas.',
    },
    {
      title: 'Mosquito',
      subtitle: 'Se pode ser dengue, pode ser grave.',
      image: 'assets/imagens/campanha-dengue.png',
      description:
        'O combate ao mosquito Aedes aegypti é uma responsabilidade de todos e a principal forma de prevenção contra a Dengue, Zika e Chikungunya. A campanha foca na eliminação de focos de água parada em residências e locais públicos. Fique atento aos primeiros sintomas, como febre alta e dor no corpo, e procure a unidade de saúde mais próxima.',
    },
  ];

  constructor() {}
}
