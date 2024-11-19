import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClasificacionService } from '../Servicios/clasificacion.service';

@Component({
  selector: 'app-nueva-clasificacion',
  templateUrl: './nueva-clasificacion.page.html',
  styleUrls: ['./nueva-clasificacion.page.scss'],
})
export class NuevaClasificacionPage {

  nuevaClasificacion: string = '';

  constructor(private modalController: ModalController, private clasificacionService: ClasificacionService) {}

  cerrar() {
    this.modalController.dismiss();
  }

  agregarClasificacion() {
    if (this.nuevaClasificacion.trim()) {
      this.clasificacionService.agregarClasificacion(this.nuevaClasificacion);
      this.modalController.dismiss(this.nuevaClasificacion);
    }
  }

}
