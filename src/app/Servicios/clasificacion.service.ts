import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionService {
  // Lista de clasificaciones 
  clasificaciones: { [key: string]: any[] } = {
    'Favoritas': [],
    'Interesado': [],
    'En curso': [],
    'Descartado': []
  };
  private valoraciones: { [key: string]: { total: number; suma: number } } = {};
 
    clasificar(pelicula: any, tipo: string) {
     
      
      this.eliminarDeListas(pelicula); 
      if (this.clasificaciones[tipo]) {
        this.clasificaciones[tipo].push(pelicula); 
        
      } else {
        console.warn(`Clasificación ${tipo} no existe`);
      }
    }

  private eliminarDeListas(pelicula: any) {
    for (const key in this.clasificaciones) {
      this.clasificaciones[key] = this.clasificaciones[key].filter(p => p.titulo !== pelicula.titulo);
    }
  }

  obtenerClasificadas(tipo: string) {
    return this.clasificaciones[tipo] || [];
  }

  agregarClasificacion(nuevaClasificacion: string) {
    if (!this.clasificaciones[nuevaClasificacion]) {
      this.clasificaciones[nuevaClasificacion] = [];
    }
  }

  eliminarClasificacion(nombreClasificacion: string) {
    delete this.clasificaciones[nombreClasificacion];
  }

  obtenerClasificaciones() {
    return Object.keys(this.clasificaciones);
  }

  /*eliminarPeliculaDeClasificacion(nombreClasificacion: string, index: number) {
    if (this.clasificaciones[nombreClasificacion]) {
      this.clasificaciones[nombreClasificacion].splice(index, 1);
    }
  }*/
    eliminarPeliculaDeClasificacion(clasificacion: string, index: number) {
      // NOs aseguramos de que solo se elimine la película correspondiente a la clasificación y el índice específico
      const peliculasClasificadas = this.clasificaciones[clasificacion]; // Obtener las películas de la clasificación
      if (peliculasClasificadas && peliculasClasificadas.length > index) {
        peliculasClasificadas.splice(index, 1); // Elimina solo la película seleccionada
      }
    }


    obtenerValoracion(idPelicula: string) {
      const valoracion = this.valoraciones[idPelicula];
      if (valoracion) {
        return {
          media: valoracion.suma / valoracion.total,
          total: valoracion.total
        };
      }
      return { media: 0, total: 0 };
    }
  
    guardarValoracion(idPelicula: string, valor: number) {
      if (!this.valoraciones[idPelicula]) {
        this.valoraciones[idPelicula] = { total: 0, suma: 0 };
      }
      this.valoraciones[idPelicula].total += 1;
      this.valoraciones[idPelicula].suma += valor;
    }
  
}

