import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService, UserData } from '../../../services/storage.service';
import { ControllerService } from '../../../services/controller.service';
import { IpcService } from '../../../services/ipc.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  /**
   * *Propiedades
   */
  public avatarSelect: string | null = null;
  public selectedTheme: string | null = null;

  constructor(
    public storageService: StorageService,
    private controllerService: ControllerService,
    private ipcService: IpcService,
    private dataService: DataService,
    private cp: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //Se guarda el tema actual en la variable 'selectedTheme' para el ngModel
    this.selectedTheme = this.storageService.getUserData().tema;
  }

  /**
   * *Function: Selección de avatar en el DOM
   * @param item Avatar elegido
   */
  public selectAvatar(item: string): void {
    //Si hay un avatar elegido...
    if(this.avatarSelect) {
      //Si el avatar elegido es igual al clickeado, el avatar elegido se resetea
      if(this.avatarSelect === item) this.avatarSelect = null;
      //Si el avatar elegido es distinto al clickeado, el avatar elegido será igual al clickeado.
      else this.avatarSelect = item;
    //Si no hay un avatar elegido, el avatar elegido será igual al clickeado.
    }else this.avatarSelect = item;
  }

  public getType(theme: string): string {
    let themeClass: string = '';
    switch(theme) {
      case 'Sweet Honey': themeClass = 'bg-warning'; break;
      case 'Healthy Sky': themeClass = 'bg-primary'; break;
      case 'Tasty Licorice': themeClass = 'bg-danger'; break;
      case 'Gray Storm': themeClass = 'bg-secondary'; break;
    }
    return themeClass;
  }

  /**
   * *Function: Establece el avatar en el storageService
   */
  public setAvatar(): void {
    //Si no hay ningun avatar seleccionado...
    if(!this.avatarSelect) this.controllerService.alert('info', 'No se ha seleccionado ningún avatar');
    //Si se selecciona algun avatar...
    else {
      //Si el avatar que se selecciona es igual al avatar ya establecido se muestra una alerta
      if(this.avatarSelect === this.storageService.getUserData().avatar) this.controllerService.alert('info', 'Este avatar ya está establecido');
      //Si se selecciona un avatar diferente...
      else {
        //Se muestra el loading
        this.controllerService.loading('Espere...');
        //Se crea un nuevo Objeto con el nuevo avatar
        const data: UserData = {...this.storageService.getUserData(), avatar: this.avatarSelect};
        //Se creo un nuevo objeto para enviarlo
        const dataSend: any = {avatar: data.avatar, nombre_usuario: data.nombre_usuario, item: 'avatar'};
        //Peticion para cambiar el avatar del usuario
        this.dataService.http({ code: '005', data: dataSend }).subscribe((resp: any) => {
          //Si se actualiza el avatar...
          if(resp.response === '001') {
            //IPC para guardar los datos de configuracion en el store
            this.ipcService.send('setLogin', data);
            this.ipcService.once('setLogin', (event, args) => {
              //Si se guardan los datos correctamente...
              if(args === '001') {
                //Se modifica la configuración en el sessionStorage y en el Behavior
                this.storageService.setUserData(data);
                //Se restablece el avatar
                this.avatarSelect = null;
                //Se oculta el loading
                this.controllerService.stop_loading();
                //Se muestra una notificación
                this.controllerService.toast('top-end', 'success', 'Avatar Actualizado!');
                //Se detectan los cambios en la vista
                this.cp.detectChanges();
              //Si los datos no se guardan correctamente...
              }else {
                //Se oculta el loading
                this.controllerService.stop_loading();
                //Se muestra una alerta
                this.controllerService.alert('error', 'No se han guardardado los datos de Configuración');
              }
            });
          //Si no se actualiza el avatar...
          }else {
            //Se oculta el loading
            this.controllerService.stop_loading();
            //Se muestra una alerta
            this.controllerService.alert('error', 'Error: 005[002] Ha habido un error interno, por favor, inténtelo de nuevo más tarde.');
          }
        });
      }
    }
  }

  /**
   * *Function: Establece el Tema en el storageService
   */
  public setTheme(): void {
    //Se muestra el loading
    this.controllerService.loading('Espere...');
    //Si el tema seleccionado es igual al tema actual, se muestra una alerta
    if(this.selectedTheme === this.storageService.getUserData().tema) this.controllerService.alert('info', 'Este tema ya está aplicado');
    //Si el tema seleccionado es distinto...
    else {
      //Se crea un nuevo Objeto
      const data: UserData = {...this.storageService.getUserData(), tema: this.selectedTheme};
      //Se crea un nuevo objeto para enviar
      const dataSend: any = { tema: data.tema, nombre_usuario: data.nombre_usuario, item: 'tema' };
      //Peticion para cambiar el tema
      this.dataService.http({ code: '005', data: dataSend }).subscribe((resp: any) => {
        //Si se actualiza el tema...
        if(resp.response === '001') {
          //IPC para guardar los datos de configuracion en el store
          this.ipcService.send('setLogin', data);
          this.ipcService.once('setLogin', (event, args) => {
            //Si se guardan los datos correctamente...
            if(args === '001') {
              //Se guarda la configuracion en el sessionStorage y en el Behavior
              this.storageService.setUserData(data);
              //Se restablece el tema con el aplicado
              this.selectedTheme = this.storageService.getUserData().tema;
              //Se oculta el loading
              this.controllerService.stop_loading();
              //Se muestra una notificación
              this.controllerService.toast('top-end', 'success', 'Tema Actualizado!');
              //Se detectan los cambios en la vista
              this.cp.detectChanges();
            //Si los datos no se guardan correctamente...
            }else {
              //Se oculta el loading
              this.controllerService.stop_loading();
              //Se muestra una alerta
              this.controllerService.alert('error', 'No se han guardardado los datos de Configuración');
            }
          });
        //Si no se actualiza el tema...
        }else {
          //Se oculta el loading
          this.controllerService.stop_loading();
          //Se muestra una alerta
          this.controllerService.alert('error', 'Error: 005[002] Ha habido un error interno, por favor, inténtelo de nuevo más tarde.');
        }
      });
    }
  }
}
