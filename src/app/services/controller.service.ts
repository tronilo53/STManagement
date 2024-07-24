import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor() { }

  /**
   * *Function: Se crea una alerta
   * @param icon Tipo de alerta ['error', 'success', 'info']
   * @param text Texto de la alerta
   */
  public alert(icon: any, text: string): void { Swal.fire({ icon, text, allowOutsideClick: false }) }

  /**
   * *Function: Se crea un loading
   * @param text Texto del loading
   */
  public loading(text: string): void { Swal.fire({ text, allowOutsideClick: false }); Swal.showLoading(); }

  /**
   * *Function: Se para el loading
   */
  public stop_loading(): void { if(Swal) Swal.close(); }

  /**
   * *Function: Crea Un toast
   * @param position Posicion del Toast
   * @param icon Icono del Toast 
   * @param title Titulo del Toast
   */
  public toast(position: any, icon: any, title: string): void { Swal.fire({ position, icon, title, showConfirmButton: false, timer: 1500 }) }
}
