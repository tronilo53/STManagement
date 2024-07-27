import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserData { nombre: string; nombre_usuario: string; avatar: string; tema: string; tipo_usuario: string; }
interface Data { version: string; changelog: string; }

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public UserDataBehavior: BehaviorSubject<UserData>
  private avatars: string[] = ['assets/avatars/Batman-256.png', 'assets/avatars/Capitan-America-256.png', 'assets/avatars/Daredevil-256.png', 'assets/avatars/Green-Lantern-256.png', 'assets/avatars/Invisible-Woman-256.png', 'assets/avatars/Mister-Fantastic-256.png', 'assets/avatars/Namor-256.png', 'assets/avatars/Silver-Surfer-256.png', 'assets/avatars/Superman-256.png', 'assets/avatars/the-Thing-256.png'];
  private themes: string[] = ['Sweet Honey', 'Healthy Sky', 'Tasty Licorice', 'Gray Storm'];

  constructor() {
    this.UserDataBehavior = new BehaviorSubject<UserData>(JSON.parse(sessionStorage.getItem('userData')));
  }

  /**
   * *Function: Se establece la configuracion en el sessionStorage
   * @param data objeto pasado
   */
  public setUserData(data: UserData): void {
    //Se actualiza o se crea el sessionStotage
    sessionStorage.setItem('userData', JSON.stringify(data));
    //Se modifica el BehaviorSubject con los nuevos datos
    this.UserDataBehavior.next(data);
  }

  /**
   * *Funtion: Obtiene los datos recientes del BehaviorSubject
   * @returns Devuelve un objeto de tipo UserData
   */
  public getUserData(): UserData { return this.UserDataBehavior.getValue() }

  /**
   * !Función Valida para los cambios en el Navbar
   * *Function: Obtiene los datos recientes de BehaviorSubject
   * @returns Devuelve un Observable para subscribirse
   */
  public getUserDataObservable(): Observable<UserData> { return this.UserDataBehavior.asObservable() }

  /**
   * *Function: Obtiene los avatares
   * @returns Devuelve un array de tipo String
   */
  public getAvatars(): string[] { return this.avatars }

  /**
   * *Function: Obtiene los temas
   * @returns Devuelve un array de tipo String
   */
  public getThemes(): string[] { return this.themes }

  /**
   * *Function: Obtiene la version de la app y el CHANGELOG
   * @returns Devuelve un Objeto de tipo Data
   */
  public getData(): Data { return { version: sessionStorage.getItem('version'), changelog: sessionStorage.getItem('changeLog') } }

  /**
   * *Function: Obtiene la/s clases css que se deben aplicar
   * @param type Tipo de elemento a aplicar la clase
   * @returns Devuelve la/s clases css en tipo String
   */
  public getThemeCss(type: string): string {
    //Se crea una variable vacia de tipo String
    let addClass: string = '';
    //Si el elemento recibido es un Botón Se aplica la clase correspondiente dependiendo del tema aplicado
    if(type === 'button') {
      switch(this.getUserData().tema) {
        case 'Sweet Honey': addClass = 'btn btn-warning'; break;
        case 'Healthy Sky': addClass = 'btn btn-primary'; break;
        case 'Tasty Licorice': addClass = 'btn btn-danger'; break;
        case 'Gray Storm': addClass = 'btn btn-secondary'; break;
      }
    //Si el elemento recibido es un Nav Se aplica la clase correspondiente dependiendo del tema aplicado
    }else if(type === 'nav') {
      switch(this.getUserData().tema) {
        case 'Sweet Honey': addClass = 'bg-warning'; break;
        case 'Healthy Sky': addClass = 'bg-primary'; break;
        case 'Tasty Licorice': addClass = 'bg-danger'; break;
        case 'Gray Storm': addClass = 'bg-secondary'; break;
      }
    }else if(type === 'alert') {
      switch(this.getUserData().tema) {
        case 'Sweet Honey': addClass = 'alert alert-warning'; break;
        case 'Healthy Sky': addClass = 'alert alert-primary'; break;
        case 'Tasty Licorice': addClass = 'alert alert-danger'; break;
        case 'Gray Storm': addClass = 'alert alert-secondary'; break;
      }
    }else if(type === 'badge') {
      switch(this.getUserData().tema) {
        case 'Sweet Honey': addClass = 'badge text-bg-warning'; break;
        case 'Healthy Sky': addClass = 'badge text-bg-primary'; break;
        case 'Tasty Licorice': addClass = 'badge text-bg-danger'; break;
        case 'Gray Storm': addClass = 'badge text-bg-secondary'; break;
      }
    }else if(type === 'text') {
      switch(this.getUserData().tema) {
        case 'Sweet Honey': addClass = 'text-warning'; break;
        case 'Healthy Sky': addClass = 'text-primary'; break;
        case 'Tasty Licorice': addClass = 'text-danger'; break;
        case 'Gray Storm': addClass = 'text-secondary'; break;
      }
    }else if(type === 'progress-bar') {
      switch(this.getUserData().tema) {
        case 'Sweet Honey': addClass = 'progress-bar bg-warning'; break;
        case 'Healthy Sky': addClass = 'progress-bar bg-primary'; break;
        case 'Tasty Licorice': addClass = 'progress-bar bg-danger'; break;
        case 'Gray Storm': addClass = 'progress-bar bg-secondary'; break;
      }
    }else if(type === 'swal') {
      switch(this.getUserData().tema) {
        case 'Sweet Honey': addClass = '#ffc107'; break;
        case 'Healthy Sky': addClass = '#0d6efd'; break;
        case 'Tasty Licorice': addClass = '#dc3545'; break;
        case 'Gray Storm': addClass = '#6c757d'; break;
      }
    }
    //Devuelve la/s clases css
    return addClass;
  }
}
