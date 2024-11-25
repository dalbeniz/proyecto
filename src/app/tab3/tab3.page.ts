import { Coords } from './../../../node_modules/@types/leaflet/index.d';
//import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AfterViewInit, Component, OnInit, OnDestroy, signal, inject, DestroyRef } from '@angular/core';
import { latLng, tileLayer, Map, marker, icon,Layer,LatLngBounds } from 'leaflet';
import * as L from 'leaflet';
import { CargarPelisService } from '../Servicios/cargar-pelis.service';
import { Cartelera } from '../mis-interfaces/cartelera';
import { GeoService } from '../Servicios/geo.service';
import { Coordenadas } from '../models/models';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, AfterViewInit, OnDestroy {
 
  private destroy = inject(DestroyRef);
  map!: Map;
  coordenada: Coordenadas = {latidud:43.0000, longitud: -2.0000}; 
  lat: number = 43.0000;
  lng: number = -2.0000;
  private aa = signal<string>('');
  
  // Listado de municipios
  municipios: string[] = ['Bilbao', 'Vitoria-Gasteiz', 'Donostia-San Sebastián', 'Barakaldo', 'Getxo', 'Irun', 'Portugalete', 'Santurtzi', 'Errenteria', 'Basauri'];
  // Opciones de distancia
  distancias: number[] = [1000, 5000, 10000, 20000]; 
  selectedMunicipio: string = ''; // Municipio seleccionado
  selectedDistancia!: number; // Distancia seleccionada
  cines: any[] = []; // Almacena la lista de cines 
  public movies: Cartelera[] = []; // Array donde almacenaremos las películas
  public movieTitles: string[] = []; // Array donde almacenaremos los títulos de las películas
  //public selectedMovieTitle: string = 'Todas'; // Por defecto, la opción será "Todas"
  selectedMovieTitle: string = '';
  clientPosition = signal<GeolocationCoordinates|undefined>(undefined);

  // Configuración del mapa
  options: any;
  layers: Layer[] = [];
  

  constructor(private osm: GeoService,private carga : CargarPelisService) { }

  ngOnInit(): void {
    this.loadMovies(); //método para cargar las peliculas y sus cines
    this.selectedMovieTitle = this.carga.getTituloPeliculaSeleccionada();

    console.log( "pelicula seleccionada"+ this.selectedMovieTitle);
    this.osm.getCurrentPosition().subscribe({
      next:(data) =>{
        console.log('LLAMAR');
        this.clientPosition.set(data);
        //Si el mapa existe
        if(this.map){
          // Añadir marcador para el primer cine
          const positionMarker = marker([this.clientPosition()!.latitude, this.clientPosition()!.longitude], {
            icon: icon({
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                iconUrl: 'assets/location.png', // Ruta del ícono de 
                
            })
          })

          positionMarker.addTo(this.map); // Añadir el marcador al mapa
        }
        console.log(data);
      }
    });
  }

  ionViewWillEnter(): void {
    // reseteamos valores
    this.selectedMovieTitle = '';
    this.selectedMunicipio = '';
    this.selectedDistancia = undefined!;
    this.cines = [];
    this.initMap(); 

    
  }
  //Método para crear nuevo mapa
  initMap(): void {
    
    const mapContainer = document.getElementById('map');
  
    if (!mapContainer) {
      return;
    }
    if (this.map) {
      this.map.remove();
    }
  
    this.map = new Map('map').setView([this.coordenada.latidud, this.coordenada.longitud], 8);
  
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  
    setTimeout(() => {
      this.map.invalidateSize();

    }, 300);
  }

  ionViewWillLeave(): void {
    this.ngOnDestroy(); 
  }
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined!; 
    }
  
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      mapContainer.innerHTML = ''; 
    }
  }

  


 loadMovies(): void {
    this.carga.getCartelera().subscribe(
      (movies: Cartelera[]) => {
        this.movies = movies; // Guardamos las películas 
        console.log(this.movies); // Mostramos el array en consola

        //Cargar los títulos de las películas en el desplegable.
        this.movieTitles = [...this.movies.map(movie => movie.pelicula)];
        console.log("Lista de títulos de películas:", this.movieTitles);
      },
      (error) => {
        console.error('Error al cargar las películas', error);
      }
    );
  }

  
  ngAfterViewInit(): void {
    // Inicializa el mapa
    this.map = new Map('map').setView([this.lat, this.lng], 8);
    
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Llama a invalidateSize() después de una demora de 300 ms
    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);
  }

  buscarCines(): void {
    if (this.selectedMunicipio && this.selectedDistancia) {
      this.osm.getCoordinates(this.selectedMunicipio).subscribe(response => {
        if (response && response.length > 0) {
          this.coordenada = {latidud: parseFloat(response[0].lat), longitud: parseFloat(response[0].lon)};
          this.updateMap(); // Método para actualizar el mapa
          this.osm.getNearbyCinemas(this.lat, this.lng, this.selectedDistancia).subscribe(cineResponse => {
            if (cineResponse && cineResponse.elements) {
              this.cines = cineResponse.elements;
              this.updateCineMarkers(); // Método para actualizar los marcadores
              console.log('Datos de cines obtenidos:', this.cines); // Agrega esta línea para verificar los datos
            }
          });
        }
      });
    }
  }

  updateMap(): void {
    this.map.setView([this.coordenada.latidud, this.coordenada.longitud], 13); // Centra el mapa en el municipio seleccionado
  }

  
   
   //Añade marcadores para cada cine encontrado en el mapa.
   
    updateCineMarkers(): void {
       
      // Limpiar los marcadores existentes en el mapa solo si es necesario
    this.map.eachLayer(layer => {
    if (layer instanceof L.Marker && !this.layers.includes(layer)) {
      this.map.removeLayer(layer); // Solo eliminar los marcadores que no están en la lista de la capa
    }
  });
  
      let filteredCines = this.cines;

    // Si no se selecciona "Todas", filtrar los cines por la película seleccionada
    if (this.selectedMovieTitle !== '') {
      const selectedMovie = this.movies.find(movie => movie.pelicula === this.selectedMovieTitle);
      if (selectedMovie) {
        // Filtrar los cines por las coordenadas de la película seleccionada
        filteredCines = this.cines.filter(cine => {
          return selectedMovie.cines.some(cinema => {
            return cinema.lat === cine.lat && cinema.lon === cine.lon;
          });
        });
      }
    }

      // Verificamos si hay cines disponibles
      if (filteredCines.length > 0) {
          var bounds: LatLngBounds|undefined;
          var coord : Coordenadas|undefined; 

          filteredCines.forEach(cine => {
            coord = this.addCinemasToMap(cine);
            if(coord){
              if(bounds)
                bounds.extend([coord.latidud, coord.longitud]);
              else
               bounds = new LatLngBounds([coord.latidud, coord.longitud],[coord.latidud, coord.longitud]);
            }
            
          });
          
          /*let cineLat: number;
          let cineLon: number;
  
          // Inicializamos los límites con las coordenadas del primer cine
          const firstCine = filteredCines[0];
  
          // Dependiendo del tipo de elemento, extraemos las coordenadas
          if (firstCine.type === 'node') {
              cineLat = firstCine.lat;
              cineLon = firstCine.lon;
          } else if (firstCine.type === 'way' || firstCine.type === 'relation') {
              cineLat = firstCine.center.lat;
              cineLon = firstCine.center.lon;
          } else {
              return; // Salir si el tipo de cine es desconocido
          }
  
          // Inicializamos los límites con las coordenadas del primer cine
        
          const bounds = new LatLngBounds([cineLat, cineLon], [cineLat, cineLon]); // Usa coordenadas del primer cine, si no da error

          // Añadir marcador para el primer cine
          const cineMarker = marker([cineLat, cineLon], {
              icon: icon({
                  iconSize: [25, 41],
                  iconAnchor: [13, 41],
                  iconUrl: 'assets/cinema-marker-icon.png', // Ruta del ícono de cine
                  shadowUrl: 'assets/marker-shadow.png' // Ruta de la sombra del marcador
              })
          }).bindPopup(firstCine.tags.name || 'Cine'); // Muestra el nombre del cine en un popup
  
          cineMarker.addTo(this.map); // Añadir el marcador al mapa
  
          // Iterar sobre los cines y agregar marcadores
          filteredCines.forEach(cine => {
              if (cine.type === 'node') {
                  cineLat = cine.lat;
                  cineLon = cine.lon;
              } else if (cine.type === 'way' || cine.type === 'relation') {
                  cineLat = cine.center.lat;
                  cineLon = cine.center.lon;
              } else {
                  return; // Salir de la función para este cine
              }
  
              // Añadir marcador para el cine
              const cineMarker = L.marker([cineLat, cineLon], {
                  icon: L.icon({
                      iconSize: [25, 41],
                      iconAnchor: [13, 41],
                      iconUrl: 'assets/cinema-marker-icon.png', // Ruta del ícono de cine
                      shadowUrl: 'assets/marker-shadow.png' // Ruta de la sombra del marcador 
                  })
              }).bindPopup(cine.tags.name || 'Cine'); // Muestra el nombre del cine en un popup
  
              cineMarker.addTo(this.map); // Añadir el marcador al mapa
  
              // Extender los límites con las coordenadas del cine
              bounds.extend([cineLat, cineLon]); // Agregar la coordenada del cine a los límites
          });*/
          // Ajustar el mapa para mostrar todos los cines
          if(bounds)
            this.map.fitBounds(bounds); // Ajustar el mapa para mostrar todos los cines
      } else {
        window.alert('No hay cines para mostrar en el mapa.'); // Mensaje si no hay cines
      }
  }

  /**
   * Añade los mapas al cine
   * @param cine 
   * @returns 
   */
  addCinemasToMap(cine:any):Coordenadas|undefined{
    var coor: Coordenadas|undefined;
    if (cine.type === 'node') 
      coor = {latidud:cine.lat, longitud: cine.lon};
    else if (cine.type === 'way' || cine.type === 'relation')
      coor = {latidud:cine.center.lat, longitud: cine.center.lon};

  // Añadir marcador para el cine
  if(coor){
    const cineMarker = L.marker([coor.latidud, coor.longitud], {
      icon: L.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: 'assets/cinema-marker-icon.png', // Ruta del ícono de cine
          shadowUrl: 'assets/marker-shadow.png' // Ruta de la sombra del marcador 
      })
    }).bindPopup(cine.tags.name || 'Cine'); // Muestra el nombre del cine en un popup

    cineMarker.addTo(this.map);
  }
  
  return coor;

  }

}
