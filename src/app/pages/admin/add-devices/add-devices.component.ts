import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { ControllerService } from '../../../services/controller.service';
import { DataService } from '../../../services/data.service';

interface NewDevice { categoria: string; codigo: string; imagen: string; };
interface RegDevice { GBD1: RegExp; GBD2: RegExp; GPD3: RegExp; GPD4: RegExp; GAD5: RegExp; GADI5: RegExp; GAD10: RegExp; GADI10: RegExp; GAD50: RegExp; GADI50: RegExp; GAD75: RegExp; GADI75: RegExp; };
interface Resp { response: string; }

@Component({
  selector: 'app-add-devices',
  templateUrl: './add-devices.component.html',
  styleUrl: './add-devices.component.css'
})
export class AddDevicesComponent implements OnInit {

  /**
   * *Propiedades
   */
  @ViewChild('fieldset', { static: true }) fieldset: ElementRef;
  @ViewChild('categoria') categoria: ElementRef;
  @ViewChild('codigo') codigo: ElementRef;
  public data: NewDevice = { categoria: '???', codigo: '', imagen: '' };
  public isLoading: boolean = false;
  private regDevice: RegDevice = {
    GBD1: /^GBD1-\d{7}$/,
    GBD2: /^GBD2-\d{7}$/,
    GPD3: /^GPD3-\d{7}$/,
    GPD4: /^GPD4-\d{7}$/,
    GAD5: /^GAD5-\d{7}$/,
    GADI5: /^GADI5-\d{7}$/,
    GAD10: /^GAD10-\d{7}$/,
    GADI10: /^GADI10-\d{7}$/,
    GAD50: /^GAD50-\d{7}$/,
    GADI50: /^GADI50-\d{7}$/,
    GAD75: /^GAD75-\d{7}$/,
    GADI75: /^GADI75-\d{7}$/
  };

  constructor(
    public storageService: StorageService,
    private renderer: Renderer2,
    private controllerService: ControllerService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
  }

  /**
   * *Function: Quita el borde rojo
   * @param item Elemento a quitar el borde
   */
  public quitBorder(item: string) {
    if(item === 'categoria') this.renderer.removeClass(this.categoria.nativeElement, 'border__error');
    else this.renderer.removeClass(this.codigo.nativeElement, 'border__error');
  }

  /**
   * *Function: Valida el dispositivo a agregar
   */
  public validateDevice(): void {
    //si algún campo está vacio...
    if(this.data.categoria === '???' || this.data.codigo === '') {
      //Se muestra una alerta
      this.controllerService.alert('info', 'Todos los campos son requeridos');
      //Se verifica que campo está vacio y se pone el borde rojo
      if(this.data.categoria === '???') this.renderer.addClass(this.categoria.nativeElement, 'border__error');
      if(this.data.codigo === '') this.renderer.addClass(this.codigo.nativeElement, 'border__error');
    //Si todos los campos están rellenos valida el codigo.
    }else this.validateRegCode();
  }

  /**
   * *Function: Valida el código segun la categoria
   */
  private validateRegCode() {
    let isNoValid: boolean = false;
    if(this.data.categoria === 'GBD1') {
      if(!this.regDevice.GBD1.test(this.data.codigo.toUpperCase())) isNoValid = true;
      else this.data.imagen = 'assets/apparatus/GBD1.png';
    }else if(this.data.categoria === 'GBD2') {
      if(!this.regDevice.GBD2.test(this.data.codigo.toUpperCase())) isNoValid = true;
      else this.data.imagen = 'assets/apparatus/GBD2.png';
    }else if(this.data.categoria === 'GPD3') {
      if(!this.regDevice.GPD3.test(this.data.codigo.toUpperCase())) isNoValid = true;
      else this.data.imagen = 'assets/apparatus/GPD3.png';
    }else if(this.data.categoria === 'GPD4') {
      if(!this.regDevice.GPD4.test(this.data.codigo.toUpperCase())) isNoValid = true;
      else this.data.imagen = 'assets/apparatus/GPD4.png';
    }else if(this.data.categoria === 'GAD5') {
      if(!this.regDevice.GAD5.test(this.data.codigo.toUpperCase())) isNoValid = true;
      else this.data.imagen = 'assets/apparatus/GAD5.png';
    }else if(this.data.categoria === 'GADI5') {
      if(!this.regDevice.GADI5.test(this.data.codigo.toUpperCase())) isNoValid = true;
      else this.data.imagen = 'assets/apparatus/GADI5.png';
    }else if(this.data.categoria === 'GAD10') {
      if(!this.regDevice.GAD10.test(this.data.codigo.toUpperCase())) isNoValid = true;
      else this.data.imagen = 'assets/apparatus/GAD10.png';
    }else if(this.data.categoria === 'GADI10') {
      if(!this.regDevice.GADI10.test(this.data.codigo.toUpperCase())) isNoValid = true;
      else this.data.imagen = 'assets/apparatus/GADI10.png';
    }else if(this.data.categoria === 'GAD50') {
      if(!this.regDevice.GAD50.test(this.data.codigo.toUpperCase())) isNoValid = true;
      else this.data.imagen = 'assets/apparatus/GAD50.png';
    }else if(this.data.categoria === 'GADI50') {
      if(!this.regDevice.GADI50.test(this.data.codigo.toUpperCase())) isNoValid = true;
      else this.data.imagen = 'assets/apparatus/GADI50.png';
    }else if(this.data.categoria === 'GAD75') {
      if(!this.regDevice.GAD75.test(this.data.codigo.toUpperCase())) isNoValid = true;
      else this.data.imagen = 'assets/apparatus/GAD75.png';
    }else {
      if(!this.regDevice.GADI75.test(this.data.codigo.toUpperCase())) isNoValid = true;
      else this.data.imagen = 'assets/apparatus/GADI75.png';
    }
    //Si el código no es valido
    if(isNoValid){
      //Se muestra una alerta
      this.controllerService.alert('info', 'El código no coincide con la categoría actual');
      //Se pone el borde rojo
      this.renderer.addClass(this.codigo.nativeElement, 'border__error');
    //Si el código es válido se procesa el Equipo
    }else this.processDevice();
  }

  private processDevice(): void {
    //Se pasa el codigo a mayúsculas
    this.data = { ...this.data, codigo: this.data.codigo.toUpperCase() };
    //Se muestra el loading
    this.isLoading = true;
    //Se deshabilita el formulario
    this.renderer.setProperty(this.fieldset.nativeElement, 'disabled', 'true');
    //Peticion para Agregar el dispositivo
    this.dataService.http({ code: '010', data: this.data }).subscribe((resp: Resp) => {
      //Si el equipo se inserta correctamente
      if(resp.response === '001') {
        //Se borran todos los campos
        this.data = { ...this.data, categoria: '???', codigo: '', imagen: '' };
        //Se muestra una notificacion
        this.controllerService.toast('top', 'success', 'Equipo insertado con éxito!');
      }
      //Si el equipo ya existe
      if(resp.response === '002') {
        //Se muestra una alerta
        this.controllerService.alert('info', 'Este equipo ya existe y no se insertará');
        //se pone el campo codigo en rojo
        this.renderer.addClass(this.codigo.nativeElement, 'border__error');
      }
      //Si no se inserta el equipo
      if(resp.response === '003') this.controllerService.alert('error', 'Ha habido un problema al agregar el Equipo. Error: [010]003');
      //Se habilita el formulario
      this.renderer.setProperty(this.fieldset.nativeElement, 'disabled', '');
      //Se oculta el loading
      this.isLoading = false;
    });
  }
}
