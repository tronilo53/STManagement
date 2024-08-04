import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { Apparatus } from '../../../interfaces/apparatus.interface';
import { DataService } from '../../../services/data.service';
import { ControllerService } from '../../../services/controller.service';

@Component({
  selector: 'app-apparatus',
  templateUrl: './apparatus.component.html',
  styleUrl: './apparatus.component.css'
})
export class ApparatusComponent implements OnInit {

  /**
   * *Propiedades
   */
  @ViewChild('categoriaSelect') categoriaSelect: ElementRef;
  public apparatus: Apparatus[] = [];
  public loading: boolean = false;
  public isUpVisible: boolean = false;
  public categoria: string = '???';
  private flag: boolean = false;
  public showApparatus: string = '';

  constructor(
    private renderer: Renderer2,
    public storageService: StorageService,
    private dataService: DataService,
    private controllerService: ControllerService
  ) {}

  ngOnInit(): void {
    //Se muestra el loading
    this.loading = true;
    //Peticion para obtener todos los aparatos
    this.dataService.http({ code: '008' }).subscribe((resp: Apparatus[]) => {
      //se guardan los aparatos recibidos
      this.apparatus = resp;
      //Se modifica el showApparatus
      this.showApparatus = 'Todos los Equipos Desincal';
      //Se oculta el loading
      this.loading = false;
    });
  }

  /**
   * *Function: Quita el border__error
   * @param element elemento a quitar el borde
   */
  public deleteBorder(): void {
    this.renderer.removeClass(this.categoriaSelect.nativeElement, 'border__error');
  }

  /**
   * *Funtion: identifica el scroll de la pantalla
   */
  public onScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isUpVisible = scrollPosition > 500;
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
    //si la categoria está vacia...
    if(this.categoria === '???') {
      //Se muestra una alerta
      this.controllerService.alert('info', 'La categoria es requerida');
      //Se pone la categoria en rojo
      this.renderer.addClass(this.categoriaSelect.nativeElement, 'border__error');
    }
    //Si la categoria está rellena procesa el filtro
    else this.apply();
  }

  /**
   * *Function: Se aplican los filtros
   */
  public apply(): void {
    //Pone la bandera en true para saber que se ha aplicado algo
    this.flag = true;
    //Muestra el loading
    this.loading = true;
    //Se resetean los aparatos
    this.apparatus = [];
    //Se modifica el showApparatus
    this.showApparatus = this.categoria;
    //Peticion para filtrar
    this.dataService.http({ code: '009', categoria: this.categoria }).subscribe((resp: Apparatus[]) => {
      //Se guardan los componentes filtrados
      this.apparatus = resp
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
      //Resetea todos los aparatos
      this.apparatus = [];
      //Resetea todos los campos
      this.categoria = '???';
      //Resetea el showApparatus
      this.showApparatus = 'Todos los Equipos Desincal';
      //Petición para obtener todos los componentes
      this.dataService.http({ code: '008' }).subscribe((resp: Apparatus[]) => {
        //Se guardan todos los componentes
        this.apparatus = resp;
        //Se oculta el loading
        this.loading = false;
      });
    }
  }
}
