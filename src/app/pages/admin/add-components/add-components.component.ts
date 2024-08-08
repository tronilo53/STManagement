import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';

import { StorageService } from '../../../services/storage.service';
import { DataService } from '../../../services/data.service';
import { ControllerService } from '../../../services/controller.service';

interface Data { id: number; nombre: string; categoria: string; cantidad: number; referencias: string};
interface Referencias { empresa: string; codigo: string; };
interface DataNgModel { nombreExistente: string; nuevoNombre: string; categoria: string; cantidad: number; referencias: Referencias; };
interface Names { id: number; nombre: string; };
interface Response { response: string; };


@Component({
  selector: 'app-add-components',
  templateUrl: './add-components.component.html',
  styleUrl: './add-components.component.css'
})
export class AddComponentsComponent implements OnInit {

  /**
   * *Propiedades
   */
  @ViewChild('fieldsetAll', { static: true }) fieldsetAll: ElementRef;
  @ViewChild('nombreExistente') nombreExistente: ElementRef;
  @ViewChild('nuevoNombre') nuevoNombre: ElementRef;
  @ViewChild('categoria') categoria: ElementRef;
  @ViewChild('cantidad') cantidad: ElementRef;
  @ViewChild('empresa') empresa: ElementRef;
  @ViewChild('codigo') codigo: ElementRef;
  public names: Names[] = [];
  public dataNgModel: DataNgModel = { nombreExistente: '???', nuevoNombre: '', categoria: '???', cantidad: 0, referencias: { empresa: '???', codigo: '' } };
  private dataSend: Data = { id: 0, nombre: '', categoria: '', cantidad: 0, referencias: '' };
  public references_1: Referencias[] = [];
  public references_2: Referencias[] = [];
  public references: Referencias[] = [];
  public isReferences: boolean = false;
  public isLoading: boolean = false;

  constructor(
    public storageService: StorageService,
    private dataService: DataService,
    private controllerService: ControllerService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    //Obtiene todos los componentes y solo devuelve los nombres y el id
    this.dataService.http({ code: '006' }).pipe(
      map((components: any) => {
        return components.map((component: any) => {
          return { id: component.id, nombre: component.nombre };
        });
      })
    ).subscribe((resp: Names[]) => { this.names = resp; });
  }

  /**
   * *Function: Quita el borde de los campos
   * @param item elemento a quitar el borde
   */
  public quitBorder(): void {
    this.renderer.removeClass(this.nombreExistente.nativeElement, 'border__error');
    this.renderer.removeClass(this.nuevoNombre.nativeElement, 'border__error');
    this.renderer.removeClass(this.categoria.nativeElement, 'border__error');
    this.renderer.removeClass(this.empresa.nativeElement, 'border__error');
    this.renderer.removeClass(this.codigo.nativeElement, 'border__error');
    this.renderer.removeClass(this.cantidad.nativeElement, 'border__error');
  }

  /**
   * *Function: Resetea todos los campos
   */
  public resetFields(): void {
    this.dataNgModel = { ...this.dataNgModel, categoria: '???', cantidad: 0, referencias: { empresa: '???', codigo: '' } };
    this.references_1 = [];
    this.references_2 = [];
    this.references = [];
    this.dataSend = { id: 0, nombre: '', categoria: '', cantidad: 0, referencias: '' };
    this.isReferences = false;
  }

