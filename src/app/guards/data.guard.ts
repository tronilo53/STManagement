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
      //Escucha los datos del usuario logueado
      this.ipcService.once('getUserData', (event, args) => {
        //Guarda los datos del usuario en el sessionStorage y en el Bihavior
        this.storageService.setUserData(args.data);
        //guarda la version de la app en el sessionStorage
        sessionStorage.setItem('version', args.version);
        //Permite el acceso
        resolve(true);
      });
    });
  }
}
