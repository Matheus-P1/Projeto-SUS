import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    path: 'start',
    loadChildren: () =>
      import('./paginas/auth/start/start.module').then(
        (m) => m.StartPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./paginas/auth/login/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'esqueci-minha-senha',
    loadChildren: () =>
      import(
        './paginas/auth/esqueci-minha-senha/esqueci-minha-senha.module'
      ).then((m) => m.EsqueciMinhaSenhaPageModule),
  },
  {
    path: 'cadastro',
    loadChildren: () =>
      import('./paginas/auth/cadastro/cadastro.module').then(
        (m) => m.CadastroPageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./paginas/home/home.module').then((m) => m.HomePageModule),
    canActivate: [authGuard],
  },
  {
    path: 'servicos',
    loadComponent: () =>
      import('./paginas/servicos/servicos.page').then((m) => m.ServicosPage),
    canActivate: [authGuard],
  },
  {
    path: 'campanhas',
    loadComponent: () =>
      import('./paginas/campanhas/campanhas.page').then((m) => m.CampanhasPage),
    canActivate: [authGuard],
  },
  {
    path: 'minha-area',
    loadComponent: () =>
      import('./paginas/minha-area/minha-area.page').then(
        (m) => m.MinhaAreaPage
      ),
    canActivate: [authGuard],
  },
  {
    path: 'agendar-consulta',
    loadChildren: () =>
      import(
        './paginas/servicos/agendar-consulta/agendar-consulta.module'
      ).then((m) => m.AgendarConsultaPageModule),
    canActivate: [authGuard],
  },
  {
    path: 'meus-agendamentos',
    loadChildren: () =>
      import(
        './paginas/servicos/meus-agendamentos/meus-agendamentos.module'
      ).then((m) => m.MeusAgendamentosPageModule),
    canActivate: [authGuard],
  },
  {
    path: 'agendar-exames',
    loadChildren: () =>
      import('./paginas/servicos/agendar-exames/agendar-exames.module').then(
        (m) => m.AgendarExamesPageModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'resultados-exames',
    loadComponent: () =>
      import(
        './paginas/servicos/resultados-exames/resultados-exames.page'
      ).then((m) => m.ResultadosExamesPage),
    canActivate: [authGuard],
  },
  {
    path: 'atendimentos-internacoes',
    loadComponent: () =>
      import(
        './paginas/servicos/atendimentos-internacoes/atendimentos-internacoes.page'
      ).then((m) => m.AtendimentosInternacoesPage),
    canActivate: [authGuard],
  },
  {
    path: 'alergias',
    loadComponent: () =>
      import('./paginas/minha-area/alergias/alergias.page').then(
        (m) => m.AlergiasPage
      ),
    canActivate: [authGuard],
  },
];
