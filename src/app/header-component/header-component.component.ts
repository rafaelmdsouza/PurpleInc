import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.component.html',
})
export class HeaderComponentComponent {
  constructor() {}
  @Input() icon: string;
  @Input() headerTitle: string;
}
