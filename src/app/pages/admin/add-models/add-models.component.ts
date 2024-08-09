import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

import { StorageService } from '../../../services/storage.service';
import { ControllerService } from '../../../services/controller.service';
import { DataService } from '../../../services/data.service';

interface Data { modelo: string; precioCoste: number | string; precioVenta: number | string; };
interface Response { response: '001' | '002' | '003'; error: string; };

@Component({
  selector: 'app-add-models',
  templateUrl: './add-models.component.html',
  styleUrl: './add-models.component.css'
})
export class AddModelsComponent {

  /**
   * *Propiedades
   */
  @ViewChild('fieldset') fieldset: ElementRef;
  @ViewChild('modelo') modelo: ElementRef;
  @ViewChild('precioCoste') precioCoste: ElementRef;
  @ViewChild('precioVenta') precioVenta: ElementRef;
  public data: Data = { modelo: '', precioCoste: '', precioVenta: '' };
  public isLoading: boolean = false;
  private regDecimal: RegExp = /^\d+([.,]\d+)?$/;

  constructor(
    private renderer: Renderer2,
    public storageService: StorageService,
    private controllerService: ControllerService,
    private dataService: DataService
  ) {}

  /**
   * *Function: Quita el borde rojo de los campos
   */
  public quitBorder(): void {
    this.renderer.removeClass(this.modelo.nativeElement, 'border__error');
    this.renderer.removeClass(this.precioCoste.nativeElement, 'border__error');
    this.renderer.removeClass(this.precioVenta.nativeElement, 'border__error');
  }

  /**
   * *Function: Se pone el formulario a cero o se resetean los campos
   * @param option opción a elegir
   */
  private action(option: 'resetFields' | 'initForm' | 'loadingData' | 'info', callback?: Function): void {
    if(option === 'resetFields') this.data = { ...this.data, modelo: '', precioCoste: '', precioVenta: '' };
    else if(option === 'initForm') {
      //Se habilita el formulario
      this.renderer.setProperty(this.fieldset.nativeElement, 'disabled', '');
      //Se oculta el loading
      this.isLoading = false;
      //Se resetean los campos
      this.data = { ...this.data, modelo: '', precioCoste: '', precioVenta: '' };
      //se lanza el callback
      callback();
    }else if(option === 'loadingData') {
      //Se muestra el loading
      this.isLoading = true;
      //Se deshabilita el formulario
      this.renderer.setProperty(this.fieldset.nativeElement, 'disabled', 'true');
    }else if(option === 'info') {
      //Se habilita el formulario
      this.renderer.setProperty(this.fieldset.nativeElement, 'disabled', '');
      //Se oculta el loading
      this.isLoading = false;
      //Se lanza el callback
      callback();
    }
  }

  /**
   * *Function: Valida todos los campos del formulario
   */
  public validateModel(): void {
    //Si alguno de los campos está vacio...
    if(this.data.modelo === '' || this.data.precioCoste === '' || this.data.precioVenta === '') {
      //Se muestra una alerta
      this.controllerService.alert('info', 'Todos los campos son requeridos');
      //Si el modelo está vacio se pone el borde rojo
      if(this.data.modelo === '') this.renderer.addClass(this.modelo.nativeElement, 'border__error');
      //Si el precioCoste está vacio..
      if(this.data.precioCoste === '') this.renderer.addClass(this.precioCoste.nativeElement, 'border__error');
      //Si el precioVenta está vacio..
      if(this.data.precioVenta === '') this.renderer.addClass(this.precioVenta.nativeElement, 'border__error');
    //Si todos los campos están rellenos...
    }else {
      //si el precioCoste no es válido...
      if(!this.regDecimal.test(this.data.precioCoste as string)) {
        //Se muestra una alerta
        this.controllerService.alert('info', 'El Precio de Coste no es válido');
        //Se pone el borde rojo
        this.renderer.addClass(this.precioCoste.nativeElement, 'border__error');
      //si el precioVenta no es válido...
      }else if(!this.regDecimal.test(this.data.precioVenta as string)) {
        //Se muestra una alerta
        this.controllerService.alert('info', 'El Precio de Venta no es válido');
        //Se pone el borde rojo
        this.renderer.addClass(this.precioVenta.nativeElement, 'border__error');
      //Si todo está correcto...
      }else {
        //Se crea nuevo objeto para el envio
        let obj: any = { modelo: this.data.modelo };
        //Si existe una coma en el precioCoste se reemplaza por un .
        if(this.data.precioCoste.toString().indexOf(',') > -1) obj = { ...obj, precioCoste: Number(this.data.precioCoste.toString().replace(',', '.')) };
        else obj = { ...obj, precioCoste: Number(this.data.precioCoste) };
        //Si existe una coma en el precioVenta se reemplaza por un .
        if(this.data.precioVenta.toString().indexOf(',') > -1) obj = { ...obj, precioVenta: Number(this.data.precioVenta.toString().replace(',', '.')) };
        else obj = { ...obj, precioVenta: Number(this.data.precioVenta) };
        //Se pasa el modelo a mayúsculas
        obj.modelo = obj.modelo.toUpperCase();
        //Se procesan los datos
        this.processModel(obj);
      }
    }
  }

  /**
   * *Function: Se procesan los datos para enviar
   */
  private processModel(data: any): void {
    //Se lanza la acción
    this.action('loadingData');
    //Peticion para agregar el nuevo modelo
    this.dataService.http({ code: '012', data }).subscribe((resp: Response) => {
      //Si el modelo existe se lanza la acción mostrando una alerta
      if(resp.response === '001') this.action('info', () => this.controllerService.alert('info', 'Este Modelo ya Existe'));
      //Si se ha insertado correctamente se lanza la acción mostrando una notificación
      else if(resp.response === '002') this.action('initForm', () => this.controllerService.toast('top', 'success', 'Modelo Insertado Con Éxito!'));
      //Si no se inserta el modelo se lanza la acción y muestra una alerta
      else this.action('info', () => this.controllerService.alert('error', `Error: [012]003 No se ha insertado el modelo: ${JSON.stringify(resp.error)}`));
    });
  }
}
