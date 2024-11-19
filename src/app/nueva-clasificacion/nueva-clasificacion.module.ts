import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaClasificacionPageRoutingModule } from './nueva-clasificacion-routing.module';

import { NuevaClasificacionPage } from './nueva-clasificacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevaClasificacionPageRoutingModule
  ],
  declarations: [NuevaClasificacionPage]
})
export class NuevaClasificacionPageModule {}