  /**
   * *Function: Valida los datos del formulario
   */
  public validateDataComponent(): void {
    //Si los dos primeros campos están vacios o la categoria está vacia...
    if(this.dataNgModel.nombreExistente === '???' && this.dataNgModel.nuevoNombre === '') {
      //Se muestra una alerta
      this.controllerService.alert('info', 'Uno de los dos campos es requerido');
      //Se ponen los dos primeros campos en rojo
      this.renderer.addClass(this.nombreExistente.nativeElement, 'border__error');
      this.renderer.addClass(this.nuevoNombre.nativeElement, 'border__error');
    //Si alguno de los dos primeros campos está relleno...
    }else {
      //Si se elige nuevoNombre y ademas la categoria está vacia...
      if(this.dataNgModel.nuevoNombre !== '' && this.dataNgModel.categoria === '???') {
        //Se muestra una alerta
        this.controllerService.alert('info', 'La categoría es requerida');
        //Se pone la categoria en rojo
        this.renderer.addClass(this.categoria.nativeElement, 'border__error');
      //Si la categoria está rellena al elegir nuevoNombre...
      }else {
        //Si la cantidad es 0
        if(this.dataNgModel.cantidad === 0) {
          //Se muestra una alerta
          this.controllerService.alert('info', 'La cantidad no puede ser 0');
          //Se pone el borde rojo en la cantidad
          this.renderer.addClass(this.cantidad.nativeElement, 'border__error');
        //Si la cantidad es distinta de 0
        }else {
          //Se unen los arrays de las referencias
          this.references = [...this.references_1, ...this.references_2];
          //Si las referencias están activadas y ademas no hay refrencias agregadas se muestra una alerta
          if(this.isReferences && this.references.length == 0) this.controllerService.alert('info', 'Las referencias están vacias. Desactívalas o agrega refrencias');
          else {
            /**
             * ?Se preparan los datos a enviar
            */
            //Si 'nombreExistente' está relleno se agrega al objeto
            if(this.dataNgModel.nombreExistente !== '???' && this.dataNgModel.nuevoNombre === '') this.dataSend = { ...this.dataSend, id: Number(this.dataNgModel.nombreExistente) };
            //Si 'nuevoNombre' está relleno se agrega al objeto y tambien la categoria
            if(this.dataNgModel.nombreExistente === '???' && this.dataNgModel.nuevoNombre !== '') this.dataSend = { ...this.dataSend, nombre: this.dataNgModel.nuevoNombre, categoria: this.dataNgModel.categoria };
            //Se agregan los demas datos 'cantidad' y 'referencias'
            this.dataSend = { ...this.dataSend, cantidad: this.dataNgModel.cantidad, referencias: JSON.stringify(this.references) };
            //Se procesan los datos
            this.processDataComponent();
          }
        }
      }
    }
  }

  /**
   * *Function: Se procesan los datos
   */
  private processDataComponent(): void {
    //Se muestra el loading
    this.isLoading = true;
    //Se deshabilita el formulario
    this.renderer.setProperty(this.fieldsetAll.nativeElement, 'disabled', 'true');
    //Peticion para agregar el componente
    this.dataService.http({ code: '011', data: this.dataSend }).subscribe((resp: Response) => {
      //Si el nombre del componente ya existe...
      if(resp.response === '001') {
        //Se habilita el formulario
        this.renderer.setProperty(this.fieldsetAll.nativeElement, 'disabled', '');
        //Se oculta el loading
        this.isLoading = false;
        //Se muestra una alerta
        this.controllerService.alert('info', 'El nombre del componente ya existe. Cambia el nombre');
        //Se pone el borde rojo
        this.renderer.addClass(this.nuevoNombre.nativeElement, 'border__error');
      //Si se inserta correctamente...
      }else if(resp.response === '002') {
        //Se habilita el formulario
        this.renderer.setProperty(this.fieldsetAll.nativeElement, 'disabled', '');
        //Se oculta el loading
        this.isLoading = false;
        //Se resetean los campos
        this.resetFields();
        //Se resetean los dos primeros campos
        this.dataNgModel = { ...this.dataNgModel, nombreExistente: '???', nuevoNombre: '' };
        //se muestra una notificación
        this.controllerService.toast('top', 'success', 'Nuevo Componente Insertado Con Éxito!');
      //Si no se inserta el nuevo componente...
      }else if(resp.response === '003') {
        //Se habilita el formulario
        this.renderer.setProperty(this.fieldsetAll.nativeElement, 'disabled', '');
        //Se oculta el loading
        this.isLoading = false;
        //Se resetean los campos
        this.resetFields();
        //Se resetean los dos primeros campos
        this.dataNgModel = { ...this.dataNgModel, nombreExistente: '???', nuevoNombre: '' };
        //Se muestra una alerta
        this.controllerService.alert('error', 'Error: [011]003 El nuevo componente no se ha insertado');
      //Si se actualiza el componente...
      }else if(resp.response === '004') {
        //Se habilita el formulario
        this.renderer.setProperty(this.fieldsetAll.nativeElement, 'disabled', '');
        //Se oculta el loading
        this.isLoading = false;
        //Se resetean los campos
        this.resetFields();
        //Se resetean los dos primeros campos
        this.dataNgModel = { ...this.dataNgModel, nombreExistente: '???', nuevoNombre: '' };
        //se muestra una notificación
        this.controllerService.toast('top', 'success', 'Componente Actualizado Con Éxito!');
      //Si no se actualiza el componente...
      }else {
        //Se habilita el formulario
        this.renderer.setProperty(this.fieldsetAll.nativeElement, 'disabled', '');
        //Se oculta el loading
        this.isLoading = false;
        //Se resetean los campos
        this.resetFields();
        //Se resetean los dos primeros campos
        this.dataNgModel = { ...this.dataNgModel, nombreExistente: '???', nuevoNombre: '' };
        //Se muestra una alerta
        this.controllerService.alert('error', 'Error: [011]005 El componente no se ha Actualizado');
      }
    });
  }

