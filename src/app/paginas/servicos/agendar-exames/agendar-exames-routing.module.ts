import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendarExamesPage } from './agendar-exames.page';

const routes: Routes = [
  {
    path: '',
    component: AgendarExamesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendarExamesPageRoutingModule {}
