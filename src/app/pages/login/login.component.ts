import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  /**
   * *Propiedades
   */
  private year: number = new Date().getFullYear();

  constructor() {}

  /**
   * *Function: Obtiene el Año actual
   * @returns Devuelve el año en tipo Number
   */
  public getYear(): number { return this.year }
}
