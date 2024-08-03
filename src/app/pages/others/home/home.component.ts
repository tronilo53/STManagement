import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IpcService } from '../../../services/ipc.service';
import { Router } from '@angular/router';
import { ControllerService } from '../../../services/controller.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {

  /**
   * *Propiedades de la clase
   */
  @ViewChild('loadingProcess') loadingProcess: ElementRef;
  @ViewChild('process') process: ElementRef;

  constructor(
    private ipcService: IpcService,
    private router: Router,
    private controllerService: ControllerService,
    public storageService: StorageService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    //IPC Para comprobar si se ha instalado una actualización
    this.ipcService.send('checkChangeLog');
    this.ipcService.once('checkChangeLog', (event, args) => { if(args != false) this.router.navigate(['/ChangeLog']) });
  }
  ngAfterViewInit(): void {
    //Escucha si está buscando actualizaciones
    this.ipcService.on('checking_for_update', (event, args) => {
      this.controllerService.loading('Buscando Actualizaciones...');
    });
    //Escucha si hay una actualización disponible
    this.ipcService.on('update_available', (event, data) => {
      if(Swal) this.controllerService.stop_loading();
      this.update_available(data)
    });
    //Escucha si no hay ninguna actualización disponible
    this.ipcService.on('update_not_available', (event, args) => {
      if(Swal) this.controllerService.stop_loading();
    });
    //Escucha el progreso de la descarga
    this.ipcService.on('download_progress', (event, progressObj) => {
      this.renderer.setStyle(this.process.nativeElement, 'width', `${progressObj}%`);
      this.renderer.setProperty(this.process.nativeElement, 'innerHTML', `${progressObj}%`);
    });
    //escucha si la actualización se ha descargado
    this.ipcService.on('update_downloaded', (event, args) => {
      if(args === 'windows') this.ipcService.send('installApp');
      else {
        if(args !== '001') {
          Swal.fire({
            icon: 'error',
            text: `Error Updates: ${JSON.stringify(args)}`,
            allowOutsideClick: false
          });
        }else this.ipcService.send('closeApp');
      }
    });
  }
  
  /**
   * *Function: Muestra una alerta de actualización disponible
   */
  private update_available(data: any): void {
    Swal.fire({
      title: "Actualización Disponible!",
      html: `Hay una actualización disponible<br>Versión: <strong>${data.version}</strong><br>¿Quieres descargarla ahora?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: `${this.storageService.getThemeCss('swal')}`,
      cancelButtonColor: "var(--bs-danger)",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Si, descargar ahora",
      allowOutsideClick: false
    }).then((result) => {
      //Si se clickea a 'Si, descargar ahora'...
      if (result.isConfirmed) {
        //Se muestra la ventana de descarga
        this.renderer.removeClass(this.loadingProcess.nativeElement, 'none');
        //Se envia ipc para descargar la App
        this.ipcService.send('downloadApp');
      }else if(result.dismiss === Swal.DismissReason.cancel) sessionStorage.setItem('flagUpdate', 'true');
    });
  }
}
