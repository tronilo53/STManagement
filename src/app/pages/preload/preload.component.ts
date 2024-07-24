import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IpcService } from '../../services/ipc.service';

@Component({
  selector: 'app-preload',
  templateUrl: './preload.component.html',
  styleUrl: './preload.component.css'
})
export class PreloadComponent implements OnInit {

  /**
   * *Propiedades
   */
  public year: number = new Date().getFullYear();

  constructor(
    private router: Router,
    private ipcService: IpcService
  ) {}

  ngOnInit(): void {
    //IPC para comprobar si existe algun usuario Logueado
    this.ipcService.send('checkLogin');
    this.ipcService.once('checkLogin', (event, args) => {
      //Si existe algun usuario logueado...
      if(args !== false) {
        //Se guardan los datos del usuario en el sessionStorage
        sessionStorage.setItem('userData', JSON.stringify(args));
        //Se redirige al Dashboard
        this.router.navigate(['/Dashboard']);
      //Si no existe ningun usuario logueado redirige al login
      }else this.router.navigate(['/Login']);
    });
  }
}
