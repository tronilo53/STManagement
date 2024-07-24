import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar-theme',
  templateUrl: './navbar-theme.component.html',
  styleUrl: './navbar-theme.component.css'
})
export class NavbarThemeComponent {

  @Input() typeNav: string = 'bg-warning';

}