  /**
   * *Function: Elimina la referencia seleccionada
   * @param column Array donde eliminar
   * @param position Posicion a eliminar
   */
  public quitReference(column: string, position: number): void {
    if(column === 'c1') this.references_1.splice(position, 1);
    else this.references_2.splice(position, 1);
  }

  /**
   * *Function: Activa o desactiva el campo 'nombreExistente'
   * @returns Retorna un booleano
   */
  public isNombreExistente(): boolean {
    if(this.dataNgModel.nuevoNombre !== '') return true;
    else return false;
  }

  /**
   * *Function: Activa o desactiva el campo 'nuevoNombre'
   * @returns Retorna un booleano
   */
  public isNuevoNombre(): boolean {
    if(this.dataNgModel.nombreExistente !== '???') return true;
    else return false;
  }

  /**
   * *Function: Activa o desactiva el campo 'categoria'
   * @returns Retorna un booleano
   */
  public isCategoria(): boolean {
    if(this.dataNgModel.nombreExistente !== '???') return true;
    else return false;
  }

  /**
   * *Function: Resetea el array de referencias si se desmarca el check
   */
  public checkIsReferences(): void {
    if(!this.isReferences) {
      if(this.references_1.length > 0) this.references_1 = [];
      if(this.references_2.length > 0) this.references_2 = [];
      if(this.references.length > 0) this.references = [];
      this.dataNgModel = { ...this.dataNgModel, referencias: { empresa: '???', codigo: '' } };
    }
  }

  /**
   * *Function: Valida los campos de las referencias
   */
  public validateReferences(): void {
    //Si los dos campos están vacios...
    if(this.dataNgModel.referencias.empresa === '???' || this.dataNgModel.referencias.codigo === '') {
      //Se muestra una alerta
      this.controllerService.alert('info', 'Los dos campos son requeridos');
      //Si la empresa está vacia se pone el borde rojo
      if(this.dataNgModel.referencias.empresa === '???') this.renderer.addClass(this.empresa.nativeElement, 'border__error');
      //Si el codigo está vacio se pone el borde rojo
      if(this.dataNgModel.referencias.codigo === '') this.renderer.addClass(this.codigo.nativeElement, 'border__error');
    //Si los dos campos están rellenos se procesan
    }else this.processReferences();
  }

  /**
   * *Function: Se procesan las referencias
   */
  private processReferences(): void {
    //Se crea nuevo objeto para guardar la referencia añadida
    const referencesObj: Referencias = this.dataNgModel.referencias;
    //Si en la primera columna hay 4 refrencias se añaden en la siguiente columna
    if(this.references_1.length === 4) this.references_2.push(referencesObj);
    //Si en la primera columna no hay 4 referencias se agregan
    else this.references_1.push(referencesObj);
    //Se resetean los campos empresa y codigo
    this.dataNgModel = { ...this.dataNgModel, referencias: { empresa: '???', codigo: '' } };
  }
}
