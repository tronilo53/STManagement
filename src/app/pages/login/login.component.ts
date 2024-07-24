import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ControllerService } from '../../services/controller.service';
import { DataService } from '../../services/data.service';
import { IpcService } from '../../services/ipc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  /**
   * *Propiedades
   */
  @ViewChild('nombre_usuario') nombre_usuario: ElementRef;
  @ViewChild('clave') clave: ElementRef;
  private year: number = new Date().getFullYear();
  public data: any = { nombre_usuario: '', clave: '' };
  public remember: boolean = false;
  public typePass: string = 'password';
  public iconPass: string = 'visibility';

  constructor(
    private renderer: Renderer2,
    private controllerService: ControllerService,
    private dataService: DataService,
    private ipcService: IpcService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
  }

  /**
   * *Function: Obtiene el Año actual
   * @returns Devuelve el año en tipo Number
   */
  public getYear(): number { return this.year }

  /**
   * *Function: Muestra/Oculta la contraseña
   */
  public showPass(): void {
    if(this.iconPass === 'visibility' && this.typePass === 'password') {
      this.iconPass = 'visibility_off';
      this.typePass = 'text';
    }else {
      this.iconPass = 'visibility';
      this.typePass = 'password';
    }
  }

  /**
   * *Function: Se quita el borde rojo
   * @param element elemento a quitar
   */
  public deleteBorder(element: string): void {
    if(element === 'nombre_usuario') this.renderer.removeClass(this.nombre_usuario.nativeElement, '__error');
    else this.renderer.removeClass(this.clave.nativeElement, '__error');
  }

  /**
   * *Function: Se validan los datos del login
   */
  public validateData(): void {
    //Si alguno de los campos está vacio...
    if(this.data.nombre_usuario === '' || this.data.clave === '') {
      //Se muestra una alerta
      this.controllerService.alert('info', 'Todos los campos son requeridos');
      //Si nombre_usuario está vacio, se pone en rojo
      if(this.data.nombre_usuario === '') this. renderer.addClass(this.nombre_usuario.nativeElement, '__error');
      //Si clave está vacio, se pone en rojo
      if(this.data.clave === '') this.renderer.addClass(this.clave.nativeElement, '__error');
    //Si todos los campos están rellenos se intenta iniciar sesión
    }else this.login();
  }

  /**
   * *Function: Se procesan los datos del login
   */
  public login(): void {
    //Se muestra el loading
    this.controllerService.loading('Espere...');
    //Peticion para procesar los datos del login
    this.dataService.http({ code: '004', data: this.data }).subscribe((resp: any) => {
      //Si el usuario no existe...
      if(resp.response === '002') {
        //Se oculta el loading
        this.controllerService.stop_loading();
        //Se muestra una alerta
        this.controllerService.alert('info', 'Error: 004[002] Usuario o contraseña incorrectos');
      //Si la contraseña es incorrecta...
      }else if(resp.response === '003') {
        //Se oculta el loading
        this.controllerService.stop_loading();
        //Se muestra una alerta
        this.controllerService.alert('info', 'Error: 004[003] Usuario o contraseña incorrectos');
      //Si la cuenta está deshabilitada...
      }else if(resp.response === '004') {
        //Se oculta el loading
        this.controllerService.stop_loading();
        //Se muestra una alerta
        this.controllerService.alert('info', 'Error: 004[004] La cuenta que hace referencia está deshabilitada y no se puede usar');
      //si todo está bien...
      }else {
        //Se oculta el loading
        this.controllerService.stop_loading();
        //Si está marcado 'recordar cuenta'...
        if(this.remember) {
          //IPC para guardar los datos de sesión
          this.ipcService.send('setLogin', resp.data);
          this.ipcService.once('setLogin', (event, args) => {
            //si los datos no se guardan se muestra una alerta...
            if(args === '002') this.controllerService.alert('error', 'ERROR: [IPCSetLogin] Ha habido un error interno. Por favor, inténtelo de nuevo mas tarde');
            //Si se guardan los datos correctamente...
            else {
              //Se guardan los datos en el sessionStorage
              sessionStorage.setItem('userData', JSON.stringify(resp.data));
              //Se redirige al 'Dashboard'
              this.router.navigate(['/Dashboard']);
            }
          });
        //Si no está marcado 'recordar cuenta'...
        }else {
          //Se guardan los datos en el sessionStorage
          sessionStorage.setItem('userData', JSON.stringify(resp.data));
          //Se redirige al 'Dashboard'
          this.router.navigate(['/Dashboard']);
        }
      }
    });
  }
}
