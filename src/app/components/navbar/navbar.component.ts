import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(
    public storageService: StorageService,
    private cp: ChangeDetectorRef
  ) {

  }
  ngOnInit(): void {
    /**
     * !Subscripción obligatoria para detectar los cambios del BehaviorSubject
     */
    this.storageService.getConfigObservable().subscribe(config => {
      this.cp.detectChanges();
    });
  }
}
