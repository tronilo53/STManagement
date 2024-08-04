import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { IpcService } from '../../services/ipc.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  public currentUrl: string;

  constructor(
    public storageService: StorageService,
    private cp: ChangeDetectorRef,
    private router: Router,
    private ipcService: IpcService,
    private ngZone: NgZone
  ) {
    //Se intercepta la ruta que está en curso y se guarda en la variable 'currentUrl'
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }
  ngOnInit(): void {
    /**
     * !Subscripción obligatoria para detectar los cambios del BehaviorSubject
     */
    this.storageService.getUserDataObservable().subscribe(config => { this.cp.detectChanges() });
  }

  /**
   * *Function: Comprueba la ruta actual del dropdown 'Gestiones'
   * @returns Devuelve la ruta
   */
  public isDropdownActive_Manag(): boolean {
    return this.currentUrl === '/Dashboard/Simulation' ||
           this.currentUrl === '/Dashboard/Orders' ||
           this.currentUrl === '/Dashboard/Taxs';
  }
  /**
   * *Function: Comprueba la ruta actual del dropdown 'Stock'
   * @returns Devuelve la ruta
   */
  public isDropdownActive_Stock(): boolean {
    return this.currentUrl === '/Dashboard/Components' ||
           this.currentUrl === '/Dashboard/Devices';
  }

  /**
   * *Function: Se cierra sesión
   */
  public logout(): void {
    //IPC para borrar los datos del store
    this.ipcService.send('deleteLogin');
    //Elimina los datos del sessionStorage
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('version');
    //Redirige al Login detectando la zona de angular
    this.ngZone.run(() => { this.router.navigate(['/Login']) });
  }
}
