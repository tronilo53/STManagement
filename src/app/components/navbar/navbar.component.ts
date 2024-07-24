import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

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
    private router: Router
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
   * *Function: Comprueba la ruta actual
   * @returns Devuelve la ruta
   */
  public isDropdownActive(): boolean {
    return this.currentUrl === '/Dashboard/Simulation' ||
           this.currentUrl === '/Dashboard/Orders' ||
           this.currentUrl === '/Dashboard/Taxs';
  }
}
