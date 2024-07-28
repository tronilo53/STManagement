import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IpcService } from '../../services/ipc.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-preload',
  templateUrl: './preload.component.html',
  styleUrl: './preload.component.css'
})
export class PreloadComponent implements AfterViewInit {

  /**
   * *Propiedades
   */
  public year: number = new Date().getFullYear();

  constructor(
    private router: Router,
    private ipcService: IpcService,
    private dataService: DataService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    //IPC para comprobar si existe algun usuario Logueado
    this.ipcService.send('checkLogin');
    this.ipcService.once('checkLogin', (event, args) => {
      //Si existe algun usuario logueado...
      if(args !== false) {
        //Peticion para iniciar sesión
        this.dataService.http({ code: '004', data: args }).subscribe((resp: any) => {
          //Si el usuario no existe o la contraseña es incorrecta o la cuenta está deshabilitada
          if(resp.response !== '001') {
            //Se elimina el store
            this.ipcService.send('deleteLogin');
            //Redirige al login detectando la zona de angular
            this.ngZone.run(() => { this.router.navigate(['/Login']) });
          //Si todo está correcto..
          }else {
            //Se guardan los datos en el sessionStorage
            sessionStorage.setItem('userData', JSON.stringify(resp.data));
            //IPC para obtener la version de la app
            this.ipcService.send('getVersion');
            this.ipcService.once('getVersion', (event, args) => {
              //se guarda la version en el sessionStorage
              sessionStorage.setItem('version', args);
              //Guarda la bandera de flagUpdate en 'false' para que muestre si hay updates
              sessionStorage.setItem('flagUpdate', 'false');
              //Redirige al Dashboard detectando la zona de angular
              this.ngZone.run(() => { this.router.navigate(['/Dashboard']) });
            });
          }
        });
      //Si no existe ningun usuario logueado redirige al login detectando la zona angular
      }else this.ngZone.run(() => { this.router.navigate(['/Login']) });
    });
  }
}
