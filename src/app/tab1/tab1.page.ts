import { Component, OnInit } from '@angular/core';
import { CargarPelisService } from '../Servicios/cargar-pelis.service';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  //Arrays donde guardamos las peliculas iniciales y las obtenidas por filtros
  peliculas: any[] = [];
  peliculasFiltradas: any[] = [];
  
  // Variables para filtros
  buscarTexto: string = '';
  generoSeleccionado: string = '';
  FechaLanzamiento: number | null = null;

  // Array de géneros que se usará en el select
  generos: string[] = [
    "Horror",
    "Supernatural",
    "Action",
    "Science Fiction",
    "Comedy",
    "Drama",
    "Crime",
    "Mystery",
    "Thriller",
    "Adventure",
    "Fantasy",
    "Teen",
    "Romance",
    "Superhero",
    "Historical",
    "Political",
    "Family",
    "Sports",
    "Spy",
    "Biography",
    "Musical",
    "Animated"
  ];

  constructor(private cargar: CargarPelisService, private modal: ModalController) {} //Injectamos el servicio y modal controler para el modal

  ngOnInit() {
    // Cargar todas las películas al inicio
    this.cargar.getPeliculas().subscribe((data) => {
      this.peliculas = data;
      this.peliculasFiltradas = data; // Inicia con todas las pelis
    });
  }

  // Filtrar las películas 
  filtrar() {
    this.peliculasFiltradas = this.peliculas;

    // Filtrar por título
    if (this.buscarTexto) {
      this.peliculasFiltradas= this.cargar.filtrarPorTitulo(this.peliculas, this.buscarTexto);
    }

    // Filtrar por género
    if (this.generoSeleccionado) {
      this.peliculasFiltradas = this.cargar.filtrarPorGeneros(this.peliculasFiltradas, this.generoSeleccionado);
    }

    // Filtrar por año
    if (this.FechaLanzamiento) {
      this.peliculasFiltradas = this.cargar.filtrarPorFechaEstreno(this.peliculasFiltradas, this.FechaLanzamiento);
    }
  }

  // Abrir modal con detalles de película
  async abrirModal(pelicula: any) {
    const modal = await this.modal.create({
      component: ModalPage,
      componentProps: { pelicula },
    });
    await modal.present();
  }

}
