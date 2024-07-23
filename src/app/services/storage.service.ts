import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private themeTest: string = 'bg-warning';

  constructor() { }

  public getTheme(): string { return this.themeTest}
}
