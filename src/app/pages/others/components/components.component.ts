import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { DataService } from '../../../services/data.service';
import { Components } from '../../../interfaces/components.interface';
import { ControllerService } from '../../../services/controller.service';
import { FilterComponents } from '../../../interfaces/filter.components.interface';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrl: './components.component.css'
})
export class ComponentsComponent implements OnInit {

  /**
   * *Propiedades
   */
  @ViewChild('empresa') empresa: ElementRef;
  @ViewChild('categoria') categoria: ElementRef;
  public components: Components[] = [];
  public loading: boolean = false;
  public isUpVisible: boolean = false;
  public filter: FilterComponents = { empresa: '???', categoria: '???' };
  private flag: boolean = false;
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
    this.dataService.http({ code: '006' }).subscribe((resp: Components[]) => {
      //Guarda los componentes obtenidos
      this.components = resp;
      //Filtra los componentes que no tengan imagen y se les aplica una por defecto
      this.replaceImage();
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
  public deleteBorder(element: string): void {
    if(element === 'empresa') this.renderer.removeClass(this.empresa.nativeElement, 'border__error');
    else this.renderer.removeClass(this.categoria.nativeElement, 'border__error');
  }

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
    if(this.filter.empresa === '???' && this.filter.categoria === '???') {
      //Se muestra una alerta
      this.controllerService.alert('info', 'Por lo menos un campo es requerido');
      //Se ponen los campos en rojo
      this.renderer.addClass(this.empresa.nativeElement, 'border__error');
      this.renderer.addClass(this.categoria.nativeElement, 'border__error');
    }
    //Si la empresa está rellena
    else if(this.filter.empresa !== '???' && this.filter.categoria === '???') this.apply('empresa');
    //Si la categoria está rellena
    else if(this.filter.empresa === '???' && this.filter.categoria !== '???') this.apply('categoria');
    //Si los dos campos están rellenos
    else this.apply('ambos');
  }

  /**
   * *Function: Se aplican los filtros
   * @param element 
   */
  public apply(element: 'empresa' | 'categoria' | 'ambos'): void {
    //Pone la bandera en true para saber que se ha aplicado algo
    this.flag = true;
    //Muestra el loading
    this.loading = true;
    //Se resetean los componentes
    this.components = [];
    //Crea un objeto para el envio
    let data: any = { element: '', value: '' };
    //Modifica el objeto depende de los datos aplicados
    if(element === 'empresa') {
      data = { ...data, element: 'empresa', value: this.filter.empresa };
      //Se modifica el showComponents
      this.showComponents = `Empresa: ${this.filter.empresa.toUpperCase()}`;
    }else if(element === 'categoria') {
      data = { ...data, element: 'categoria', value: this.filter.categoria };
      //Se modifica el showComponents
      this.showComponents = `Categoria: ${this.filter.categoria.toUpperCase()}`;
    }else {
      data = { ...data, element: 'ambos', empresa: this.filter.empresa, categoria: this.filter.categoria };
      //Se modifica el showComponents
      this.showComponents = `Empresa: ${this.filter.empresa.toUpperCase()} | Categoria: ${this.filter.categoria.toUpperCase()}`;
    } 
    //Peticion para filtrar
    this.dataService.http({ code: '007', data }).subscribe((resp: Components[]) => {
      //Se guardan los componentes filtrados
      this.components = resp
      //Se filtran los componentes para aplicarles imagen si no tienen
      this.replaceImage();
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
      this.filter.empresa = '???';
      //Resetea el showComponents
      this.showComponents = 'Todos los Componentes';
      //Petición para obtener todos los componentes
      this.dataService.http({ code: '006' }).subscribe((resp: Components[]) => {
        //Se guardan todos los componentes
        this.components = resp;
        //Se filtran los componentes para aplicarles imagen si no tienen
        this.replaceImage();
        //Se oculta el loading
        this.loading = false;
      });
    }
  }

  /**
   * *Function: Se reemplaza la imagen por una por defecto
   */
  private replaceImage(): void {
    this.components = this.components.map(item => {
      if(item.imagen === '') item.imagen = 'assets/no_image.png';
      return item;
    });
  }
}
