import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CargarPelisService } from '../Servicios/cargar-pelis.service';
import { ClasificacionService } from '../Servicios/clasificacion.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage{
  @Input() pelicula: any;
  ListasClasificacion: any[] = [];

  constructor(private modalController: ModalController, private clasificacion: ClasificacionService,private router : Router, private carga : CargarPelisService) {}

  ngOnInit() {
    this.actualizarClasificaciones();
  }
  actualizarClasificaciones() {
    this.ListasClasificacion = this.clasificacion.obtenerClasificaciones();
  }

  clasificarPelicula(clasificacion: string) {
    this.clasificacion.clasificar(this.pelicula, clasificacion);
    this.modalController.dismiss();
  }
  
  cerrar() {
    this.modalController.dismiss();
  }
  abrirGeolocalizacion(titulo : String) {
    this.carga.setTituloPeliculaSeleccionada(this.pelicula.titulo);
    this.router.navigate(['/tabs/tab3']); 
    this.modalController.dismiss(); 
  }

}
