import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { IpcService } from '../../services/ipc.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.css'
})
export class ChangelogComponent {

  constructor(
    private router: Router,
    private ipcService: IpcService,
    public storageService: StorageService,
    private ngZone: NgZone
  ) {}

  public redirectoHome(): void {
    //IPC para eliminar la bandera de instalacion de actualizacion
    this.ipcService.send('deleteChangeLog');
    this.ipcService.removeAllListeners('deleteChangeLog');
    //Redirige al Dashboard
    this.ngZone.run(() => this.router.navigate(['/Dashboard']));
  }

}
