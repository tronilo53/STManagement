import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';

import { StorageService } from '../../../services/storage.service';
import { DataService } from '../../../services/data.service';
import { ControllerService } from '../../../services/controller.service';

export interface Components { id: number; nombre: string; referencias: References[]; categoria: string; cantidad: number; };
export interface References { empresa: string; codigo: string; };
export interface FilterComponents { categoria: string; };

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrl: './components.component.css'
})
export class ComponentsComponent implements OnInit {

  /**
   * *Propiedades
   */
  @ViewChild('categoria') categoria: ElementRef;
  public components: Components[] = [];
  public loading: boolean = false;
  public isUpVisible: boolean = false;
  public filter: FilterComponents = { categoria: '???' };
  public flag: boolean = false;
  public showComponents: string = '';

  constructor(
    public storageService: StorageService,
    private dataService: DataService,
    private controllerService: ControllerService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    //Muestra el loading
    this.loading = true;
    //Obtiene todos los componentes
    this.dataService.http({ code: '006' }).pipe(
      map((componentes: any) => {
        return componentes.map((componente: any) => {
          componente.referencias = JSON.parse(componente.referencias);
          return componente;
        });
      })
    ).subscribe((resp: Components[]) => {
      //Guarda los componentes obtenidos
      this.components = resp;
      //Se modifica el showComponents
      this.showComponents = 'Todos los Componentes';
      //Oculta el loading
      this.loading = false;
    });
  }

  /**
   * *Function: Quita el border__error
   * @param element elemento a quitar el borde
   */
  public quitBorder(): void { this.renderer.removeClass(this.categoria.nativeElement, 'border__error') }

  /**
   * *Funtion: identifica el scroll de la pantalla
   */
  public onScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isUpVisible = scrollPosition > 900;
  }

  /**
   * *Function: Desliza hacia arriba de la página
   */
  public up(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * *Function: Se validan los filtros
   */
  public validateApply(): void {
    //si los dos campos están vacios...
    if(this.filter.categoria === '???') {
      //Se muestra una alerta
      this.controllerService.alert('info', 'La categoría es requerida');
      //Se pone el campo de categoria en rojo
      this.renderer.addClass(this.categoria.nativeElement, 'border__error');
    //Si la categoria está rellena...
    }else this.apply();
  }

  /**
   * *Function: Se aplican los filtros
   */
  public apply(): void {
    //Pone la bandera en true para saber que se ha aplicado algo
    this.flag = true;
    //Muestra el loading
    this.loading = true;
    //Se resetean los componentes
    this.components = [];
    //Se modifica el showComponents
    this.showComponents = `Categoria: ${this.filter.categoria}`;
    //Peticion para filtrar
    this.dataService.http({ code: '007', categoria: this.filter.categoria }).pipe(
      map((componentes: any) => {
        return componentes.map((componente: any) => {
          componente.referencias = JSON.parse(componente.referencias);
          return componente;
        });
      })
    ).subscribe((resp: Components[]) => {
      //Se guardan los componentes filtrados
      this.components = resp;
      //Se oculta el loading
      this.loading = false;
    });
  }

  /**
   * *Function: Elimina los filtros
   */
  public quitApply(): void {
    //Si se ha aplicado algo...
    if(this.flag) {
      //Muestra el loading
      this.loading = true;
      //Resetea todos los componentes
      this.components = [];
      //Resetea todos los campos
      this.filter.categoria = '???';
      //Resetea el showComponents
      this.showComponents = 'Todos los Componentes';
      //Petición para obtener todos los componentes
      this.dataService.http({ code: '006' }).pipe(
        map((componentes: any) => {
          return componentes.map((componente: any) => {
            componente.referencias = JSON.parse(componente.referencias);
            return componente;
          });
        })
      ).subscribe((resp: Components[]) => {
        //Se guardan todos los componentes
        this.components = resp;
        //Se cambia la bandera del filtro
        this.flag = false;
        //Se oculta el loading
        this.loading = false;
      });
    }
  }
}
