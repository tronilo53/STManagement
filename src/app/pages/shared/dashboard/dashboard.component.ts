import { Component } from '@angular/core';
import { IpcService } from '../../../services/ipc.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(
    private ipcService: IpcService,
    private storageService: StorageService
  ) {
    ipcService.once('getUserData', (event, args) => { this.storageService.setUserData(args) });
  }
}
