import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaClasificacionPage } from './nueva-clasificacion.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaClasificacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaClasificacionPageRoutingModule {}
