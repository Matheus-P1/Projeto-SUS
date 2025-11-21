import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidarTokenPage } from './validar-token.page';

const routes: Routes = [
  {
    path: '',
    component: ValidarTokenPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidarTokenPageRoutingModule {}
