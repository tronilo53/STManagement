import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { IpcService } from '../services/ipc.service';

@Injectable({
  providedIn: 'root'
})
export class DataGuard implements CanActivate {

  constructor(
    private storageService: StorageService,
    private ipcService: IpcService
  ) { }

  canActivate(): Promise<boolean> {
    //Devuelve una promesa
    return new Promise((resolve) => {
      if(!sessionStorage.getItem('version') || !sessionStorage.getItem('changeLog')) {
        //Obtiene los datos del usuario logueado y los datos de la aplicacion
        this.ipcService.once('getUserData', (event, args) => {
          //Guarda los datos del usuario en el sessionStorage y en el Bihavior
          this.storageService.setUserData(args.data);
          //guarda la version de la app en el sessionStorage
          sessionStorage.setItem('version', args.version);
          //Guarda los datos del changelog en el sessionStorage
          sessionStorage.setItem('changeLog', args.changelog);
          //Permite el acceso
          resolve(true);
        });
      }else resolve(true);
    });
  }
}
